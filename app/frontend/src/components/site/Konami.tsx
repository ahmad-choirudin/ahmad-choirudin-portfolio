import { useEffect, useRef, useState } from "react";

const SEQ = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
const CHARS = "アイウエオカキクケコサシスセソ0123456789ABCDEF";

export default function Konami() {
  const [on, setOn] = useState(false);
  const [fade, setFade] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let pos = 0;
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      pos = k === SEQ[pos] ? pos + 1 : k === SEQ[0] ? 1 : 0;
      if (pos === SEQ.length) { pos = 0; setOn(true); }
    };
    const onEvt = () => setOn(true);
    addEventListener("keydown", onKey);
    addEventListener("matrix", onEvt);
    return () => { removeEventListener("keydown", onKey); removeEventListener("matrix", onEvt); };
  }, []);

  useEffect(() => {
    if (!on) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setOn(false); return; }
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    c.width = innerWidth;
    c.height = innerHeight;
    const size = 16;
    const drops = Array.from({ length: Math.ceil(c.width / size) }, () => Math.random() * -40);
    const rgb = getComputedStyle(document.documentElement).getPropertyValue("--accent-rgb").trim().replace(/\s+/g, ",");
    ctx.font = `${size}px monospace`;

    const draw = setInterval(() => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.12)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = `rgb(${rgb})`;
      drops.forEach((y, i) => {
        ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], i * size, y * size);
        drops[i] = y * size > c.height && Math.random() > 0.97 ? 0 : y + 1;
      });
    }, 50);
    const t1 = setTimeout(() => setFade(true), 7000);
    const t2 = setTimeout(() => { setOn(false); setFade(false); }, 8000);
    return () => { clearInterval(draw); clearTimeout(t1); clearTimeout(t2); };
  }, [on]);

  if (!on) return null;
  return (
    <canvas
      ref={canvas}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[9990] transition-opacity duration-1000 ${fade ? "opacity-0" : "opacity-60"}`}
    />
  );
}
