import { useEffect, useRef } from "react";

export default function FuturisticCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let x = 0, y = 0, rx = 0, ry = 0, raf = 0, seen = false;

    const onMove = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      if (!seen) {
        seen = true; rx = x; ry = y;
        dot.current?.classList.add("on");
        ring.current?.classList.add("on");
      }
      const hover = !!(e.target as Element).closest?.("a,button,input,textarea,[role=button],[data-tilt]");
      if (ring.current) ring.current.dataset.hover = hover ? "1" : "0";
    };
    const tick = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (dot.current) dot.current.style.translate = `${x}px ${y}px`;
      if (ring.current) ring.current.style.translate = `${rx}px ${ry}px`;
      raf = requestAnimationFrame(tick);
    };
    addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(tick);
    return () => { removeEventListener("pointermove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div ref={ring} className="fx-ring" aria-hidden="true" />
      <div ref={dot} className="fx-dot" aria-hidden="true" />
    </>
  );
}
