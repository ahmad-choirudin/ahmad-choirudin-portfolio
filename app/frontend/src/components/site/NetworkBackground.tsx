import { useEffect, useRef } from "react";

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

export default function NetworkBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const LINK_DISTANCE = 130;

    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let raf = 0;
    let visible = false;
    let destroyed = false;

    const readColor = () => {
      return (
        getComputedStyle(document.documentElement)
          .getPropertyValue("--accent")
          .trim() || "#f4f4f4"
      );
    };

    let color = readColor();

    const draw = () => {
      if (destroyed) return;

      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 1;

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];

        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];

          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < LINK_DISTANCE) {
            ctx.globalAlpha =
              (1 - distance / LINK_DISTANCE) * 0.25;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        ctx.globalAlpha = 0.5;

        ctx.beginPath();
        ctx.arc(a.x, a.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    };

    const stop = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const animate = () => {
      if (destroyed || reduceMotion || !visible || document.hidden) {
        stop();
        return;
      }

      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) {
          node.vx *= -1;
          node.x = Math.max(0, Math.min(width, node.x));
        }

        if (node.y < 0 || node.y > height) {
          node.vy *= -1;
          node.y = Math.max(0, Math.min(height, node.y));
        }
      }

      draw();
      raf = requestAnimationFrame(animate);
    };

    const start = () => {
      if (destroyed || reduceMotion || !visible || document.hidden || raf) {
        return;
      }

      raf = requestAnimationFrame(animate);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = rect.width;
      height = rect.height;

      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(
        60,
        Math.max(12, Math.round(width / 22))
      );

      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }));

      draw();
      stop();
      start();
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    };

    const onThemeChange = () => {
      color = readColor();
      draw();
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;

      if (visible) {
        start();
      } else {
        stop();
      }
    });

    const resizeObserver = new ResizeObserver(resize);

    resizeObserver.observe(canvas);
    observer.observe(canvas);

    document.addEventListener(
      "visibilitychange",
      onVisibilityChange
    );

    window.addEventListener("themechange", onThemeChange);

    resize();

    return () => {
      destroyed = true;

      stop();

      observer.disconnect();
      resizeObserver.disconnect();

      document.removeEventListener(
        "visibilitychange",
        onVisibilityChange
      );

      window.removeEventListener("themechange", onThemeChange);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-60"
    />
  );
 }
