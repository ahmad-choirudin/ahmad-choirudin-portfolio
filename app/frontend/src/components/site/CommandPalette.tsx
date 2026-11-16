import { useEffect, useMemo, useRef, useState } from "react";
import { site } from "@/data/site";
import { projects } from "@/data/projects";
import { useNavigate } from "@/router";

type Item = { id: string; group: string; label: string; hint?: string; run: () => void };

export default function CommandPalette() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  const items = useMemo<Item[]>(
    () => [
      ...site.nav.map((n) => ({ id: `n${n.to}`, group: "Page", label: n.label, hint: n.to, run: () => navigate(n.to) })),
      ...projects.map((p) => ({ id: `p${p.slug}`, group: "Project", label: p.title, hint: p.category, run: () => navigate(`/work/${p.slug}`) })),
      { id: "mail", group: "Action", label: "Copy email", hint: site.email, run: () => navigator.clipboard?.writeText(site.email) },
      ...site.socials.map((s) => ({ id: `s${s.label}`, group: "Social", label: s.label, hint: s.handle, run: () => window.open(s.href, "_blank", "noopener,noreferrer") })),
    ],
    [navigate]
  );

  const list = items.filter((i) => `${i.label} ${i.hint ?? ""}`.toLowerCase().includes(q.toLowerCase()));

  const close = () => { setOpen(false); setQ(""); setIdx(0); };
  const choose = (i?: Item) => { if (!i) return; close(); i.run(); };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    const onOpen = () => setOpen(true);
    addEventListener("keydown", onKey);
    addEventListener("open-palette", onOpen);
    return () => { removeEventListener("keydown", onKey); removeEventListener("open-palette", onOpen); };
  }, []);

  useEffect(() => { if (open) input.current?.focus(); }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4 pt-[15vh] backdrop-blur-sm" onClick={close}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
        className="sheet-in w-full max-w-lg overflow-hidden rounded-2xl border border-accent/30 bg-card shadow-[0_0_60px_-15px_rgb(var(--accent-rgb)/0.5)]"
      >
        <input
          ref={input}
          value={q}
          onChange={(e) => { setQ(e.target.value); setIdx(0); }}
          onKeyDown={(e) => {
            if (e.key === "Escape") close();
            else if (e.key === "ArrowDown") { e.preventDefault(); setIdx((i) => Math.min(i + 1, list.length - 1)); }
            else if (e.key === "ArrowUp") { e.preventDefault(); setIdx((i) => Math.max(i - 1, 0)); }
            else if (e.key === "Enter") choose(list[idx]);
          }}
          placeholder="Type a command or search…"
          className="w-full border-b border-line bg-transparent px-5 py-4 font-mono text-sm text-fg outline-none placeholder:text-subtle"
        />
        <ul className="max-h-[50vh] overflow-y-auto p-2">
          {list.length === 0 && <li className="px-3 py-6 text-center text-sm text-subtle">No results</li>}
          {list.map((i, n) => (
            <li key={i.id}>
              <button
                type="button"
                onMouseEnter={() => setIdx(n)}
                onClick={() => choose(i)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm ${
                  n === idx ? "bg-accent/10 text-accent" : "text-muted"
                }`}
              >
                <span>{i.label}</span>
                <span className="font-mono text-[11px] uppercase tracking-wider text-subtle">{i.group}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
