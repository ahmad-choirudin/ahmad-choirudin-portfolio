import { Fragment, useEffect, useRef, useState } from "react";

type Props = {
  text: string;
  accent?: string;
  delay?: number;
  stagger?: number;
  threshold?: number;
  className?: string;
};

const DURATION_MS = 650;
const EASING = "cubic-bezier(.2, .8, .2, 1)";

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Each letter sits in a clipping mask. The small paddings (cancelled by negative
// margins) keep ascenders, descenders, and side bearings from being cut off.
const MASK_STYLE = {
  display: "inline-block",
  overflow: "hidden",
  verticalAlign: "top",
  paddingBlock: ".12em .15em",
  marginBlock: "-.12em -.15em",
  paddingInline: ".03em",
  marginInline: "-.03em",
} as const;

// Letters rise into place one after another from behind their mask the first time
// the text scrolls into view. An optional `accent` tail is shown in the accent color.
// Once the animation is over the text is swapped for plain text, which restores the
// font's kerning between letters.
export default function LetterRise({
  text,
  accent = "",
  delay = 0,
  stagger = 35,
  threshold = 0.2,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(prefersReducedMotion);
  const [settled, setSettled] = useState(prefersReducedMotion);
  const letterCount = Array.from(text + accent).length;

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let timer = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setShown(true);
        timer = window.setTimeout(() => setSettled(true), delay + letterCount * stagger + DURATION_MS + 50);
      },
      { threshold }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [delay, stagger, threshold, letterCount]);

  let index = 0;
  const renderSegment = (segment: string) =>
    segment.split(" ").map((word, w) => (
      <Fragment key={w}>
        {w > 0 && " "}
        {word && (
          <span className="inline-block whitespace-nowrap">
            {Array.from(word).map((char) => {
              const i = index++;
              return (
                <span key={i} style={MASK_STYLE}>
                  <span
                    style={{
                      display: "inline-block",
                      transform: shown ? "none" : "translateY(110%)",
                      transition: `transform ${DURATION_MS}ms ${EASING} ${delay + i * stagger}ms`,
                    }}
                  >
                    {char}
                  </span>
                </span>
              );
            })}
          </span>
        )}
      </Fragment>
    ));

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text + accent}</span>
      <span aria-hidden="true">
        {settled ? (
          <>
            {text}
            {accent && <span className="text-accent">{accent}</span>}
          </>
        ) : (
          <>
            {renderSegment(text)}
            {accent && <span className="text-accent">{renderSegment(accent)}</span>}
          </>
        )}
      </span>
    </span>
  );
}
