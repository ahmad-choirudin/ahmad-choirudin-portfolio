#!/usr/bin/env python3
"""Check and optimize images in public/.

    python3 scripts/optimize_images.py --check   # no dependencies, suited for CI
    python3 scripts/optimize_images.py --apply   # create .webp versions (needs: pip install pillow)

--check fails when an image exceeds the size budget, and warns about PNG/JPG files
that still have a .webp twin (likely leftovers that are no longer used).
--apply converts PNG/JPG to .webp in the same folder and downsizes images wider than
--max-width. Originals are never deleted, and existing .webp files are not replaced
unless --force is used.
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
RASTER = {".png", ".jpg", ".jpeg", ".webp"}
SOURCES = {".png", ".jpg", ".jpeg"}
# Must stay PNG/JPG: read by social media crawlers, browsers, and the manifest.
KEEP = {"og-image.jpg", "favicon.png", "logo.png"}


def images(folder: Path) -> list[Path]:
    return sorted(p for p in folder.rglob("*") if p.is_file() and p.suffix.lower() in RASTER)


def kb(path: Path) -> float:
    return path.stat().st_size / 1024


def check(folder: Path, budget_kb: int) -> int:
    files = images(folder)
    over = [p for p in files if kb(p) > budget_kb]
    leftovers = [
        p for p in files
        if p.suffix.lower() in SOURCES and p.name not in KEEP and p.with_suffix(".webp").exists()
    ]

    print(f"Checked {len(files)} images (budget {budget_kb} KB per file)\n")
    for p in over:
        print(f"FAIL {p.relative_to(folder)}: {kb(p):.0f} KB exceeds the budget")
    for p in leftovers:
        print(f"WARN {p.relative_to(folder)}: {p.with_suffix('.webp').name} already exists, is this file still used?")

    print(f"\n{'Failed' if over else 'Passed'}: {len(over)} over budget, {len(leftovers)} possible leftovers")
    return 1 if over else 0


def apply(folder: Path, quality: int, max_width: int, force: bool) -> int:
    try:
        from PIL import Image
    except ImportError:
        print("Pillow is not installed. Run: pip install pillow", file=sys.stderr)
        return 2

    converted = 0
    for src in (p for p in images(folder) if p.suffix.lower() in SOURCES and p.name not in KEEP):
        dst = src.with_suffix(".webp")
        if dst.exists() and not force:
            continue
        with Image.open(src) as im:
            if im.width > max_width:
                im = im.resize((max_width, round(im.height * max_width / im.width)), Image.LANCZOS)
            im.save(dst, "WEBP", quality=quality, method=6)
        saved = 100 - kb(dst) / kb(src) * 100
        print(f"{src.relative_to(folder)} ({kb(src):.0f} KB) -> {dst.name} ({kb(dst):.0f} KB, saved {saved:.0f}%)")
        converted += 1

    print(f"\nConverted {converted} images" if converted else "Nothing to convert")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--check", action="store_true", help="check image sizes")
    mode.add_argument("--apply", action="store_true", help="convert PNG/JPG to WebP")
    parser.add_argument("--dir", default=str(PUBLIC), help="image folder (default: public/)")
    parser.add_argument("--budget", type=int, default=300, help="max KB per image for --check")
    parser.add_argument("--quality", type=int, default=82, help="WebP quality for --apply")
    parser.add_argument("--max-width", type=int, default=1600, help="max width for --apply")
    parser.add_argument("--force", action="store_true", help="convert again even if the .webp already exists")
    args = parser.parse_args()

    folder = Path(args.dir).resolve()
    if args.check:
        return check(folder, args.budget)
    return apply(folder, args.quality, args.max_width, args.force)


if __name__ == "__main__":
    sys.exit(main())
