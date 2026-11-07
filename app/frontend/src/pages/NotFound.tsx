import { useEffect } from "react";
import Section from "@/components/site/Section";
import { usePageMeta } from "@/usePageMeta";

export default function NotFound() {
  usePageMeta({ title: "Page not found — Ahmad Choirudin", description: "This page does not exist." });

  useEffect(() => {
    const m = document.createElement("meta");
    m.name = "robots";
    m.content = "noindex";
    document.head.appendChild(m);
    return () => m.remove();
  }, []);

  return (
    <Section>
      <p className="font-mono text-eyebrow uppercase text-accent">404</p>
      <h1 className="mt-5 font-display text-display-md font-semibold text-fg">Page not found</h1>
      <p className="mt-4 max-w-md text-base leading-7 text-muted">
        The page you are looking for doesn’t exist or has moved.
      </p>
      <a
        href="/"
        className="mt-8 inline-flex rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-bg transition hover:-translate-y-0.5"
      >
        Back to home
      </a>
    </Section>
  );
}
