import { useEffect } from "react";
import { usePath } from "@/router";

export default function HeroParallax() {
  const path = usePath();
  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = document.querySelector<HTMLElement>(".hero-photo");
    if (!el) return;
    el.classList.add("hero-parallax");
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / innerWidth - 0.5;
      const ny = e.clientY / innerHeight - 0.5;
      el.style.translate = `${-nx * 18}px ${-ny * 12}px`;
    };
    addEventListener("pointermove", onMove, { passive: true });
    return () => {
      removeEventListener("pointermove", onMove);
      el.style.translate = "";
      el.classList.remove("hero-parallax");
    };
  }, [path]);
  return null;
}
