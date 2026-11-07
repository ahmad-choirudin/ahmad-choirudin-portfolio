import { useEffect, useRef } from "react";

interface Particle {
  hx: number;
  hy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  delay: number;
  c: string;
}

interface ParticlePhotoProps {
  src: string;
  onDone: () => void;
  className?: string;
}

export default function ParticlePhoto({
  src,
  onDone,
  className = "",
}: ParticlePhotoProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let dead = false;
    let completed = false;

    const finish = () => {
      if (dead || completed) return;

      completed = true;
      onDoneRef.current();
    };

    // Respect reduced motion preferences.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }

    const isMobile = window.innerWidth < 768;

    // Larger spacing means fewer particles.
    const step = isMobile ? 9 : 7;

    const img = new Image();
    img.decoding = "async";

    img.onerror = () => {
      finish();
    };

    img.onload = () => {
      if (dead) return;

      const rect = canvas.getBoundingClientRect();
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height);

      // Avoid invalid canvas dimensions.
      if (!w || !h || !img.width || !img.height) {
        finish();
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Create an offscreen canvas for pixel sampling.
      const offscreen = document.createElement("canvas");

      offscreen.width = w;
      offscreen.height = h;

      const offCtx = offscreen.getContext("2d", {
        willReadFrequently: true,
      });

      if (!offCtx) {
        finish();
        return;
      }

      // Match object-cover behavior.
      const scale = Math.max(
        w / img.width,
        h / img.height
      );

      const drawWidth = img.width * scale;
      const drawHeight = img.height * scale;

      offCtx.drawImage(
        img,
        (w - drawWidth) / 2,
        (h - drawHeight) * 0.2,
        drawWidth,
        drawHeight
      );

      let pixels: Uint8ClampedArray;

      try {
        pixels = offCtx.getImageData(
          0,
          0,
          w,
          h
        ).data;
      } catch {
        finish();
        return;
      }

      const particles: Particle[] = [];

      // Limit particle count to protect lower-end devices.
      const maxParticles = isMobile ? 1800 : 3200;

      const estimatedCount =
        Math.ceil(w / step) * Math.ceil(h / step);

      const samplingStep =
        estimatedCount > maxParticles
          ? step * Math.sqrt(estimatedCount / maxParticles)
          : step;

      const stride = Math.max(step, Math.floor(samplingStep));

      for (let y = 0; y < h; y += stride) {
        for (let x = 0; x < w; x += stride) {
          const i = (y * w + x) * 4;

          if (pixels[i + 3] < 10) continue;

          const angle = Math.random() * Math.PI * 2;

          const distance =
            Math.max(w, h) * (0.6 + Math.random() * 0.6);

          particles.push({
            hx: x,
            hy: y,

            x: w / 2 + Math.cos(angle) * distance,
            y: h / 2 + Math.sin(angle) * distance,

            vx: 0,
            vy: 0,

            delay: Math.random() * 700,

            c: `rgb(${pixels[i]},${pixels[i + 1]},${pixels[i + 2]})`,
          });
        }
      }

      if (!particles.length) {
        finish();
        return;
      }

      const startTime = performance.now();

      let doneAt = 0;

      const loop = () => {
        if (dead) return;

        const elapsed = performance.now() - startTime;

        ctx.clearRect(0, 0, w, h);

        let moving = 0;

        for (const particle of particles) {
          if (elapsed > particle.delay) {
            particle.vx =
              (particle.vx +
                (particle.hx - particle.x) * 0.04) *
              0.86;

            particle.vy =
              (particle.vy +
                (particle.hy - particle.y) * 0.04) *
              0.86;

            particle.x += particle.vx;
            particle.y += particle.vy;
          }

          const distance =
            Math.abs(particle.hx - particle.x) +
            Math.abs(particle.hy - particle.y);

          if (distance > 0.5) {
            moving++;
          }

          ctx.fillStyle = particle.c;

          ctx.fillRect(
            particle.x,
            particle.y,
            stride,
            stride
          );
        }

        // Finish once particles settle or the maximum duration is reached.
        if (!doneAt && ((elapsed > 800 && moving === 0) || elapsed > 3500)) {
          doneAt = elapsed;
          finish();
        }

        // Allow a short visual hold before stopping.
        if (doneAt && elapsed > doneAt + 900) {
          cancelAnimationFrame(raf);
          raf = 0;
          return;
        }

        raf = requestAnimationFrame(loop);
      };

      raf = requestAnimationFrame(loop);
    };

    img.src = src;

    return () => {
      dead = true;

      if (raf) {
        cancelAnimationFrame(raf);
      }

      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={className}
    />
  );
}
