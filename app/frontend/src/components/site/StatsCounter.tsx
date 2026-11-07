import { useEffect, useRef, useState } from "react";
import { certificates } from "../../data/certificate";
import { projects } from "../../data/projects";
import { expertise } from "../../data/expertise";

const START_YEAR = 2020;
const YEARS = new Date().getFullYear() - START_YEAR;

function Count({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  // Dibaca sekali saat mount; jika reduced-motion, angka langsung tampil tanpa animasi.
  const [reduced] = useState(() => matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / 1400);
        setValue(Math.round(to * (1 - Math.pow(1 - t, 3))));
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to, reduced]);

  return <span ref={ref} className="tabular-nums">{reduced ? to : value}{suffix}</span>;
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
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col border-l border-line pl-5">
          <dt className="order-2 mt-2 text-sm text-muted">{s.label}</dt>
          <dd className="font-display text-5xl font-semibold tracking-tight text-accent">
            <Count to={s.to} suffix={s.suffix} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
