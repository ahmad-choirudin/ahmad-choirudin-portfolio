import { useCallback, useEffect, useState } from "react";
import { site } from "@/data/site";
import NetworkBackground from "./NetworkBackground";
import ParticlePhoto from "./ParticlePhoto";
import { Container } from "./Section";

const lines = [
  "Building at the",
  "intersection of",
  "Web3, technology &",
  "digital communities.",
];

export default function Hero() {
  const [done, setDone] = useState(false);
  const handleDone = useCallback(() => setDone(true), []);

  useEffect(() => {
    const t = window.setTimeout(() => setDone(true), 5000);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <section className="relative isolate flex min-h-[88svh] items-center overflow-hidden pt-16">
      <NetworkBackground />

      {/* Cahaya aksen di belakang foto */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/4 -z-10 h-[28rem] w-[28rem] rounded-full bg-accent/10 blur-3xl"
      />

      {/* Foto: partikel berkumpul, lalu crossfade ke foto asli */}
      <div className="absolute inset-y-0 right-0 w-full md:w-1/2 md:pt-16">
        <div className="hero-photo relative h-full w-full">
          <img
            src={site.heroImage}
            alt="Ahmad Choirudin"
            width={1024}
            height={1280}
            className={`h-full w-full object-cover object-[center_20%] transition-opacity duration-700 ${
              done ? "opacity-70 md:opacity-100" : "opacity-0"
            }`}
          />
          <ParticlePhoto
            src={site.heroImage}
            onDone={handleDone}
            className={`pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-700 ${
              done ? "opacity-0" : "opacity-70 md:opacity-100"
            }`}
          />
        </div>
        {/* HP: gelap merata supaya teks terbaca */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/30 md:hidden" />
        {/* Desktop: pudar tipis ke kiri */}
        <div className="absolute inset-0 hidden bg-gradient-to-r from-bg via-bg/10 to-transparent md:block md:w-1/3" />
        {/* Pudar ke bawah supaya menyatu dengan marquee */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
      </div>

      <Container className="relative py-16">
        <div className="hero-in relative max-w-3xl">
          <p className="flex items-center gap-3 font-mono text-eyebrow uppercase text-muted">
            <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
            {site.role}
          </p>

          <h1
            className="split mt-8 font-display text-[clamp(2.25rem,4.6vw,3.75rem)] font-semibold leading-[1.02] tracking-tight"
            aria-label={lines.join(" ")}
          >
            {lines.map((line, i) => (
              <span
                key={line}
                className={`ln ${i > 1 ? "acc" : ""}`}
                style={{ "--l": i } as React.CSSProperties}
                aria-hidden="true"
              >
                <span>{line}</span>
              </span>
            ))}
          </h1>

          <p className="mt-8 max-w-lg text-base leading-7 text-muted md:text-lg md:leading-8">
            I work across Web3 research, community operations, AI data quality,
            and frontend development. I contribute to digital ecosystems through
            research, evaluation, community support, and hands-on projects.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="/work"
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-bg transition hover:-translate-y-0.5 hover:shadow-[0_10px_26px_-10px_rgb(var(--accent-rgb)/0.7)]"
            >
              Explore My Work
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
            </a>

            <a
              href="/contact"
              className="rounded-full border border-fg/25 px-6 py-3.5 text-sm text-fg transition hover:-translate-y-0.5 hover:border-accent hover:text-accent"
            >
              Let’s Connect
            </a>
          </div>

          <p className="mt-10 inline-flex items-center gap-2.5 rounded-full border border-line bg-bg/40 px-3.5 py-1.5 font-mono text-xs text-muted backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Open to remote opportunities
          </p>
        </div>
      </Container>
    </section>
  );
}
