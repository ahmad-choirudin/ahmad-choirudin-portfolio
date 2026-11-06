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
      Monochrome theme with dark and light modes and a single accent token. Colors, type scale, and spacing are defined once as design tokens.
    </td>
    <td width="50%">
      <strong>02 / SECTIONS</strong><br />
      Hero, Selected Work, About, Experience, Expertise, Certificates, Process, FAQ, and Contact.
    </td>
  </tr>
  <tr>
    <td width="50%">
      <strong>03 / TYPOGRAPHY</strong><br />
      Space Grotesk for headings, Inter for body text, and JetBrains Mono for labels and numbering.
    </td>
    <td width="50%">
      <strong>04 / ENTRANCE ANIMATIONS</strong><br />
      Line-by-line hero headline, animated network background, and hero photo parallax.
    </td>
  </tr>
  <tr>
    <td width="50%">
      <strong>05 / INTERACTIONS</strong><br />
      Scroll progress bar, scroll-triggered reveals, animated counters, and a cursor glow on desktop.
    </td>
    <td width="50%">
      <strong>06 / ACCESSIBILITY</strong><br />
      Respects <code>prefers-reduced-motion</code>, includes a skip link, keyboard-friendly mobile menu, and an accessible certificate viewer.
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
</table>

<!--
## ◈ PREVIEW

<p align="center">
  <img src="docs/preview.jpg" alt="Portfolio preview" width="100%" />
</p>
-->

## ◈ TECH STACK

<p>
  <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite 5" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 3" />
  <img src="https://img.shields.io/badge/lucide--react-20232A?style=flat-square" alt="lucide-react" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel" />
</p>

No animation library is used. All motion is built with CSS, `IntersectionObserver`, and `requestAnimationFrame`.

## ◈ GETTING STARTED

Requires Node.js 18 or newer.

```bash
git clone https://github.com/ahmad-choirudin/portfolio-modern.git
cd portfolio-modern/app/frontend
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

To create a production build:

```bash
npm run build
npm run preview
```

To type-check without building:

```bash
npm run typecheck
```

## ◈ PROJECT STRUCTURE

```text
app/frontend/
├── public/               # Photos, project images, certificates, favicon
├── tailwind.config.ts    # Design tokens: colors, fonts, type scale
└── src/
    ├── components/site/  # Hero, SelectWork, Introduction, Timeline, Expertise,
    │                     # Certificate, Contact, plus shared Section / SectionHeading
    ├── data/             # All editable content
    ├── pages/Index.tsx   # Page layout
    └── index.css         # Color tokens, global styles, hero and reveal animations
```

## ◈ EDITING CONTENT

| What to change | File |
| --- | --- |
| Name, role, social links, nav items | `src/data/site.ts` |
| Contact email | `src/data/site.ts` → `email` |
| Contact form delivery | `.env` → `VITE_CONTACT_ENDPOINT` (see Contact form) |
| Hero photo | `src/data/site.ts` + `public/` |
| About portrait | `public/about.webp`, then run `python scripts/gen-portrait.py` |
| Projects | `src/data/projects.ts` |
| Work experience | `src/data/experience.ts` |
| Expertise | `src/data/expertise.ts` |
| Marquee tools | `src/data/tools.ts` |
| Process steps | `src/data/process.ts` |
| FAQ (also injected as JSON-LD at build) | `src/data/faq.ts` |
| Certificates | `src/data/certificate.ts` |
| Colors | `src/index.css` (`:root` tokens) |
| Fonts and type scale | `tailwind.config.ts` + font link in `index.html` |
| Animations | `src/index.css`, `src/animations.css` |

Navigation items in `site.ts` must match section ids (lowercase): `work`, `about`, `experience`, `expertise`, `credentials`, `contact`.

## ◈ CONTACT FORM

By default the form opens the visitor's email app (or WhatsApp if `site.whatsapp` is set). To deliver messages directly, create a form at [Formspree](https://formspree.io) (or any service that accepts a JSON POST) and set its URL:

```bash
cp .env.example .env
# VITE_CONTACT_ENDPOINT=https://formspree.io/f/xxxxxxxx
```

On Vercel, add the same variable under **Settings → Environment Variables** and redeploy.

## ◈ DEPLOYMENT

Deployed on Vercel. When importing the repo, set **Root Directory** to `app/frontend`. Every push to `main` redeploys automatically.

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
