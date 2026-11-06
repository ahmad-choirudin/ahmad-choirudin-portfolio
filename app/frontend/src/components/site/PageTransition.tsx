import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";

const COLUMNS = 7;
const COVER_MS = 800;
const REVEAL_MS = 780;

type Phase = "idle" | "cover" | "reveal";

const labelFor = (hash: string, fallback: string): string => {
  const id = decodeURIComponent(hash.slice(1)).toLowerCase();
  const match = site.nav.find((n) => n.toLowerCase() === id);
  if (match) return match;
  return fallback.trim() || id.charAt(0).toUpperCase() + id.slice(1);
};

export default function PageTransition() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [label, setLabel] = useState<string | null>(null);
  const phaseRef = useRef<Phase>("idle");
  const timer = useRef<number | null>(null);
  const pendingHash = useRef<string | null>(null);

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

    const finish = () => {
      const hash = pendingHash.current;
      pendingHash.current = null;

      if (hash) {
        const target = document.getElementById(
          decodeURIComponent(hash.slice(1))
        );

        if (target) {
          const root = document.documentElement;
          root.style.scrollBehavior = "auto";
          target.scrollIntoView({ block: "start" });
          root.style.scrollBehavior = "";

          if (history.pushState) history.pushState(null, "", hash);

          if (target instanceof HTMLElement) {
            if (!target.hasAttribute("tabindex")) {
              target.setAttribute("tabindex", "-1");
            }

            target.focus({ preventScroll: true });
          }
        }
      }

      update("reveal");

      timer.current = window.setTimeout(() => {
        update("idle");
        setLabel(null);
      }, REVEAL_MS);
    };

    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as HTMLElement).closest(
        "a[href]"
      ) as HTMLAnchorElement | null;

      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) {
        return;
      }

      const url = new URL(anchor.href, window.location.href);

      if (
        url.origin !== location.origin ||
        url.pathname !== location.pathname ||
        !url.hash ||
        url.hash === "#main"
      ) {
        return;
      }

      if (reduced.matches || phaseRef.current !== "idle") return;

      const id = decodeURIComponent(url.hash.slice(1));
      if (!document.getElementById(id)) return;

      event.preventDefault();

      clear();
      pendingHash.current = url.hash;

      setLabel(labelFor(url.hash, anchor.textContent ?? ""));
      update("cover");

      timer.current = window.setTimeout(finish, COVER_MS);
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      clear();
    };
  }, []);

  return (
    <div
      className={`page-curtain ${phase !== "idle" ? `is-${phase}` : ""}`}
      aria-hidden="true"
    >
      {Array.from({ length: COLUMNS }, (_, index) => (
        <span
          key={index}
          className="page-curtain__panel"
          style={{ "--panel": index } as React.CSSProperties}
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
