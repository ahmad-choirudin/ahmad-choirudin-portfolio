import { useEffect } from "react";

export default function CardSpotlight() {
  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      const el = (e.target as Element)?.closest<HTMLElement>("[data-tilt]");
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    addEventListener("pointermove", onMove, { passive: true });
    return () => removeEventListener("pointermove", onMove);
  }, []);
  return null;
}
