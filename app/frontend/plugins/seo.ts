import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import type { Plugin } from "vite";
import {
  OG_IMAGE,
  PERSON_DESCRIPTION,
  PERSON_JOB_TITLE,
  SITE_NAME,
  SITE_URL,
  projectPath,
  projectRoutes,
  routes,
  type RouteMeta,
} from "../src/config/seo.ts";
import { site } from "../src/data/site.ts";
import { projects } from "../src/data/projects.ts";
import { expertise } from "../src/data/expertise.ts";
import { experience } from "../src/data/experience.ts";
import { faq } from "../src/data/faq.ts";

// Plugin build: setelah `vite build`, buat HTML statis per route (work/index.html, about/index.html, ...)
// dengan title, deskripsi, canonical, OG, dan JSON-LD yang benar, sehingga crawler tanpa JavaScript
// membaca isi yang tepat. Juga membuat sitemap.xml, llms-full.txt, dan 404.html.

// Semua halaman yang dibuat statis: halaman utama + satu halaman case study per proyek.
const allRoutes = (): RouteMeta[] => [...Object.values(routes), ...projectRoutes()];

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const jsonLd = (data: Record<string, unknown>) =>
  `    <script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", ...data }).replace(/</g, "\\u003c")}</script>\n`;

const urlOf = (path: string) => (path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`);

// Mengganti tag yang ada. Jika tag tidak ditemukan, build sengaja gagal supaya perubahan
// di index.html yang merusak SEO tidak lolos diam-diam.
function replaceTag(html: string, pattern: RegExp, replacement: string, what: string): string {
  if (!pattern.test(html)) throw new Error(`[seo] tag tidak ditemukan di index.html: ${what}`);
  return html.replace(pattern, () => replacement);
}

const metaPattern = (attr: "name" | "property", value: string) =>
  new RegExp(`<meta\\s+${attr}="${value}"\\s+content="[^"]*"\\s*/?>`);

const person = () => ({
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  image: OG_IMAGE,
  jobTitle: PERSON_JOB_TITLE,
  description: PERSON_DESCRIPTION,
  nationality: "Indonesian",
  knowsAbout: expertise.map((e) => e.name),
  sameAs: site.socials.map((s) => s.href),
});

function extraJsonLd(route: RouteMeta): string {
  const blocks: string[] = [];

  blocks.push(
    jsonLd({
      "@type": "WebPage",
      "@id": `${urlOf(route.path)}#webpage`,
      url: urlOf(route.path),
      name: route.title,
      description: route.description,
      isPartOf: { "@type": "WebSite", name: SITE_NAME, url: `${SITE_URL}/` },
      about: { "@id": `${SITE_URL}/#person` },
    })
  );

  if (route.path === "/") {
    blocks.push(jsonLd({ "@type": "WebSite", name: SITE_NAME, url: `${SITE_URL}/`, inLanguage: "en" }));
  } else {
    blocks.push(
      jsonLd({
        "@type": "BreadcrumbList",
        itemListElement: [
          { name: "Home", path: "/" },
          ...(route.crumbs ?? []),
          { name: route.label, path: route.path },
        ].map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: urlOf(c.path) })),
      })
    );
  }

  if (route.path === "/work") {
    blocks.push(
      jsonLd({
        "@type": "ItemList",
        name: "Selected projects",
        itemListElement: projects.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "CreativeWork",
            name: p.title,
            description: p.text,
            url: urlOf(projectPath(p)),
            sameAs: [p.demo],
            image: `${SITE_URL}${p.image}`,
            creator: { "@id": `${SITE_URL}/#person` },
          },
        })),
      })
    );
  }

  const project = projects.find((p) => projectPath(p) === route.path);
  if (project) {
    blocks.push(
      jsonLd({
        "@type": "CreativeWork",
        name: project.title,
        description: project.text,
        url: urlOf(route.path),
        image: `${SITE_URL}${project.image}`,
        keywords: project.tools,
        genre: project.category,
        sameAs: [project.demo, project.github],
        creator: { "@id": `${SITE_URL}/#person` },
      })
    );
  }

  if (route.faq) {
    blocks.push(
      jsonLd({
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      })
    );
  }

  return blocks.join("");
}

function pageHtml(base: string, route: RouteMeta): string {
  const url = urlOf(route.path);
  let html = base;

  html = replaceTag(html, /<title>[\s\S]*?<\/title>/, `<title>${esc(route.title)}</title>`, "title");
  html = replaceTag(
    html,
    metaPattern("name", "description"),
    `<meta name="description" content="${esc(route.description)}" />`,
    "meta description"
  );
  html = replaceTag(
    html,
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${url}" />`,
    "canonical"
  );
  html = replaceTag(html, metaPattern("property", "og:title"), `<meta property="og:title" content="${esc(route.title)}" />`, "og:title");
  html = replaceTag(
    html,
    metaPattern("property", "og:description"),
    `<meta property="og:description" content="${esc(route.description)}" />`,
    "og:description"
  );
  html = replaceTag(html, metaPattern("property", "og:url"), `<meta property="og:url" content="${url}" />`, "og:url");
  html = replaceTag(html, metaPattern("name", "twitter:title"), `<meta name="twitter:title" content="${esc(route.title)}" />`, "twitter:title");
  html = replaceTag(
    html,
    metaPattern("name", "twitter:description"),
    `<meta name="twitter:description" content="${esc(route.description)}" />`,
    "twitter:description"
  );

  // Ganti blok Person statis dengan versi yang diperkaya (@id, knowsAbout, sameAs dari data situs).
  html = replaceTag(
    html,
    /<script type="application\/ld\+json">\s*\{\s*"@context": "https:\/\/schema\.org",\s*"@type": "Person"[\s\S]*?<\/script>\n?/,
    jsonLd(person()).replace(/^ {4}/, ""),
    "JSON-LD Person"
  );

  return replaceTag(html, /<\/head>/, `${extraJsonLd(route)}  </head>`, "</head>");
}

function notFoundHtml(base: string): string {
  let html = base;
  html = replaceTag(html, /<title>[\s\S]*?<\/title>/, `<title>Page not found — ${SITE_NAME}</title>`, "title");
  html = replaceTag(
    html,
    metaPattern("name", "description"),
    `<meta name="description" content="This page does not exist." />`,
    "meta description"
  );
  html = replaceTag(html, /\s*<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/, "", "canonical");
  return replaceTag(html, /<\/head>/, `    <meta name="robots" content="noindex" />\n  </head>`, "</head>");
}

function sitemapXml(today: string): string {
  const urls = allRoutes()
    .map(
      (r) =>
        `  <url><loc>${urlOf(r.path)}</loc><lastmod>${today}</lastmod><changefreq>${r.changefreq}</changefreq><priority>${r.priority}</priority></url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

// Profil lengkap dalam teks polos untuk AI/LLM. Dibuat dari data yang sama dengan website.
function llmsFull(): string {
  const lines: string[] = [];
  lines.push(`# ${SITE_NAME}`, "", `> ${PERSON_DESCRIPTION}`, "");
  lines.push("## Contact", "");
  lines.push(`- Website: ${SITE_URL}/`, `- Email: ${site.email}`);
  for (const s of site.socials) lines.push(`- ${s.label}: ${s.href}`);

  lines.push("", "## Pages", "");
  for (const r of allRoutes()) lines.push(`- [${r.label}](${urlOf(r.path)}): ${r.description}`);

  lines.push("", "## Experience", "");
  for (const e of experience) {
    lines.push(`- **${e.title}** (${e.period}) — ${e.org}. ${e.text}${e.tags?.length ? ` Platforms: ${e.tags.join(", ")}.` : ""}`);
  }

  lines.push("", "## Expertise", "");
  for (const e of expertise) lines.push(`- ${e.name} — ${e.level}`);

  lines.push("", "## Projects", "");
  for (const p of projects) {
    lines.push(
      `### ${p.title}`,
      "",
      `${p.category} · ${p.period}`,
      "",
      p.text,
      "",
      `- Case study: ${urlOf(projectPath(p))}`,
      `- Tools: ${p.tools}`,
      `- Demo: ${p.demo}`,
      `- Source: ${p.github}`,
      ""
    );
  }

  lines.push("## FAQ", "");
  for (const f of faq) lines.push(`**${f.q}**`, "", f.a, "");

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}

export function seoPlugin(): Plugin {
  let outDir = "";

  const write = (relative: string, content: string) => {
    const file = resolve(outDir, relative);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, content);
  };

  return {
    name: "site-seo",
    apply: "build",
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const base = readFileSync(resolve(outDir, "index.html"), "utf8");

      for (const route of allRoutes()) {
        const file = route.path === "/" ? "index.html" : `${route.path.slice(1)}/index.html`;
        write(file, pageHtml(base, route));
      }

      write("404.html", notFoundHtml(base));
      write("sitemap.xml", sitemapXml(new Date().toISOString().slice(0, 10)));
      write("llms-full.txt", llmsFull());
    },
  };
}
