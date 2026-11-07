
import { useEffect, useRef } from "react";
import { PORTRAIT } from "@/data/portrait";

const ROW = 0.866;
const LEVELS = 9;
const N = PORTRAIT.d.length;

const CFG = {
  hoverRadius: 0.13,
  push: 2.2,
  spring: 0.05,
  damping: 0.84,
  burst: 14,
};

type PointerPosition = {
  x: number;
  y: number;
};

export default function DotPortrait({
  className = "",
  focusY = 0.2,
  label = "Interactive dot-matrix portrait",
}: {
  className?: string;
  focusY?: number;
  label?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = wrap.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!host || !canvas || !ctx) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const hx = new Float32Array(N);
    const hy = new Float32Array(N);
    const px = new Float32Array(N);
    const py = new Float32Array(N);
    const vx = new Float32Array(N);
    const vy = new Float32Array(N);
    const sz = new Uint8Array(N);

    let w = 0;
    let h = 0;
    let cell = 1;
    let dpr = 1;
    let ox = 0;
    let oy = 0;

    let rgb = "244,244,244";
    let pointer: PointerPosition | null = null;

    let raf = 0;
    let visible = false;
    let destroyed = false;

    let t0 = performance.now();
    let first = true;

    const readColor = () => {
      const value = getComputedStyle(
        document.documentElement
      )
        .getPropertyValue("--fg-rgb")
        .trim();

      rgb = value
        ? value.split(/\s+/).join(",")
        : "244,244,244";
    };

    const draw = (time: number) => {
      if (destroyed || !w || !h) return;

      ctx.clearRect(0, 0, w, h);

      const breathe = reduce
        ? 0
        : Math.sin(time / 1400) * 0.04;

      const base = cell * 0.5;

      for (let s = 1; s <= LEVELS; s++) {
        ctx.fillStyle = `rgba(${rgb},${(
          0.28 +
          0.72 * (s / LEVELS)
        ).toFixed(3)})`;

        ctx.beginPath();

        const rad = Math.max(
          0.35,
          base * (0.3 + 0.78 * (s / LEVELS)) *
            (1 + breathe)
        );

        for (let i = 0; i < N; i++) {
          if (sz[i] !== s) continue;

          ctx.moveTo(px[i] + rad, py[i]);
          ctx.arc(px[i], py[i], rad, 0, Math.PI * 2);
        }

        ctx.fill();
      }
    };

    const stop = () => {
      if (!raf) return;

      cancelAnimationFrame(raf);
      raf = 0;
    };

    const step = () => {
      raf = 0;

      if (
        destroyed ||
        reduce ||
        !visible ||
        document.hidden
      ) {
        return;
      }

      const radius =
        CFG.hoverRadius * PORTRAIT.w * cell;

      const r2 = radius * radius;

      for (let i = 0; i < N; i++) {
        let ax =
          (hx[i] - px[i]) * CFG.spring;

        let ay =
          (hy[i] - py[i]) * CFG.spring;

        if (pointer) {
          const dx = px[i] - pointer.x;
          const dy = py[i] - pointer.y;

          const d2 = dx * dx + dy * dy;

          if (d2 < r2 && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const f = (1 - d / radius) * CFG.push;

            ax += (dx / d) * f;
            ay += (dy / d) * f;
          }
        }

        vx[i] = (vx[i] + ax) * CFG.damping;
        vy[i] = (vy[i] + ay) * CFG.damping;

        px[i] += vx[i];
        py[i] += vy[i];
      }

      draw(performance.now() - t0);

      raf = requestAnimationFrame(step);
    };

    const start = () => {
      if (
        destroyed ||
        reduce ||
        !visible ||
        document.hidden ||
        raf
      ) {
        return;
      }

      raf = requestAnimationFrame(step);
    };

    const layout = () => {
      if (destroyed) return;

      const rect = host.getBoundingClientRect();

      w = rect.width;
      h = rect.height;

      if (!w || !h) {
        stop();
        return;
      }

      dpr = Math.min(
        window.devicePixelRatio || 1,
        2
      );

      canvas.width = Math.max(
        1,
        Math.round(w * dpr)
      );

      canvas.height = Math.max(
        1,
        Math.round(h * dpr)
      );

      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );

      // Match object-cover behavior.
      const pw = PORTRAIT.w;
      const ph = PORTRAIT.h * ROW;

      cell = Math.max(
        w / pw,
        h / ph
      );

      ox = (w - pw * cell) / 2;
      oy = (h - ph * cell) * focusY;

      for (let i = 0; i < N; i++) {
        const [gx, gy, size] = PORTRAIT.d[i];

        hx[i] = ox + (gx + 0.5) * cell;
        hy[i] = oy + (gy * ROW + 0.5) * cell;

        sz[i] = size;

        if (reduce || !first) {
          px[i] = hx[i];
          py[i] = hy[i];
        } else {
          px[i] = Math.random() * w;
          py[i] = Math.random() * h;
        }

        vx[i] = 0;
        vy[i] = 0;
      }

      first = false;
      t0 = performance.now();

      draw(0);
      start();
    };

    const toLocal = (
      event: PointerEvent
    ): PointerPosition | null => {
      const rect = host.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if (
        x < 0 ||
        y < 0 ||
        x > rect.width ||
        y > rect.height
      ) {
        return null;
      }

      return { x, y };
    };

    const onMove = (event: PointerEvent) => {
      pointer = toLocal(event);
    };

    const onLeave = () => {
      pointer = null;
    };

    const onUp = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        pointer = null;
      }
    };

    const onDown = (event: PointerEvent) => {
      const target = event.target;

      if (
        target instanceof Element &&
        target.closest(
          "a,button,input,textarea,summary,select"
        )
      ) {
        return;
      }

      const position = toLocal(event);

      if (!position) return;

      const radius =
        CFG.hoverRadius *
        PORTRAIT.w *
        cell *
        1.8;

      for (let i = 0; i < N; i++) {
        const dx = px[i] - position.x;
        const dy = py[i] - position.y;

        const distance = Math.hypot(dx, dy);

        if (
          distance < radius &&
          distance > 0.01
        ) {
          const force =
            (1 - distance / radius) * CFG.burst;

          vx[i] += (dx / distance) * force;
          vy[i] += (dy / distance) * force;
        }
      }

      start();
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    };

    const onTheme = () => {
      readColor();
      draw(performance.now() - t0);
    };

    readColor();

    const resizeObserver = new ResizeObserver(layout);

    resizeObserver.observe(host);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;

        if (visible) {
          start();
        } else {
          stop();
        }
      },
      { threshold: 0 }
    );

    intersectionObserver.observe(host);

    document.addEventListener(
      "visibilitychange",
      onVisibilityChange
    );

    window.addEventListener(
      "themechange",
      onTheme
    );

    if (!reduce) {
      host.addEventListener(
        "pointermove",
        onMove,
        { passive: true }
      );

      host.addEventListener(
        "pointerdown",
        onDown,
        { passive: true }
      );

      host.addEventListener(
        "pointerup",
        onUp,
        { passive: true }
      );

      host.addEventListener(
        "pointerleave",
        onLeave
      );

      host.addEventListener(
        "pointercancel",
        onLeave
      );
    }

    layout();

    return () => {
      destroyed = true;

      stop();

      resizeObserver.disconnect();
      intersectionObserver.disconnect();

      document.removeEventListener(
        "visibilitychange",
        onVisibilityChange
      );

      window.removeEventListener(
        "themechange",
        onTheme
      );

      host.removeEventListener(
        "pointermove",
        onMove
      );

      host.removeEventListener(
        "pointerdown",
        onDown
      );

      host.removeEventListener(
        "pointerup",
        onUp
      );

      host.removeEventListener(
        "pointerleave",
        onLeave
      );

      host.removeEventListener(
        "pointercancel",
        onLeave
      );
    };
  }, [focusY]);

  return (
    <div
      ref={wrap}
      className={className}
    >
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={label}
        className="block h-full w-full"
      />
    </div>
  );
}
