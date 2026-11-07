import { useEffect, useRef, useState, type CSSProperties } from "react";
import { site } from "@/data/site";
import { useSetGate } from "@/router";

const COLUMNS = 7;
const COVER_MS = 800;
const REVEAL_MS = 780;

type Phase = "idle" | "cover" | "reveal";

const labelFor = (to: string): string => {
  const pathname = to.split(/[?#]/)[0] || "/";
  const match = site.nav.find((n) => (n.to === "/" ? pathname === "/" : pathname === n.to || pathname.startsWith(`${n.to}/`)));
  return match?.label ?? "";
};

export default function PageTransition() {
  const setGate = useSetGate();
  const [phase, setPhase] = useState<Phase>("idle");
  const [label, setLabel] = useState<string | null>(null);
  const phaseRef = useRef<Phase>("idle");
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = (next: Phase) => {
      phaseRef.current = next;
      setPhase(next);
    };

    const clear = () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
      timer.current = null;
    };

    setGate((to, go) => {
      if (reduced.matches) {
        go();
        return;
      }
      if (phaseRef.current !== "idle") return;

      clear();
      setLabel(labelFor(to));
      update("cover");

      timer.current = window.setTimeout(() => {
        go();
        update("reveal");
        timer.current = window.setTimeout(() => {
          update("idle");
          setLabel(null);
        }, REVEAL_MS);
      }, COVER_MS);
    });

    return () => {
      setGate(null);
      clear();
    };
  }, [setGate]);

  return (
    <div className={`page-curtain ${phase !== "idle" ? `is-${phase}` : ""}`} aria-hidden="true">
      {Array.from({ length: COLUMNS }, (_, index) => (
        <span
          key={index}
          className="page-curtain__panel"
          style={{ "--panel": index } as CSSProperties}
        />
      ))}

      {label && (
        <div className="page-curtain__label">
          <span className="page-curtain__name">{label}</span>
        </div>
      )}
    </div>
  );
}
