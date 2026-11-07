import { useEffect } from "react";

// Satu observer global untuk semua elemen [data-reveal] (animasi muncul saat di-scroll).
//
// Dibuat dengan MutationObserver supaya elemen yang baru muncul belakangan ikut teramati —
// penting untuk halaman yang dimuat lazy (code-splitting), konten hasil filter, dan modal.
// Observer juga memulihkan class "is-in" bila React menimpa atribut class saat re-render,
// sehingga elemen yang sudah tampil tidak menghilang lagi.
export function useReveal() {
  useEffect(() => {
    const seen = new WeakSet<Element>();
    const revealed = new WeakSet<Element>();

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-in");
          revealed.add(e.target);
          io.unobserve(e.target);
        }),
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );

    const observe = (el: HTMLElement) => {
      if (seen.has(el)) return;
      seen.add(el);
      // Jeda bertingkat: elemen bersaudara muncul berurutan (maksimal 5 langkah).
      const index = Array.from(el.parentElement?.children ?? []).indexOf(el);
      el.style.setProperty("--i", String(Math.max(0, Math.min(index, 5))));
      io.observe(el);
    };

    const scan = (root: ParentNode) => {
      if (root instanceof HTMLElement && root.matches("[data-reveal]")) observe(root);
      root.querySelectorAll<HTMLElement>("[data-reveal]").forEach(observe);
    };

    scan(document);

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "attributes") {
          const el = m.target as HTMLElement;
          if (revealed.has(el) && !el.classList.contains("is-in")) el.classList.add("is-in");
          continue;
        }
        m.addedNodes.forEach((n) => {
          if (n instanceof HTMLElement) scan(n);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });

    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, []);
}
