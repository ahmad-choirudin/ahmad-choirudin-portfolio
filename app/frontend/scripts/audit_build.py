#!/usr/bin/env python3
"""Audit the build output (dist/) before deploying.

Catches things that quietly hurt SEO and links:
  - sitemap.xml: every URL has an HTML file, and every page is in the sitemap
  - title, description, canonical, and Open Graph tags on each page
  - valid JSON-LD, no duplicate titles or descriptions
  - internal links and assets (href/src starting with "/") exist in dist/
  - robots.txt points to a sitemap on the same domain
  - oversized files

Uses only the Python standard library, so it runs in CI with nothing to install.

    python3 scripts/audit_build.py              # audit dist/
    python3 scripts/audit_build.py --strict     # treat warnings as failures
    python3 scripts/audit_build.py path/to/dist
"""
from __future__ import annotations

import argparse
import json
import sys
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parent.parent
TITLE_MAX = 65
DESC_MIN, DESC_MAX = 50, 160
FILE_WARN_KB = 400
SITEMAP_NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
OG_REQUIRED = ("og:title", "og:description", "og:url", "og:image")

USE_COLOR = sys.stdout.isatty()


def paint(code: str, text: str) -> str:
    return f"\033[{code}m{text}\033[0m" if USE_COLOR else text


class Page(HTMLParser):
    """Collects the title, meta tags, canonical, internal links, and JSON-LD of one page."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.title = ""
        self.meta: dict[str, str] = {}
        self.canonical = ""
        self.refs: list[str] = []
        self.jsonld: list[str] = []
        self._in_title = False
        self._in_ld = False
        self._ld_buf: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        a = {k: (v or "") for k, v in attrs}
        if tag == "title":
            self._in_title = True
        elif tag == "meta":
            key = a.get("name") or a.get("property")
            if key:
                self.meta[key] = a.get("content", "")
        elif tag == "link" and a.get("rel") == "canonical":
            self.canonical = a.get("href", "")
        elif tag == "script" and a.get("type") == "application/ld+json":
            self._in_ld = True
            self._ld_buf = []
        for attr in ("href", "src"):
            if attr in a:
                self.refs.append(a[attr])

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self._in_title = False
        elif tag == "script" and self._in_ld:
            self._in_ld = False
            self.jsonld.append("".join(self._ld_buf))

    def handle_data(self, data: str) -> None:
        if self._in_title:
            self.title += data
        elif self._in_ld:
            self._ld_buf.append(data)


class Report:
    def __init__(self) -> None:
        self.errors: list[str] = []
        self.warnings: list[str] = []

    def error(self, where: str, msg: str) -> None:
        self.errors.append(f"{where}: {msg}")

    def warn(self, where: str, msg: str) -> None:
        self.warnings.append(f"{where}: {msg}")


def page_file(dist: Path, path: str) -> Path:
    return dist / "index.html" if path in ("", "/") else dist / path.strip("/") / "index.html"


def ref_exists(dist: Path, ref: str) -> bool:
    path = unquote(urlparse(ref).path)
    if path in ("", "/"):
        return True
    rel = path.lstrip("/")
    return any(c.exists() for c in (dist / rel, dist / f"{rel}.html", dist / rel / "index.html"))


def load_sitemap(dist: Path, report: Report) -> tuple[str, list[str]]:
    sitemap = dist / "sitemap.xml"
    if not sitemap.exists():
        report.error("sitemap.xml", "not found in dist/")
        return "", []
    try:
        tree = ET.parse(sitemap)
    except ET.ParseError as exc:
        report.error("sitemap.xml", f"invalid XML ({exc})")
        return "", []
    locs = [e.text.strip() for e in tree.findall(".//sm:loc", SITEMAP_NS) if e.text]
    if not locs:
        report.error("sitemap.xml", "contains no URLs")
        return "", []
    first = urlparse(locs[0])
    origin = f"{first.scheme}://{first.netloc}"
    return origin, [urlparse(u).path or "/" for u in locs]


def check_page(dist: Path, file: Path, label: str, origin: str, path: str | None, report: Report) -> Page:
    page = Page()
    page.feed(file.read_text(encoding="utf-8"))

    title = page.title.strip()
    if not title:
        report.error(label, "<title> is empty")
    elif len(title) > TITLE_MAX:
        report.warn(label, f"title is {len(title)} characters (recommended <= {TITLE_MAX})")

    if path is not None:
        desc = page.meta.get("description", "").strip()
        if not desc:
            report.error(label, "meta description is missing")
        elif not DESC_MIN <= len(desc) <= DESC_MAX:
            report.warn(label, f"description is {len(desc)} characters (recommended {DESC_MIN}-{DESC_MAX})")

        expected = f"{origin}{path}".rstrip("/")
        if not page.canonical:
            report.error(label, "canonical is missing")
        elif page.canonical.rstrip("/") != expected:
            report.error(label, f"canonical {page.canonical} does not match the sitemap ({expected})")

        for key in OG_REQUIRED:
            if not page.meta.get(key):
                report.error(label, f"{key} tag is missing")

    for i, block in enumerate(page.jsonld, 1):
        try:
            json.loads(block)
        except json.JSONDecodeError as exc:
            report.error(label, f"JSON-LD #{i} is invalid ({exc.msg})")

    for ref in page.refs:
        if not ref.startswith("/") or ref.startswith("//"):
            continue
        if not ref_exists(dist, ref):
            report.error(label, f"internal reference not found: {ref}")
    return page


def check_robots(dist: Path, origin: str, report: Report) -> None:
    robots = dist / "robots.txt"
    if not robots.exists():
        report.warn("robots.txt", "not found in dist/")
        return
    lines = [ln.split(":", 1)[1].strip() for ln in robots.read_text().splitlines() if ln.lower().startswith("sitemap:")]
    if not lines:
        report.warn("robots.txt", "no Sitemap line")
    elif origin and not any(ln.startswith(origin) for ln in lines):
        report.error("robots.txt", f"Sitemap does not use the same domain as sitemap.xml ({origin})")


def check_sizes(dist: Path, report: Report) -> int:
    total = 0
    for f in dist.rglob("*"):
        if not f.is_file():
            continue
        size = f.stat().st_size
        total += size
        if size > FILE_WARN_KB * 1024:
            report.warn(str(f.relative_to(dist)), f"{size // 1024} KB (suggested limit {FILE_WARN_KB} KB)")
    return total


def run(dist: Path) -> Report:
    report = Report()
    if not (dist / "index.html").exists():
        report.error("dist/", "index.html is missing. Run `npm run build` first")
        return report

    origin, paths = load_sitemap(dist, report)
    seen_titles: dict[str, str] = {}
    seen_descs: dict[str, str] = {}

    for path in paths:
        file = page_file(dist, path)
        label = path
        if not file.exists():
            report.error(label, f"listed in the sitemap but {file.relative_to(dist)} does not exist")
            continue
        page = check_page(dist, file, label, origin, path, report)
        for seen, value, name in ((seen_titles, page.title.strip(), "title"), (seen_descs, page.meta.get("description", "").strip(), "description")):
            if value and value in seen:
                report.error(label, f"{name} is the same as on page {seen[value]}")
            elif value:
                seen[value] = label

    in_sitemap = {page_file(dist, p).resolve() for p in paths}
    for file in dist.rglob("index.html"):
        if file.resolve() not in in_sitemap and "assets" not in file.parts:
            report.warn(str(file.relative_to(dist)), "page is not listed in sitemap.xml")

    not_found = dist / "404.html"
    if not_found.exists():
        check_page(dist, not_found, "404.html", origin, None, report)
    else:
        report.warn("404.html", "not found in dist/")

    check_robots(dist, origin, report)
    total = check_sizes(dist, report)
    print(f"Checked {len(paths)} pages in the sitemap, dist total {total / 1024:.0f} KB\n")
    return report


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("dist", nargs="?", default=str(ROOT / "dist"), help="build output folder (default: dist/)")
    parser.add_argument("--strict", action="store_true", help="treat warnings as failures")
    args = parser.parse_args()

    report = run(Path(args.dist).resolve())

    for msg in report.errors:
        print(paint("31", "FAIL ") + msg)
    for msg in report.warnings:
        print(paint("33", "WARN ") + msg)

    failed = bool(report.errors) or (args.strict and bool(report.warnings))
    status = paint("31", "Audit failed") if failed else paint("32", "Audit passed")
    print(f"\n{status}: {len(report.errors)} errors, {len(report.warnings)} warnings")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
