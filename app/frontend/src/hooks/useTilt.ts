import { useEffect } from "react";

const MAX_DEG = 5;

// Efek miring (tilt) + cahaya mengikuti kursor untuk elemen [data-tilt].
// Hanya aktif di perangkat dengan pointer presisi (mouse/trackpad) dan tanpa reduced-motion.
// Satu listener global (event delegation), jadi tidak ada biaya per kartu.
export function useTilt() {
  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let active: HTMLElement | null = null;
    let raf = 0;

    const reset = (el: HTMLElement) => {
      el.style.removeProperty("--rx");
      el.style.removeProperty("--ry");
    };

    const onMove = (e: PointerEvent) => {
      const el = e.target instanceof Element ? e.target.closest<HTMLElement>("[data-tilt]") : null;
      if (el !== active) {
        if (active) reset(active);
        active = el;
      }
      if (!el) return;

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
        el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
        el.style.setProperty("--ry", `${((x - 0.5) * MAX_DEG * 2).toFixed(2)}deg`);
        el.style.setProperty("--rx", `${((0.5 - y) * MAX_DEG * 2).toFixed(2)}deg`);
      });
    };

    const onLeave = () => {
      if (active) reset(active);
      active = null;
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      if (active) reset(active);
    };
  }, []);
}
