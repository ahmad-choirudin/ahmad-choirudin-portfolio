import { useEffect, useRef, useState } from "react";

type Props = {
  text: string;
  accent?: string;
  delay?: number;
  speed?: number;
  caret?: boolean;
  threshold?: number;
  className?: string;
};

type Progress = { source: string; count: number; caret: boolean };

const CARET_LINGER_MS = 700;
const CARET_SHADOW = "0.09em 0 0 0 rgb(var(--accent-rgb))";

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Types `text` (plus an optional `accent` tail in the accent color) one character
// at a time the first time it scrolls into view. The characters that are not typed
// yet stay in the layout as invisible text, so wrapping and height never jump.
export default function TypewriterText({
  text,
  accent = "",
  delay = 0,
  speed = 45,
  caret = true,
  threshold = 0.2,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const full = text + accent;

  const [progress, setProgress] = useState<Progress>(() => ({
    source: full,
    count: prefersReducedMotion() ? full.length : 0,
    caret: false,
  }));

  // Progress only counts while it belongs to the current text.
  const current: Progress =
    progress.source === full
      ? progress
      : { source: full, count: prefersReducedMotion() ? full.length : 0, caret: false };

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let raf = 0;
    let timer = 0;

    const run = () => {
      const start = performance.now() + delay;

      const tick = (now: number) => {
        if (now < start) {
          raf = requestAnimationFrame(tick);
          return;
        }
        const count = Math.min(full.length, Math.floor((now - start) / speed) + 1);
        setProgress((prev) =>
          prev.source === full && prev.count === count ? prev : { source: full, count, caret }
        );
        if (count < full.length) {
          raf = requestAnimationFrame(tick);
        } else {
          timer = window.setTimeout(
            () => setProgress({ source: full, count: full.length, caret: false }),
            CARET_LINGER_MS
          );
        }
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        run();
      },
      { threshold }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, [full, delay, speed, caret, threshold]);

  const settled = current.count >= full.length && !current.caret;
  const accentCount = Math.max(0, current.count - text.length);
  const caretStyle = { boxShadow: CARET_SHADOW };

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{full}</span>
      <span aria-hidden="true">
        {settled ? (
          <>
            {text}
            {accent && <span className="text-accent">{accent}</span>}
          </>
        ) : (
          <>
            <span style={current.caret && accentCount === 0 ? caretStyle : undefined}>
              {text.slice(0, current.count)}
            </span>
            <span className="invisible">{text.slice(current.count)}</span>
            {accent && (
              <span className="text-accent">
                <span style={current.caret && accentCount > 0 ? caretStyle : undefined}>
                  {accent.slice(0, accentCount)}
                </span>
                <span className="invisible">{accent.slice(accentCount)}</span>
              </span>
            )}
          </>
        )}
      </span>
    </span>
  );
}
