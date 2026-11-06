import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { certificates } from "../../data/certificate";
import Section from "./Section";
import SectionHeading from "./SectionHeading";

type Cert = (typeof certificates)[number];

function Lightbox({ cert, onClose }: { cert: Cert; onClose: () => void }) {
  const dialog = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeBtn.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      
      const nodes = dialog.current?.querySelectorAll<HTMLElement>("a[href], button");
      if (!nodes || nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label={`${cert.title} certificate`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <button
        ref={closeBtn}
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-fg/25 bg-bg/70 text-lg text-fg backdrop-blur transition-colors hover:border-accent hover:text-accent"
      >
        ✕
      </button>

      <div className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <img
          src={cert.image}
          alt={`${cert.title} certificate`}
          className="max-h-[78vh] w-full rounded-xl bg-white object-contain"
        />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-accent">{cert.issuer}</p>
            <p className="mt-1 font-display text-lg font-semibold text-fg">{cert.title}</p>
          </div>
          <a
            href={cert.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-fg/25 px-4 py-2 text-sm text-fg transition-colors hover:border-accent hover:text-accent"
          >
            View Certificate ↗
          </a>
        </div>
      </div>
    </div>
  );
}

export function Certificate() {
  const [zoom, setZoom] = useState<Cert | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState("All");
  const trigger = useRef<HTMLElement | null>(null);

  const issuers = useMemo(
    () => Array.from(new Set(certificates.map((c) => c.issuer))),
    []
  );
  
  const featured = useMemo(
    () => issuers.map((i) => certificates.find((c) => c.issuer === i)!),
    [issuers]
  );
  const list = tab === "All" ? certificates : certificates.filter((c) => c.issuer === tab);
  const count = (name: string) =>
    name === "All" ? certificates.length : certificates.filter((c) => c.issuer === name).length;

  const open = (c: Cert, el: HTMLElement) => {
    trigger.current = el;
    setZoom(c);
  };

  const close = useCallback(() => {
    setZoom(null);
    trigger.current?.focus();
  }, []);

  const toggle = () => {
    if (expanded) {
      setTab("All");
      document.getElementById("credentials")?.scrollIntoView({ block: "start" });
    }
    setExpanded(!expanded);
  };

  return (
    <Section id="credentials">
      <SectionHeading
        index="05"
        eyebrow="Learning & Credentials"
        title="Certificates"
        note="Selected blockchain learning achievements focused on smart contracts, testing, and decentralized application development."
      />

      {!expanded ? (
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {featured.map((c) => (
            <li
              key={c.image}
              className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-card transition-colors hover:border-accent/40"
            >
              <button
                type="button"
                onClick={(e) => open(c, e.currentTarget)}
                aria-label={`Enlarge ${c.title} certificate`}
                className="relative aspect-[4/3] overflow-hidden bg-black/30"
              >
                <img
                  src={c.image}
                  alt={`${c.title} certificate`}
                  loading="lazy"
                  className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.03]"
                />
              </button>

              <div className="flex flex-1 flex-col p-5">
                <p className="font-mono text-[11px] uppercase tracking-wider text-accent">{c.issuer}</p>
                <h3 className="mt-2 font-display text-lg font-semibold leading-snug tracking-tight text-fg">
                  {c.title}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">{c.learned}</p>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium text-accent transition-colors hover:text-fg"
                >
                  View Certificate <span aria-hidden="true">↗</span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-12">
          <div className="flex flex-wrap gap-2">
            {["All", ...issuers].map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setTab(name)}
                aria-pressed={tab === name}
                className={`rounded-full border px-4 py-2 text-xs transition-colors ${
                  tab === name
                    ? "border-accent text-accent"
                    : "border-fg/15 text-muted hover:text-fg"
                }`}
              >
                {name} <span className="text-subtle">{count(name)}</span>
              </button>
            ))}
          </div>

          <ul className="mt-6 border-t border-line">
            {list.map((c) => (
              <li key={c.image} className="flex items-center gap-4 border-b border-line py-4">
                <button
                  type="button"
                  onClick={(e) => open(c, e.currentTarget)}
                  aria-label={`Enlarge ${c.title} certificate`}
                  className="group flex min-w-0 flex-1 flex-col gap-1 text-left sm:flex-row sm:items-baseline sm:gap-6"
                >
                  <span className="shrink-0 font-mono text-[11px] uppercase tracking-wider text-accent sm:w-40">
                    {c.issuer}
                  </span>
                  <span className="text-base text-fg transition-colors group-hover:text-accent">
                    {c.title}
                  </span>
                </button>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${c.title} certificate (opens in a new tab)`}
                  className="shrink-0 text-sm text-muted transition-colors hover:text-accent"
                >
                  View ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <button
          type="button"
          onClick={toggle}
          aria-expanded={expanded}
          className="rounded-full border border-fg/25 px-6 py-3 text-sm text-fg transition-colors hover:border-accent hover:text-accent"
        >
          {expanded ? "Show less" : `View all ${certificates.length} certificates`}
        </button>
      </div>

      {zoom && <Lightbox cert={zoom} onClose={close} />}
    </Section>
  );
}

export default Certificate;
