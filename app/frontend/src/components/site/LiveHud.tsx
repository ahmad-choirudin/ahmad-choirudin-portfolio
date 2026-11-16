import { useEffect, useState } from "react";

export default function LiveHud() {
  const [now, setNow] = useState(() => new Date());
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      setPct(h > 0 ? Math.round((scrollY / h) * 100) : 0);
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => { clearInterval(t); removeEventListener("scroll", onScroll); };
  }, []);

  const time = now.toLocaleTimeString("en-GB", { timeZone: "Asia/Jakarta", hour12: false });

  return (
    <div aria-hidden="true" className="mt-4 flex flex-wrap gap-x-6 gap-y-1 font-mono text-[11px] uppercase tracking-widest text-subtle">
      <span>WIB <span className="tabular-nums text-accent">{time}</span></span>
      <span>SYS <span className="text-accent">ONLINE</span></span>
      <span>SCROLL <span className="tabular-nums text-accent">{String(pct).padStart(3, "0")}%</span></span>
    </div>
  );
}
