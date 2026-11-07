import { useEffect, useRef, useState } from "react";
import { certificates } from "../../data/certificate";
import { projects } from "../../data/projects";
import { expertise } from "../../data/expertise";

const START_YEAR = 2020;
const YEARS = new Date().getFullYear() - START_YEAR;

function Count({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const [reduced] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    let raf = 0;
    let active = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || !active) return;

        observer.disconnect();

        const start = performance.now();
        const duration = 1400;

        const animate = (now: number) => {
          if (!active) return;

          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);

          setValue(Math.round(to * eased));

          if (progress < 1) {
            raf = requestAnimationFrame(animate);
          } else {
            setValue(to);
          }
        };

        raf = requestAnimationFrame(animate);
      },
      { threshold: 0.4 }
    );

    observer.observe(el);

    return () => {
      active = false;
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, reduced]);

  return (
    <span ref={ref} className="tabular-nums">
      {reduced ? to : value}
      {suffix}
    </span>
  );
}

export default function StatsCounter() {
  const stats = [
    { to: certificates.length, suffix: "", label: "Certificates earned" },
    { to: projects.length, suffix: "", label: "Projects built" },
    { to: YEARS, suffix: "+", label: "Years in communities" },
    { to: expertise.length, suffix: "", label: "Areas of expertise" },
  ];

  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col border-l border-line pl-5"
        >
          <dt className="order-2 mt-2 text-sm text-muted">
            {stat.label}
          </dt>
          <dd className="font-display text-5xl font-semibold tracking-tight text-accent">
            <Count to={stat.to} suffix={stat.suffix} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
