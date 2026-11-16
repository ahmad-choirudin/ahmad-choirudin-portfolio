import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { projects } from "@/data/projects";
import { useNavigate } from "@/router";

type Line = { kind: "in" | "out"; text: string };

const HELP = [
  "help           list commands",
  "about          about me",
  "projects       list projects",
  "open <no|slug> open a projects",
  "go <halaman>   home, work, about, credentials, contact",
  "socials        social links",
  "contact        email & WhatsApp",
  "whoami, date, clear, exit",
];
const PAGES: Record<string, string> = {
  home: "/", work: "/work", about: "/about", credentials: "/credentials", contact: "/contact",
};

export default function Terminal() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([{ kind: "out", text: "Ahmad Choirudin OS v1.0 — type 'help'." }]);
  const [val, setVal] = useState("");
  const hist = useRef<string[]>([]);
  const hi = useRef(-1);
  const input = useRef<HTMLInputElement>(null);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const toggle = () => setOpen((v) => !v);
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === "`" && !/INPUT|TEXTAREA/.test(t.tagName)) { e.preventDefault(); toggle(); }
    };
    addEventListener("keydown", onKey);
    addEventListener("open-terminal", toggle);
    return () => { removeEventListener("keydown", onKey); removeEventListener("open-terminal", toggle); };
  }, []);

  useEffect(() => { if (open) input.current?.focus(); }, [open]);
  useEffect(() => { end.current?.scrollIntoView({ block: "end" }); }, [lines, open]);

  const exec = (raw: string): string[] => {
    const [c = "", ...a] = raw.trim().split(/\s+/);
    const arg = a.join(" ").toLowerCase();
    switch (c.toLowerCase()) {
      case "help": return HELP;
      case "about": return [`${site.name} — ${site.role}`, "Web3 research, community ops, AI data quality, frontend dev."];
      case "projects": return projects.map((p, i) => `${i + 1}. ${p.title}  [${p.slug}]`);
      case "open": {
        const p = projects[Number(arg) - 1] ?? projects.find((x) => x.slug === arg);
        if (!p) return ["project not found. try 'projects'."];
        navigate(`/work/${p.slug}`); setOpen(false);
        return [`opening ${p.title}...`];
      }
      case "go": {
        const to = PAGES[arg];
        if (!to) return ["pages: home, work, about, credentials, contact"];
        navigate(to); setOpen(false);
        return [`menuju ${to}...`];
      }
      case "socials": return site.socials.map((s) => `${s.label}: ${s.href}`);
      case "contact": return [site.email, `https://wa.me/${site.whatsapp}`];
      case "whoami": return ["guest@portfolio"];
      case "date": return [new Date().toLocaleString("en-GB", { timeZone: "Asia/Jakarta" }) + " WIB"];
      case "exit": setOpen(false); return [];
      default: return [`command not found: ${c}. type 'help'.`];
    }
  };

  const submit = () => {
    const raw = val.trim();
    setVal(""); hi.current = -1;
    if (!raw) return;
    hist.current.unshift(raw);
    if (raw.toLowerCase() === "clear") { setLines([]); return; }
    setLines((l) => [...l, { kind: "in", text: raw }, ...exec(raw).map((text) => ({ kind: "out" as const, text }))]);
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open terminal"
        className="fixed bottom-4 right-4 z-40 rounded-full border border-accent/40 bg-card/80 px-3.5 py-2 font-mono text-xs text-accent backdrop-blur transition hover:-translate-y-0.5 hover:border-accent"
      >
        ›_
      </button>
    );
  }

  return (
    <div
      role="dialog"
      aria-label="Terminal"
      className="fixed bottom-4 right-4 z-40 flex h-80 w-[min(92vw,34rem)] flex-col overflow-hidden rounded-xl border border-accent/30 bg-card/95 font-mono text-xs shadow-[0_0_50px_-15px_rgb(var(--accent-rgb)/0.5)] backdrop-blur"
      onClick={() => input.current?.focus()}
    >
      <div className="flex items-center justify-between border-b border-line px-3 py-2 text-subtle">
        <span>guest@portfolio ~</span>
        <button type="button" onClick={() => setOpen(false)} aria-label="Close terminal" className="hover:text-accent">✕</button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 leading-6">
        {lines.map((l, i) => (
          <p key={i} className={`whitespace-pre-wrap break-words ${l.kind === "in" ? "text-fg" : "text-muted"}`}>
            {l.kind === "in" && <span className="text-accent">$ </span>}{l.text}
          </p>
        ))}
        <div className="flex items-center gap-2">
          <span className="text-accent">$</span>
          <input
            ref={input}
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
              else if (e.key === "Escape") setOpen(false);
              else if (e.key === "ArrowUp") {
                e.preventDefault();
                hi.current = Math.min(hi.current + 1, hist.current.length - 1);
                setVal(hist.current[hi.current] ?? "");
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                hi.current = Math.max(hi.current - 1, -1);
                setVal(hist.current[hi.current] ?? "");
              }
            }}
            aria-label="Terminal input"
            autoComplete="off"
            spellCheck={false}
            className="flex-1 bg-transparent text-fg outline-none"
          />
        </div>
        <div ref={end} />
      </div>
    </div>
  );
  }
