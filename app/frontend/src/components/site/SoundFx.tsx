import { useEffect, useRef, useState } from "react";

export default function SoundFx() {
  const [on, setOn] = useState(() => {
    try { return localStorage.getItem("sfx") === "1"; } catch { return false; }
  });
  const ctx = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!on) return;
    ctx.current ??= new AudioContext();
    const c = ctx.current;
    let lastEl: Element | null = null;
    let lastAt = 0;

    const beep = (freq: number, dur: number, vol: number) => {
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = "sine";
      o.frequency.value = freq;
      g.gain.setValueAtTime(vol, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
      o.connect(g);
      g.connect(c.destination);
      o.start();
      o.stop(c.currentTime + dur);
    };
    const wake = () => { void c.resume(); };
    const onOver = (e: PointerEvent) => {
      const el = (e.target as Element).closest("a,button,[role=button]");
      if (el && el !== lastEl && performance.now() - lastAt > 60) { lastAt = performance.now(); beep(1800, 0.04, 0.025); }
      lastEl = el;
    };
    const onClick = () => beep(600, 0.09, 0.04);

    wake();
    addEventListener("pointerdown", wake);
    addEventListener("pointerover", onOver);
    addEventListener("click", onClick);
    return () => {
      removeEventListener("pointerdown", wake);
      removeEventListener("pointerover", onOver);
      removeEventListener("click", onClick);
    };
  }, [on]);

  const toggle = () => {
    const next = !on;
    setOn(next);
    try { localStorage.setItem("sfx", next ? "1" : "0"); } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label="Toggle sound effects"
      className="fixed bottom-4 left-4 z-40 rounded-full border border-line bg-card/80 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-muted backdrop-blur transition-colors hover:border-accent hover:text-accent"
    >
      SFX <span className={on ? "text-accent" : ""}>{on ? "on" : "off"}</span>
    </button>
  );
}
