import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Section from "./Section";
import SectionHeading from "./SectionHeading";
import LetterRise from "./LetterRise";
import { projects } from "@/data/projects";

type Project = (typeof projects)[number];

const FILTER_MIN = 4;

const categoryOf = (p: Project) => p.category;
const toolsOf = (p: Project) => p.tools.split(",").map((t) => t.trim());

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const closeBtn = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prevOverflow = document.documentElement.style.overflow;
    const opener = document.activeElement as HTMLElement | null;
    document.documentElement.style.overflow = "hidden";
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const nodes = dialog.current?.querySelectorAll<HTMLElement>("a[href], button");
      if (!nodes || nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      opener?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        onClick={(e) => e.stopPropagation()}
        className="sheet-in relative max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-t-2xl border border-line bg-card sm:rounded-2xl"
      >
        <button
          ref={closeBtn}
          type="button"
          onClick={onClose}
          aria-label="Close project details"
          className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-fg/25 bg-bg/70 text-fg backdrop-blur transition-colors hover:border-accent"
        >
          ✕
        </button>
        <img src={project.image} alt={`${project.title} project screenshot`} className="aspect-video w-full object-cover" />
        <div className="p-6 md:p-8">
          <p className="font-mono text-eyebrow uppercase text-accent">{project.period}</p>
          <h3 className="mt-4 font-display text-3xl font-semibold tracking-tight text-fg"><LetterRise text={project.title} /></h3>
          <p className="mt-4 text-base leading-7 text-muted">{project.text}</p>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tools used">
            {toolsOf(project).map((t) => (
              <li key={t} className="rounded-full border border-line px-3 py-1 font-mono text-xs text-muted">{t}</li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={`/work/${project.slug}`} className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-bg transition hover:-translate-y-0.5">
              Full case study
            </a>
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer" className="rounded-full border border-fg/25 px-5 py-3 text-sm text-fg transition hover:border-accent hover:text-accent">
                Live Demo ↗
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="rounded-full border border-fg/25 px-5 py-3 text-sm text-fg transition hover:border-accent hover:text-accent">
                Source Code ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SelectedWork() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Project | null>(null);

  const categories = useMemo(() => ["All", ...Array.from(new Set(projects.map(categoryOf)))], []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter(
      (p) =>
        (category === "All" || categoryOf(p) === category) &&
        (!q || `${p.title} ${p.text} ${p.tools}`.toLowerCase().includes(q))
    );
  }, [category, query]);

  const reset = () => { setCategory("All"); setQuery(""); };
  const close = useCallback(() => setActive(null), []);
  const showControls = projects.length >= FILTER_MIN;

  return (
    <Section id="work">
      <SectionHeading
        index="01"
        eyebrow="Work"
        title="Selected Work"
        note="Selected projects across Web3 research, frontend development, and digital products."
      />

      {showControls && (
      <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={`rounded-full border px-4 py-2 text-xs transition-colors ${
                category === c ? "border-accent text-accent" : "border-fg/15 text-muted hover:text-fg"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects or tools"
          aria-label="Search projects"
          className="w-full rounded-full border border-line bg-transparent px-5 py-2.5 text-sm text-fg placeholder:text-subtle focus:border-accent focus:outline-none md:w-72"
        />
      </div>

      )}

      {showControls && <p className="sr-only" role="status">{visible.length} projects shown</p>}

      {visible.length === 0 ? (
        <div className="mt-16 rounded-2xl border border-line p-10 text-center">
          <p className="text-muted">No project matches your search.</p>
          <button type="button" onClick={reset} className="mt-4 rounded-full border border-fg/25 px-5 py-2 text-sm text-fg transition-colors hover:border-accent hover:text-accent">
            Reset filters
          </button>
        </div>
      ) : (
        <div className="mt-16 flex flex-col gap-20 md:gap-28">
          {visible.map((project, i) => (
            <article key={project.title} className="pop-in grid items-center gap-8 md:grid-cols-12 md:gap-12">
              <button
                type="button"
                data-tilt
                onClick={() => setActive(project)}
                aria-label={`View details of ${project.title}`}
                className={`group relative block overflow-hidden rounded-2xl border border-line bg-card text-left transition-colors hover:border-accent/40 md:col-span-7 ${
                  i % 2 === 1 ? "md:order-2" : ""
                }`}
              >
                <img
                  src={project.image}
                  alt={`${project.title} project screenshot`}
                  width={1672}
                  height={941}
                  loading="lazy"
                  className="aspect-video h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                />
                <span className="absolute bottom-4 right-4 translate-y-1 rounded-full bg-bg/80 px-3 py-1.5 font-mono text-xs text-fg opacity-0 backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                  View details
                </span>
              </button>

              <div className="md:col-span-5">
                <p className="flex items-center gap-3 font-mono text-eyebrow uppercase text-accent">
                  <span className="tabular-nums text-subtle">
                    {String(i + 1).padStart(2, "0")} / {String(visible.length).padStart(2, "0")}
                  </span>
                  <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
                  {project.period}
                </p>
                <h3 className="mt-5 font-display text-3xl font-semibold tracking-tight text-fg md:text-4xl"><LetterRise text={project.title} /></h3>
                <TypewriterText text={project.title} speed={35} /></h3>
                <p className="mt-5 line-clamp-4 text-base leading-7 text-muted">{project.text}</p>
                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tools used">
                  {toolsOf(project).map((t) => (
                    <li key={t} className="rounded-full border border-line px-3 py-1 font-mono text-xs text-muted">{t}</li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={`/work/${project.slug}`}
                    className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-bg transition hover:-translate-y-0.5"
                  >
                    Case study
                  </a>
                  {project.demo && (
                    <a href={project.demo} target="_blank" rel="noopener noreferrer" className="rounded-full border border-fg/25 px-5 py-3 text-sm text-fg transition hover:border-accent hover:text-accent">
                      Live Demo ↗
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {active && <ProjectModal project={active} onClose={close} />}
    </Section>
  );
}
