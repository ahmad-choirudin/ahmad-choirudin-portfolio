import { useParams } from "react-router-dom";
import TypewriterText from "@/components/site/TypewriterText";
import NotFound from "@/pages/NotFound";
import { projects } from "@/data/projects";
import { projectMeta, projectPath } from "@/config/seo";
import { usePageMeta } from "@/usePageMeta";

const toolsOf = (tools: string) =>
  tools.split(",").map((tool) => tool.trim()).filter(Boolean);

export default function ProjectDetail() {
  const { slug } = useParams();

  const index = projects.findIndex((project) => project.slug === slug);
  const project = index >= 0 ? projects[index] : null;

  usePageMeta(
    project
      ? projectMeta(project)
      : {
          title: "Page not found — Ahmad Choirudin",
          description: "This page does not exist.",
        }
  );

  if (!project) return <NotFound />;

  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  const facts = [
    { label: "Category", value: project.category },
    { label: "Project Type", value: project.period },
    ...(project.role ? [{ label: "My Role", value: project.role }] : []),
  ];

  return (
    <Section>
      {/* Back navigation */}
      <a
        href="/work"
        className="inline-flex items-center gap-2 font-mono text-eyebrow uppercase text-subtle transition-colors hover:text-accent"
      >
        <span aria-hidden="true">←</span>
        Back to selected work
      </a>

      {/* Project introduction */}
      <header className="mt-16 max-w-4xl">
        <p className="flex items-center gap-3 font-mono text-eyebrow uppercase text-accent">
          <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
          Project case study
        </p>

        <h1 className="mt-6 font-display text-display-lg font-semibold tracking-tight text-fg">
        <TypewriterText text={project.title} delay={150} speed={40} /></h1>

        <div className="mt-9 flex flex-wrap gap-3">
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-bg transition hover:-translate-y-0.5"
            >
              Visit Live Website
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                ↗
              </span>
            </a>
          )}

          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-fg/25 px-6 py-3.5 text-sm text-fg transition hover:-translate-y-0.5 hover:border-accent hover:text-accent"
            >
              View Source Code
              <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </header>

      {/* Main project image */}
      <figure className="mt-16 overflow-hidden rounded-2xl border border-line bg-card">
        <img
          src={project.image}
          alt={`${project.title} website preview`}
          width={1672}
          height={941}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="aspect-video w-full object-cover"
        />
      </figure>

      {/* Project information */}
      <dl className="mt-16 grid gap-8 border-y border-line py-10 sm:grid-cols-2 md:grid-cols-3">
        {facts.map((fact) => (
          <div key={fact.label}>
            <dt className="font-mono text-eyebrow uppercase tracking-wider text-subtle">
              {fact.label}
            </dt>
            <dd className="mt-3 text-base leading-7 text-fg">
              {fact.value}
            </dd>
          </div>
        ))}

        <div className="sm:col-span-2 md:col-span-3">
          <dt className="font-mono text-eyebrow uppercase tracking-wider text-subtle">
            Technology Stack
          </dt>

          <dd>
            <ul
              className="mt-4 flex flex-wrap gap-2"
              aria-label="Technologies used in this project"
            >
              {toolsOf(project.tools).map((tool) => (
                <li
                  key={tool}
                  className="rounded-full border border-line bg-card px-4 py-2 font-mono text-xs text-muted transition-colors hover:border-accent/50 hover:text-accent"
                >
                  {tool}
                </li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>

      {/* Project overview */}
      <section className="mt-20 max-w-3xl">
        <p className="font-mono text-eyebrow uppercase text-accent">
          Overview
        </p>

        <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-fg md:text-4xl">
          About the project
        </h2>

        <p className="mt-6 text-base leading-8 text-muted">
          {project.text}
        </p>
      </section>

      {/* Key highlights */}
      {project.highlights && project.highlights.length > 0 && (
        <section className="mt-20">
          <div className="max-w-2xl">
            <p className="font-mono text-eyebrow uppercase text-accent">
              Key highlights
            </p>

            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-fg md:text-4xl">
              What makes this project stand out
            </h2>

            <p className="mt-5 text-base leading-7 text-muted">
              An overview of the main capabilities, features, and technical
              aspects of this project.
            </p>
          </div>

          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {project.highlights.map((highlight, i) => (
              <li
                key={highlight}
                className="group flex gap-5 rounded-2xl border border-line bg-card/40 p-6 transition-colors hover:border-accent/40"
              >
                <span className="font-mono text-sm text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span className="text-sm leading-7 text-muted transition-colors group-hover:text-fg">
                  {highlight}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Additional project gallery */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="mt-20">
          <p className="font-mono text-eyebrow uppercase text-accent">
            Visual exploration
          </p>

          <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-fg md:text-4xl">
            Project gallery
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {project.gallery.map((item) => (
              <figure
                key={item.src}
                className="overflow-hidden rounded-2xl border border-line bg-card"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  decoding="async"
                  width={1200}
                  height={675}
                  className="aspect-video w-full object-cover transition duration-700 hover:scale-[1.02]"
                />
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* Project navigation */}
      {projects.length > 1 && (
        <nav
          aria-label="Navigate between projects"
          className="mt-24 grid gap-4 border-t border-line pt-10 md:grid-cols-2"
        >
          <a
            href={projectPath(prev)}
            className="group rounded-2xl border border-line p-6 transition-colors hover:border-accent/50"
          >
            <span className="font-mono text-eyebrow uppercase text-subtle">
              ← Previous project
            </span>

            <span className="mt-4 block font-display text-xl font-semibold text-fg transition-colors group-hover:text-accent">
              {prev.title}
            </span>
          </a>

          <a
            href={projectPath(next)}
            className="group rounded-2xl border border-line p-6 text-left transition-colors hover:border-accent/50 md:text-right"
          >
            <span className="font-mono text-eyebrow uppercase text-subtle">
              Next project →
            </span>

            <span className="mt-4 block font-display text-xl font-semibold text-fg transition-colors group-hover:text-accent">
              {next.title}
            </span>
          </a>
        </nav>
      )}

      {/* Back to work */}
      <div className="mt-12 text-center">
        <a
          href="/work"
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
        >
          ← Explore all projects
        </a>
      </div>
    </Section>
  );
}
