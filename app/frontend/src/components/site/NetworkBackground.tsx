import { useEffect, useRef } from "react";

type Node = { x: number; y: number; vx: number; vy: number };

export default function NetworkBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const readColor = () => getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#f4f4f4";
    let color = readColor();
    const onTheme = () => { color = readColor(); draw(); };
    window.addEventListener("themechange", onTheme);
    const LINK = 130;
    let w = 0, h = 0, nodes: Node[] = [], raf = 0, visible = true;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            ctx.globalAlpha = (1 - d / LINK) * 0.25;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        ctx.globalAlpha = 0.5;
        ctx.beginPath(); ctx.arc(a.x, a.y, 1.6, 0, Math.PI * 2); ctx.fill();
      }
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(60, Math.round(w / 22));
      nodes = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      }));
      draw();
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      for (const p of nodes) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      draw();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(canvas);
    resize();
    if (!reduce) raf = requestAnimationFrame(loop);

    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); window.removeEventListener("themechange", onTheme); };
  }, []);

  return <canvas ref={ref} className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-60" aria-hidden="true" />;
  }
