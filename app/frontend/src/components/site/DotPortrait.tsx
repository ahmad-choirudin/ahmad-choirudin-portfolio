import { useEffect, useRef } from "react";
import { PORTRAIT } from "@/data/portrait";

/**
 * Potret dot-matrix interaktif (canvas 2D).
 * Titik berkumpul dari acak, menjauh dari kursor/jari, kembali ke posisi
 * semula seperti pegas, "bernapas" pelan, dan menyebar saat diklik.
 */

const ROW = 0.866;
const LEVELS = 9;
const N = PORTRAIT.d.length;

const CFG = {
  hoverRadius: 0.13, // relatif terhadap lebar potret
  push: 2.2,
  spring: 0.05,
  damping: 0.84,
  burst: 14,
};

export default function DotPortrait({ className = "", focusY = 0.2, label = "Interactive dot-matrix portrait" }: { className?: string; focusY?: number; label?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = wrap.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!host || !canvas || !ctx) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hx = new Float32Array(N), hy = new Float32Array(N);
    const px = new Float32Array(N), py = new Float32Array(N);
    const vx = new Float32Array(N), vy = new Float32Array(N);
    const sz = new Uint8Array(N);

    let w = 0, h = 0, cell = 1, dpr = 1, ox = 0, oy = 0;
    let rgb = "244,244,244";
    let pointer: { x: number; y: number } | null = null;
    let raf = 0, visible = true, t0 = performance.now(), first = true;

    const readColor = () => {
      const v = getComputedStyle(document.documentElement).getPropertyValue("--fg-rgb").trim();
      rgb = v ? v.split(/\s+/).join(",") : "244,244,244";
    };

    const layout = () => {
      const r = host.getBoundingClientRect();
      w = r.width; h = r.height;
      dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Seperti object-cover, rata tengah horizontal, fokus ke wajah secara vertikal.
      const pw = PORTRAIT.w, ph = PORTRAIT.h * ROW;
      cell = Math.max(w / pw, h / ph);
      ox = (w - pw * cell) / 2;
      oy = (h - ph * cell) * focusY;

      for (let i = 0; i < N; i++) {
        const [gx, gy, s] = PORTRAIT.d[i];
        hx[i] = ox + (gx + 0.5) * cell;
        hy[i] = oy + (gy * ROW + 0.5) * cell;
        sz[i] = s;
        if (reduce || !first) { px[i] = hx[i]; py[i] = hy[i]; }
        else {
          px[i] = Math.random() * w;
          py[i] = Math.random() * h;
        }
        vx[i] = vy[i] = 0;
      }
      first = false;
      t0 = performance.now();
      draw(0);
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);
      const breathe = reduce ? 0 : Math.sin(time / 1400) * 0.04;
      const base = cell * 0.5;
      for (let s = 1; s <= LEVELS; s++) {
        ctx.fillStyle = `rgba(${rgb},${(0.28 + 0.72 * (s / LEVELS)).toFixed(3)})`;
        ctx.beginPath();
        const rad = Math.max(0.35, base * (0.3 + 0.78 * (s / LEVELS)) * (1 + breathe));
        for (let i = 0; i < N; i++) {
          if (sz[i] !== s) continue;
          ctx.moveTo(px[i] + rad, py[i]);
          ctx.arc(px[i], py[i], rad, 0, Math.PI * 2);
        }
        ctx.fill();
      }
    };

    const step = () => {
      raf = requestAnimationFrame(step);
      if (!visible || document.hidden) return;
      const radius = CFG.hoverRadius * PORTRAIT.w * cell;
      const r2 = radius * radius;
      for (let i = 0; i < N; i++) {
        let ax = (hx[i] - px[i]) * CFG.spring;
        let ay = (hy[i] - py[i]) * CFG.spring;
        if (pointer) {
          const dx = px[i] - pointer.x, dy = py[i] - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < r2 && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const f = (1 - d / radius) * CFG.push;
            ax += (dx / d) * f; ay += (dy / d) * f;
          }
        }
        vx[i] = (vx[i] + ax) * CFG.damping;
        vy[i] = (vy[i] + ay) * CFG.damping;
        px[i] += vx[i]; py[i] += vy[i];
      }
      draw(performance.now() - t0);
    };

    const toLocal = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      return x >= 0 && y >= 0 && x <= r.width && y <= r.height ? { x, y } : null;
    };
    const onMove = (e: PointerEvent) => { pointer = toLocal(e); };
    const onLeave = () => { pointer = null; };
    const onUp = (e: PointerEvent) => { if (e.pointerType !== "mouse") pointer = null; };
    const onDown = (e: PointerEvent) => {
      const p = toLocal(e);
      if (!p || (e.target as Element).closest("a,button,input,textarea,summary,select")) return;
      const radius = CFG.hoverRadius * PORTRAIT.w * cell * 1.8;
      for (let i = 0; i < N; i++) {
        const dx = px[i] - p.x, dy = py[i] - p.y, d = Math.hypot(dx, dy);
        if (d < radius && d > 0.01) {
          const f = (1 - d / radius) * CFG.burst;
          vx[i] += (dx / d) * f; vy[i] += (dy / d) * f;
        }
      }
    };

    readColor();
    const ro = new ResizeObserver(layout);
    ro.observe(host);
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; });
    io.observe(host);
    const onTheme = () => { readColor(); draw(performance.now() - t0); };
    window.addEventListener("themechange", onTheme);
    layout();

    if (!reduce) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      window.addEventListener("pointerup", onUp, { passive: true });
      window.addEventListener("pointercancel", onLeave, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      raf = requestAnimationFrame(step);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect();
      window.removeEventListener("themechange", onTheme);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onLeave);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [focusY]);

  return (
    <div ref={wrap} className={className}>
      <canvas ref={canvasRef} role="img" aria-label={label} className="block h-full w-full" />
    </div>
  );
}
