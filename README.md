# ◈ Ahmad Choirudin — Portfolio

<p align="center">
  <img src="https://img.shields.io/badge/PORTFOLIO-AHMAD_CHOIRUDIN-F4F4F4?style=for-the-badge&labelColor=0A0A0A" alt="Portfolio" />
  <img src="https://img.shields.io/badge/STATUS-LIVE-F4F4F4?style=for-the-badge&labelColor=0A0A0A" alt="Live" />
  <img src="https://img.shields.io/badge/BUILT_WITH-REACT_+_TYPESCRIPT-61DAFB?style=for-the-badge&labelColor=0A0A0A" alt="React and TypeScript" />
</p>

<p align="center">
  <strong>Independent digital professional from Indonesia.</strong>
  <br />
  Working across Web3, frontend development, community operations, and AI data.
</p>

<p align="center">
  <a href="https://www.ahmadchoirudin.my.id/"><strong>↗ OPEN LIVE SITE</strong></a>
  &nbsp; · &nbsp;
  <a href="https://github.com/ahmad-choirudin"><strong>GITHUB PROFILE</strong></a>
</p>

---

## ◈ FEATURES

<table>
  <tr>
    <td width="50%">
      <strong>01 / DESIGN SYSTEM</strong><br />
      Monochrome theme with dark and light modes and a single accent token. The theme follows the visitor's system preference until they pick one with the toggle. Colors, type scale, and spacing are defined once as design tokens.
    </td>
    <td width="50%">
      <strong>02 / SECTIONS AND ROUTES</strong><br />
      Hero, Selected Work, About, Experience, Expertise, Certificates, Process, FAQ, and Contact, split across Home, Work, About, Credentials, and Contact pages. Every project also gets its own case-study page.
    </td>
  </tr>
  <tr>
    <td width="50%">
      <strong>03 / TYPOGRAPHY</strong><br />
      Space Grotesk for headings, Inter for body text, and JetBrains Mono for labels and numbering.
    </td>
    <td width="50%">
      <strong>04 / ENTRANCE ANIMATIONS</strong><br />
      Line-by-line hero headline, a hero photo that assembles from particles, an animated network background, and an interactive dot-matrix portrait.
    </td>
  </tr>
  <tr>
    <td width="50%">
      <strong>05 / INTERACTIONS</strong><br />
      Scroll progress bar, scroll-triggered reveals, animated counters, page transitions, a subtle grain texture, and a cursor glow on desktop.
    </td>
    <td width="50%">
      <strong>06 / ACCESSIBILITY</strong><br />
      Respects <code>prefers-reduced-motion</code>, includes a skip link, a keyboard-friendly mobile menu, an accessible certificate viewer, and a route announcer that tells screen readers when the page changes and moves focus to the main content.
    </td>
  </tr>
  <tr>
    <td width="50%">
      <strong>07 / RESPONSIVE</strong><br />
      Mobile-first layout with a full-screen mobile menu and a shared page container that keeps every section aligned.
    </td>
    <td width="50%">
      <strong>08 / EASY TO EDIT</strong><br />
      All content lives in simple data files, so updating text never requires touching components.
    </td>
  </tr>
  <tr>
    <td width="50%">
      <strong>09 / SEO AND SECURITY</strong><br />
      Every route is built as static HTML with title, description, canonical, Open Graph, and JSON-LD, plus <code>sitemap.xml</code>, <code>llms-full.txt</code>, and a 404 page. Security headers and a strict Content Security Policy are set in <code>vercel.json</code>.
    </td>
    <td width="50%">
      <strong>10 / QUALITY CHECKS</strong><br />
      GitHub Actions runs lint, type-check, build, and Python checks for certificate data, image sizes, and the built output.
    </td>
  </tr>
</table>

<!--
## ◈ PREVIEW

<p align="center">
  <img src="docs/preview.jpg" alt="Portfolio preview" width="100%" />
</p>
-->

## ◈ TECH STACK

<p>
  <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite 8" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 3" />
  <img src="https://img.shields.io/badge/React_Router-CA4245?style=flat-square&logo=reactrouter&logoColor=white" alt="React Router 7" />
  <img src="https://img.shields.io/badge/lucide--react-20232A?style=flat-square" alt="lucide-react" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python 3" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel" />
</p>

No animation library is used. All motion is built with CSS, `IntersectionObserver`, and `requestAnimationFrame`. Python 3 is used only for build-time helper scripts (see Helper scripts), never in the shipped site.

## ◈ GETTING STARTED

Requires Node.js 20.19 or newer.

```bash
git clone https://github.com/ahmad-choirudin/ahmad-choirudin-portfolio.git
cd ahmad-choirudin-portfolio/app/frontend
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

To create a production build:

```bash
npm run build
npm run preview
```

To lint and type-check without building:

```bash
npm run lint
npm run typecheck
```

## ◈ PROJECT STRUCTURE

```text
.github/workflows/ci.yml   # Lint, type-check, data and image checks, build, audit
app/frontend/
├── plugins/seo.ts         # Build plugin: per-route HTML, sitemap, llms-full.txt, 404
├── public/                # Photos, project images, certificates, favicon, robots.txt, llms.txt
├── scripts/               # Python helpers: portrait, certificates, images, build audit
├── tailwind.config.ts     # Design tokens: colors, fonts, type scale
├── vercel.json            # Clean URLs, redirects, security headers
└── src/
    ├── components/site/   # Hero, SelectWork, Introduction, Timeline, Expertise,
    │                      # Certificate, Contact, plus shared Section / SectionHeading
    ├── config/seo.ts      # Title, description, and structured data per route
    ├── data/              # All editable content
    ├── hooks/             # useReveal, useTilt
    ├── pages/             # Home, Work, ProjectDetail, About, Credentials, Contact, NotFound
    ├── router.tsx         # Thin layer over react-router-dom
    ├── index.css          # Color tokens, global styles, hero and reveal animations
    └── animations.css     # Background glow and motion tokens
```

## ◈ EDITING CONTENT

| What to change | File |
| --- | --- |
| Name, role, social links, nav items | `src/data/site.ts` |
| Contact email | `src/data/site.ts` → `email` |
| Contact form delivery | `.env` → `VITE_CONTACT_ENDPOINT` (see Contact form) |
| Hero headline and buttons | `src/components/site/Hero.tsx` |
| Hero photo | `src/data/site.ts` + `public/` |
| About text | `src/components/site/Introduction.tsx` |
| About portrait | `public/about.webp`, then run `python3 scripts/gen-portrait.py` |
| Projects (each gets a page at `/work/<slug>`) | `src/data/projects.ts` + `public/projects/` |
| Work experience | `src/data/experience.ts` |
| Expertise | `src/data/expertise.ts` |
| Marquee tools | `src/data/tools.ts` |
| Process steps | `src/data/process.ts` |
| FAQ (also injected as JSON-LD at build) | `src/data/faq.ts` |
| Certificates | `src/data/certificates.json`, then run `npm run certs` |
| Page titles, descriptions, and social previews | `src/config/seo.ts` + `public/og-image.jpg` |
| Logo and favicon | `public/logo.png`, `public/favicon.png` |
| Colors | `src/index.css` (`:root` tokens, including `--danger-rgb` for form errors and `--accent-hi-rgb` for the headline shimmer) |
| Theme default | `public/theme-init.js` (stored choice, then system preference, then dark) |
| Background glow | `src/animations.css` (`--glow-alpha`, `0` turns it off) |
| Grain texture | `src/index.css` (`html::after`, adjust `opacity`) |
| Fonts and type scale | `tailwind.config.ts` + font link in `index.html` |
| Animations | `src/index.css`, `src/animations.css` |

Navigation items in `site.ts` point to routes (`/`, `/work`, `/about`, `/credentials`, `/contact`). If you add a page, also add its `<Route>` in `src/App.tsx` and an entry in `src/config/seo.ts` so it gets its own title, sitemap entry, and static HTML.

Section numbers (`01`, `02`, ...) are generated per page with a CSS counter, so reordering or adding sections never leaves gaps. Pass `numbered={false}` to `SectionHeading` to hide a number.

### Adding a project

1. Put a 16:9 screenshot in `public/projects/<slug>.webp`.
2. Add an entry to `src/data/projects.ts`:

```ts
{
  image: "/projects/my-project.webp",
  slug: "my-project",            // unique, lowercase, becomes /work/my-project
  title: "My Project",
  category: "Dashboard",         // used by the Work page filter
  period: "Web3 Tracker · Frontend",
  text: "One to three sentences about the project.",
  tools: "React, Vite, Tailwind CSS",   // comma-separated, each becomes a chip
  demo: "https://example.com/",
  github: "https://github.com/ahmad-choirudin/my-project",
  // optional: role, highlights: ["..."], gallery: [{ src, alt }]
},
```

The project card, case-study page, sitemap entry, and `llms-full.txt` are generated from this entry.

### Adding a certificate

1. Put the image in `public/certificates/<issuer>-<number>.webp`, using the next number for that issuer (for example `starknet-04.webp`).
2. Add one entry to `src/data/certificates.json`:

```json
{ "issuer": "starknet", "title": "Course title", "learned": "What was learned.", "href": "https://..." }
```

3. Run `npm run certs`. This regenerates `src/data/certificate.ts` and rejects bad data (empty fields, non-https links, duplicate titles, missing image files). New issuers must be added to `"issuers"` first. Commit the regenerated file.

`certificate.ts` is generated. Do not edit it by hand.

## ◈ HELPER SCRIPTS

Small Python 3 scripts in `app/frontend/scripts/`. They use only the standard library, except where noted.

| Command | What it does |
| --- | --- |
| `npm run certs` | Regenerate `src/data/certificate.ts` from `certificates.json` (also accepts a CSV file) |
| `npm run images` | Convert PNG/JPG in `public/` to WebP (needs `pip install pillow`) |
| `npm run images:check` | Fail if any image in `public/` exceeds 300 KB |
| `npm run audit` | Check the built `dist/`: sitemap, titles, descriptions, canonical and Open Graph tags, JSON-LD, broken internal links, and `robots.txt`. Run `npm run build` first |
| `python3 scripts/gen-portrait.py` | Generate the dot-matrix portrait data from `public/about.webp` |

Add `--strict` to `npm run audit` to treat warnings as failures.

## ◈ CONTINUOUS INTEGRATION

`.github/workflows/ci.yml` runs on every push and pull request to `main`:

1. `npm run lint`
2. `npm run typecheck`
3. `python3 scripts/sync_certificates.py --check` (fails if `certificate.ts` is out of date)
4. `python3 scripts/optimize_images.py --check`
5. `npm run build`
6. `python3 scripts/audit_build.py`

## ◈ CONTACT FORM

By default the form opens the visitor's email app (or WhatsApp if `site.whatsapp` is set). To deliver messages directly, create a form at [Formspree](https://formspree.io) (or any service that accepts a JSON POST) and set its URL:

```bash
cp .env.example .env
# VITE_CONTACT_ENDPOINT=https://formspree.io/f/xxxxxxxx
```

On Vercel, add the same variable under **Settings → Environment Variables** and redeploy.

The Content Security Policy in `vercel.json` only allows requests to `formspree.io`. If you use another service, add its domain to `connect-src` and `form-action`.

## ◈ TROUBLESHOOTING

- **Build fails with a JSX or `TypewriterText` error in `SelectWork.tsx`:** make sure the project title is rendered once, inside a single `<h3>`.
- **`npm run certs --check` fails in CI:** you edited `certificates.json` without running `npm run certs`. Run it and commit `certificate.ts`.
- **Contact form is blocked in the browser console:** the endpoint domain is missing from `connect-src` in `vercel.json`.
- **Theme looks wrong on first visit:** clear `localStorage.theme`; a stored choice always wins over the system preference.

## ◈ DEPLOYMENT

Deployed on Vercel. When importing the repo, set **Root Directory** to `app/frontend`. Every push to `main` redeploys automatically. Clean URLs, the `/home` redirect, and security headers are configured in `vercel.json`.

## ◈ CONTACT

<p align="center">
  <a href="https://www.ahmadchoirudin.my.id/">Portfolio</a>
  &nbsp; · &nbsp;
  <a href="https://github.com/ahmad-choirudin">GitHub</a>
  &nbsp; · &nbsp;
  <a href="https://www.linkedin.com/in/ahmadchoirudin">LinkedIn</a>
  &nbsp; · &nbsp;
  <a href="https://x.com/CubbieOG">X / @CubbieOG</a>
  &nbsp; · &nbsp;
  <a href="https://t.me/CubbieOG">Telegram</a>
</p>
