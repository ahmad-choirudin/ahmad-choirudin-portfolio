// Satu sumber data untuk SEO: dipakai oleh halaman (usePageMeta) dan oleh plugin build
// (plugins/seo.ts) yang membuat HTML statis per route, sitemap, dan llms-full.txt.
// Jangan import apa pun dari "@/..." di file ini — ia juga dibaca oleh vite.config.ts.

export const SITE_URL = "https://www.ahmadchoirudin.my.id";
export const SITE_NAME = "Ahmad Choirudin";
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export type RoutePath = "/" | "/work" | "/about" | "/credentials" | "/contact";

export type RouteMeta = {
  path: RoutePath;
  title: string;
  description: string;
  /** Nama halaman untuk breadcrumb. */
  label: string;
  priority: string;
  changefreq: "weekly" | "monthly" | "yearly";
  /** true jika komponen FAQ tampil di halaman ini (untuk JSON-LD FAQPage). */
  faq?: boolean;
};

export const routes: Record<RoutePath, RouteMeta> = {
  "/": {
    path: "/",
    title: "Ahmad Choirudin — Web3, Frontend, Community & AI",
    description:
      "Ahmad Choirudin — independent digital professional from Indonesia working across Web3, frontend, community, and AI data.",
    label: "Home",
    priority: "1.0",
    changefreq: "monthly",
  },
  "/work": {
    path: "/work",
    title: "Work — Ahmad Choirudin",
    description:
      "Selected projects by Ahmad Choirudin across Web3 research, frontend development, and digital products.",
    label: "Work",
    priority: "0.8",
    changefreq: "monthly",
  },
  "/about": {
    path: "/about",
    title: "About & Experience — Ahmad Choirudin",
    description:
      "Experience, expertise, and working process of Ahmad Choirudin across Web3, AI data, community operations, and frontend development.",
    label: "Experience",
    priority: "0.8",
    changefreq: "monthly",
  },
  "/credentials": {
    path: "/credentials",
    title: "Credentials — Ahmad Choirudin",
    description:
      "Blockchain certificates earned by Ahmad Choirudin from Avalanche Academy, Rise In, and Starknet.",
    label: "Credentials",
    priority: "0.6",
    changefreq: "yearly",
  },
  "/contact": {
    path: "/contact",
    title: "Contact — Ahmad Choirudin",
    description: "Get in touch with Ahmad Choirudin for remote work, collaborations, or questions.",
    label: "Contact",
    priority: "0.6",
    changefreq: "yearly",
    faq: true,
  },
};
