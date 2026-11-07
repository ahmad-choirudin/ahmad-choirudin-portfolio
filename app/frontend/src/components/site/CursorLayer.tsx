import { useEffect, useRef } from "react";
import { usePath } from "@/router";

export default function CursorLayer() {
  const path = usePath();
  const bar = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const hero = document.querySelector<HTMLElement>(".hero-photo");
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = scrollY;
        const h = document.documentElement.scrollHeight - innerHeight;
        if (bar.current) bar.current.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
        if (hero && y < 900) hero.style.setProperty("--py", `${y * 0.12}px`);
        ticking = false;
      });
    };
    addEventListener("scroll", onScroll, { passive: true });

    const fine = matchMedia("(pointer: fine)").matches;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!glow.current) return;
        glow.current.style.transform = `translate(${e.clientX - 200}px, ${e.clientY - 200}px)`;
        glow.current.style.opacity = "1";
      });
    };
    const hideGlow = () => {
      if (glow.current) glow.current.style.opacity = "0";
    };
    if (fine) {
      addEventListener("pointermove", onMove);
      document.documentElement.addEventListener("pointerleave", hideGlow);
    }

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
      removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", hideGlow);
    };
  }, [path]);

  return (
    <>
      <div ref={bar} className="cursor-bar" />
      <div ref={glow} className="cursor-glow" />
    </>
  );
}
