import { useEffect, useState } from "react";

const ROLES = ["Web3 Researcher", "Frontend Developer", "Community Operator", "AI Data Evaluator"];

export default function RoleTyper() {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [i, setI] = useState(0);
  const [n, setN] = useState(reduced ? ROLES[0].length : 0);
  const [del, setDel] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const word = ROLES[i];
    let t: number;
    if (!del && n < word.length) t = window.setTimeout(() => setN(n + 1), 70);
    else if (!del) t = window.setTimeout(() => setDel(true), 1400);
    else if (n > 0) t = window.setTimeout(() => setN(n - 1), 35);
    else { setDel(false); setI((i + 1) % ROLES.length); return; }
    return () => window.clearTimeout(t);
  }, [n, del, i, reduced]);

  return (
    <>
      <span className="sr-only">{ROLES.join(", ")}</span>
      <span aria-hidden="true">
        {ROLES[i].slice(0, n)}
        <span className="ml-0.5 inline-block h-[1em] w-[0.5ch] translate-y-[0.15em] bg-accent motion-safe:animate-pulse" />
      </span>
    </>
  );
}
