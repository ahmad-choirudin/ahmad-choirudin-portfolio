import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/_-+*#";
const FRAME_MS = 45;
const BASE_MS = 450;
const STAGGER_MS = 50;
const JITTER_MS = 120;

type Props = {
  text: string;
  delay?: number;
  className?: string;
};

type Frame = { source: string; value: string };

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
const isScramblable = (char: string) => /[A-Za-z0-9]/.test(char);

// Decodes `text` from random glyphs into the real characters, left to right,
// the first time it scrolls into view. Spaces and punctuation never change, so
// in a monospace font the layout does not shift while it runs.
export default function ScrambleText({ text, delay = 0, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [frame, setFrame] = useState<Frame | null>(null);

  // A frame only counts while it belongs to the current text, so a stale frame
  // can never show after `text` changes. Without a frame, the real text is shown.
  const display = frame && frame.source === text ? frame.value : text;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let lastFrame = 0;

    const run = () => {
      const chars = Array.from(text);
      const settleAt = chars.map((_, i) => delay + BASE_MS + i * STAGGER_MS + Math.random() * JITTER_MS);
      const end = Math.max(...settleAt);
      const start = performance.now();

      const tick = (now: number) => {
        const elapsed = now - start;
        if (elapsed >= end) {
          setFrame(null);
          return;
        }
        if (now - lastFrame >= FRAME_MS) {
          lastFrame = now;
          const value = chars.map((c, i) => (isScramblable(c) && elapsed < settleAt[i] ? randomGlyph() : c)).join("");
          setFrame({ source: text, value });
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        run();
      },
      { threshold: 0.6 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [text, delay]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}
