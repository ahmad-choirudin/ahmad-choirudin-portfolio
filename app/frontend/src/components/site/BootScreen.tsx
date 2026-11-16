import { useEffect, useState } from "react";

const LINES = [
  "> init ahmad.choirudin.sys",
  "> loading modules ........ OK",
  "> connecting web3 nodes .. OK",
  "> render interface ....... READY",
];
const STEP = 320;

export default function BootScreen() {
  const [show, setShow] = useState(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    try { return !sessionStorage.getItem("booted"); } catch { return false; }
  });
  const [n, setN] = useState(0);
  const [out, setOut] = useState(false);

  useEffect(() => {
    if (!show) return;
    try { sessionStorage.setItem("booted", "1"); } catch {}
    const end = 250 + LINES.length * STEP;
    const timers = [
      ...LINES.map((_, i) => setTimeout(() => setN(i + 1), 250 + i * STEP)),
      setTimeout(() => setOut(true), end + 300),
      setTimeout(() => setShow(false), end + 900),
    ];
    return () => timers.forEach(clearTimeout);
  }, [show]);

  if (!show) return null;
  return (
    <div
      role="status"
      aria-label="Loading"
      onClick={() => setShow(false)}
      className={`fixed inset-0 z-[10001] grid place-items-center bg-bg font-mono text-sm transition-opacity duration-500 ${
        out ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-[min(90vw,28rem)]">
        {LINES.slice(0, n).map((l) => (
          <p key={l} className="text-accent">{l}</p>
        ))}
        <div className="mt-6 h-px w-full bg-line">
          <div className="h-full bg-accent transition-[width] duration-300" style={{ width: `${(n / LINES.length) * 100}%` }} />
        </div>
        <p className="mt-2 text-xs text-subtle">click to skip</p>
      </div>
    </div>
  );
}
