import Section from "./Section";
import SectionHeading from "./SectionHeading";
import { steps } from "@/data/process";

export default function Process() {
  return (
    <Section id="process">
      <SectionHeading eyebrow="Process" title="How I Work" note="A simple, repeatable way to move from idea to a shipped product." />
      <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
        {steps.map((step, i) => (
          <li key={step.title} data-reveal className="bg-bg p-6 md:p-8">
            <span className="font-mono text-xs tabular-nums text-subtle">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-6 font-display text-2xl font-semibold text-fg">{step.title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted">{step.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
