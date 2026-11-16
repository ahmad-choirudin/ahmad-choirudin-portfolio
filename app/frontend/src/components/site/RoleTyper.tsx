import { useEffect, useState } from "react";

const ROLES = ["Web3 Researcher", "Frontend Developer", "Community Operator", "AI Data Evaluator"];

type S = { i: number; n: number; del: boolean };

export default function RoleTyper() {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [s, setS] = useState<S>({ i: 0, n: reduced ? ROLES[0].length : 0, del: false });

  useEffect(() => {
    if (reduced) return;
    const { i, n, del } = s;
    const word = ROLES[i];
    let delay: number;
    let next: S;
    if (!del && n < word.length) { delay = 70; next = { i, n: n + 1, del }; }
    else if (!del) { delay = 1400; next = { i, n, del: true }; }
    else if (n > 0) { delay = 35; next = { i, n: n - 1, del }; }
    else { delay = 250; next = { i: (i + 1) % ROLES.length, n: 0, del: false }; }
    const t = window.setTimeout(() => setS(next), delay);
    return () => window.clearTimeout(t);
  }, [s, reduced]);

  return (
    <>
      <span className="sr-only">{ROLES.join(", ")}</span>
      <span aria-hidden="true">
        {ROLES[s.i].slice(0, s.n)}
        <span className="ml-0.5 inline-block h-[1em] w-[0.5ch] translate-y-[0.15em] bg-accent motion-safe:animate-pulse" />
      </span>
    </>
  );
}
