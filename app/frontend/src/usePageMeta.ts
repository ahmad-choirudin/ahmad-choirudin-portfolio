import { useEffect } from "react";
import { usePath } from "@/router";

const SITE_URL = "https://www.ahmadchoirudin.my.id";

const set = (selector: string, attr: string, value: string) =>
  document.head.querySelector(selector)?.setAttribute(attr, value);

// Mengatur judul, deskripsi, dan canonical sesuai halaman yang sedang dibuka.
export function usePageMeta(title: string, description: string) {
  const path = usePath();
  useEffect(() => {
    document.title = title;
    set('meta[name="description"]', "content", description);
    set('meta[property="og:title"]', "content", title);
    set('meta[property="og:description"]', "content", description);
    set('meta[property="og:url"]', "content", SITE_URL + path);
    set('meta[name="twitter:title"]', "content", title);
    set('meta[name="twitter:description"]', "content", description);
    set('link[rel="canonical"]', "href", SITE_URL + path);
  }, [title, description, path]);
}
