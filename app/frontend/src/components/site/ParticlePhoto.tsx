import { useEffect, useRef } from "react";

export default function ParticlePhoto({
  src, onDone, className = "",
}: { src: string; onDone: () => void; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!, ctx = cv.getContext("2d")!;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { onDone(); return; }
    const step = innerWidth < 768 ? 8 : 6; // ukuran partikel
    let raf = 0, dead = false;
    const img = new Image();
    img.src = src;

    img.onload = () => {
      if (dead) return;
      const r = cv.getBoundingClientRect();
      const w = r.width, h = r.height, dpr = Math.min(devicePixelRatio || 1, 2);
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Gambar foto ala object-cover (fokus 20% dari atas), lalu ambil warnanya
      const off = document.createElement("canvas");
      off.width = Math.ceil(w); off.height = Math.ceil(h);
      const oc = off.getContext("2d", { willReadFrequently: true })!;
      const s = Math.max(w / img.width, h / img.height);
      oc.drawImage(img, (w - img.width * s) / 2, (h - img.height * s) * 0.2, img.width * s, img.height * s);
      const px = oc.getImageData(0, 0, off.width, off.height).data;

      const P: any[] = [];
      for (let y = 0; y < h; y += step)
        for (let x = 0; x < w; x += step) {
          const i = (Math.floor(y) * off.width + Math.floor(x)) * 4;
          if (px[i + 3] < 10) continue;
          const a = Math.random() * Math.PI * 2, d = Math.max(w, h) * (0.6 + Math.random() * 0.6);
          P.push({
            hx: x, hy: y,
            x: w / 2 + Math.cos(a) * d, y: h / 2 + Math.sin(a) * d,
            vx: 0, vy: 0, delay: Math.random() * 700,
            c: `rgb(${px[i]},${px[i + 1]},${px[i + 2]})`,
          });
        }

      const t0 = performance.now();
      let doneAt = 0;
      const loop = () => {
        raf = requestAnimationFrame(loop);
        const t = performance.now() - t0;
        ctx.clearRect(0, 0, w, h);
        let moving = 0;
        for (const p of P) {
          if (t > p.delay) {
            p.vx = (p.vx + (p.hx - p.x) * 0.04) * 0.86;
            p.vy = (p.vy + (p.hy - p.y) * 0.04) * 0.86;
            p.x += p.vx; p.y += p.vy;
          }
          if (Math.abs(p.hx - p.x) + Math.abs(p.hy - p.y) > 0.5) moving++;
          ctx.fillStyle = p.c;
          ctx.fillRect(p.x, p.y, step, step);
        }
        if (!doneAt && ((t > 800 && !moving) || t > 3500)) { doneAt = t; onDone(); }
        if (doneAt && t > doneAt + 900) cancelAnimationFrame(raf); // berhenti setelah crossfade
      };
      loop();
    };
    return () => { dead = true; cancelAnimationFrame(raf); };
  }, [src]);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
