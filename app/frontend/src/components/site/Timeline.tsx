import { useEffect, useRef } from "react";
import Section from "./Section";
import SectionHeading from "./SectionHeading";
import { experience } from "@/data/experience";

export default function Timeline() {
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = list.current;
    if (!el) return;
    const rows = Array.from(el.querySelectorAll<HTMLElement>(".tl-item"));
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      rows.forEach((r) => r.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
    }), { threshold: 0.3 });
    rows.forEach((r) => io.observe(r));

    let ticking = false;
    const update = () => {
      ticking = false;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * 0.7 - r.top) / r.height));
      el.style.setProperty("--p", String(p));
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      io.disconnect();
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <Section id="experience">
      <div className="grid gap-12 md:grid-cols-12 md:gap-16">
        <div className="self-start md:sticky md:top-28 md:col-span-4">
          <SectionHeading
            index="03"
            eyebrow="Journey"
            title="Experience"
            note="The work behind the portfolio, from field sales to Web3 and AI."
          />
        </div>

        <ol ref={list} className="relative md:col-span-8">
          <span className="absolute bottom-1 left-[7px] top-1 w-px bg-fg/10" aria-hidden="true" />
          <span className="tl-line absolute bottom-1 left-[7px] top-1 w-px bg-accent" aria-hidden="true" />
          {experience.map((it) => (
            <li key={it.title} className="tl-item relative pb-12 pl-10 last:pb-0">
              <span className="tl-dot absolute left-0 top-2 h-[15px] w-[15px] rounded-full border-2 border-accent bg-bg" aria-hidden="true" />
              <p className="font-mono text-xs uppercase tracking-wider text-accent">{it.period}</p>
              <h3 className="mt-2 font-display text-xl font-semibold tracking-tight text-fg md:text-2xl">{it.title}</h3>
              <p className="mt-1 text-sm text-subtle">{it.org}</p>
              <p className="mt-3 text-base leading-7 text-muted">{it.text}</p>
              {it.tags && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {it.tags.map((t) => (
                    <li key={t} className="rounded-full border border-line px-3 py-1 font-mono text-xs text-muted">{t}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
