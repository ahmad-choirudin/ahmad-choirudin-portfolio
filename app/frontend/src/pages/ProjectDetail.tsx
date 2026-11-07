import { useParams } from "react-router-dom";
import Section from "@/components/site/Section";
import NotFound from "@/pages/NotFound";
import { projects } from "@/data/projects";
import { projectMeta, projectPath } from "@/config/seo";
import { usePageMeta } from "@/usePageMeta";

const toolsOf = (tools: string) => tools.split(",").map((t) => t.trim());

export default function ProjectDetail() {
  const { slug } = useParams();
  const index = projects.findIndex((p) => p.slug === slug);
  const project = index >= 0 ? projects[index] : null;

  // Hook harus selalu dipanggil; untuk slug tidak dikenal, NotFound mengatur metanya sendiri.
  usePageMeta(project ? projectMeta(project) : { title: "Page not found — Ahmad Choirudin", description: "This page does not exist." });

  if (!project) return <NotFound />;

  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const facts: { label: string; value: string }[] = [
    { label: "Category", value: project.category },
    { label: "Type", value: project.period },
    ...(project.role ? [{ label: "Role", value: project.role }] : []),
  ];

  return (
    <Section>
      <a href="/work" className="font-mono text-eyebrow uppercase text-subtle transition-colors hover:text-accent">
        ← All work
      </a>

      <p className="mt-10 flex items-center gap-3 font-mono text-eyebrow uppercase text-accent">
        <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
        Case study
      </p>
      <h1 className="mt-5 max-w-4xl font-display text-display-lg font-semibold text-fg">{project.title}</h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">{project.text}</p>

      <div className="mt-10 flex flex-wrap gap-3">
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-bg transition hover:-translate-y-0.5"
          >
            Live Demo ↗
          </a>
        )}
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-fg/25 px-5 py-3 text-sm text-fg transition hover:border-accent hover:text-accent"
          >
            Source Code ↗
          </a>
        )}
      </div>

      <img
        src={project.image}
        alt={`${project.title} project screenshot`}
        width={1672}
        height={941}
        className="mt-14 aspect-video w-full rounded-2xl border border-line bg-card object-cover"
      />

      <dl className="mt-14 grid gap-x-8 gap-y-8 border-t border-line pt-10 md:grid-cols-3">
        {facts.map((f) => (
          <div key={f.label}>
            <dt className="font-mono text-eyebrow uppercase text-subtle">{f.label}</dt>
            <dd className="mt-3 text-base text-fg">{f.value}</dd>
          </div>
        ))}
        <div className="md:col-span-3">
          <dt className="font-mono text-eyebrow uppercase text-subtle">Stack</dt>
          <dd>
            <ul className="mt-3 flex flex-wrap gap-2" aria-label="Tools used">
              {toolsOf(project.tools).map((t) => (
                <li key={t} className="rounded-full border border-line px-3 py-1 font-mono text-xs text-muted">
                  {t}
                </li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>

      {project.highlights && project.highlights.length > 0 && (
        <div className="mt-16 max-w-2xl">
          <h2 className="font-display text-2xl font-semibold text-fg">Highlights</h2>
          <ul className="mt-6 space-y-4 text-base leading-7 text-muted">
            {project.highlights.map((h) => (
              <li key={h} className="flex gap-4">
                <span className="mt-3 h-px w-5 shrink-0 bg-accent/60" aria-hidden="true" />
                {h}
              </li>
            ))}
          </ul>
        </div>
      )}

      {project.gallery && project.gallery.length > 0 && (
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {project.gallery.map((g) => (
            <img
              key={g.src}
              src={g.src}
              alt={g.alt}
              loading="lazy"
              className="aspect-video w-full rounded-2xl border border-line bg-card object-cover"
            />
          ))}
        </div>
      )}

      {projects.length > 1 && (
        <nav aria-label="More projects" className="mt-24 grid gap-4 border-t border-line pt-10 md:grid-cols-2">
          <a href={projectPath(prev)} className="group rounded-2xl border border-line p-6 transition-colors hover:border-accent/40">
            <span className="font-mono text-eyebrow uppercase text-subtle">← Previous</span>
            <span className="mt-3 block font-display text-xl font-semibold text-fg transition-colors group-hover:text-accent">{prev.title}</span>
          </a>
          <a href={projectPath(next)} className="group rounded-2xl border border-line p-6 text-left transition-colors hover:border-accent/40 md:text-right">
            <span className="font-mono text-eyebrow uppercase text-subtle">Next →</span>
            <span className="mt-3 block font-display text-xl font-semibold text-fg transition-colors group-hover:text-accent">{next.title}</span>
          </a>
        </nav>
      )}
    </Section>
  );
}
