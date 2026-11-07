import Section from "./Section";
import SectionHeading from "./SectionHeading";
import { Hexagon, Network, Users, Code2, Bot, FileText, type LucideIcon } from "lucide-react";
import { expertise, type IconName } from "@/data/expertise";

const icons: Record<IconName, LucideIcon> = { Hexagon, Network, Users, Code2, Bot, FileText };

export default function Expertise() {
  return (
    <Section id="expertise">
      <SectionHeading
        index="04"
        eyebrow="Capabilities"
        title="Expertise"
        note="Areas I focus on, with different levels of experience and practice."
      />

      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {expertise.map((e, i) => {
          const Icon = icons[e.icon];
          return (
            <li key={e.name} data-reveal>
              <div data-tilt className="group h-full rounded-2xl border border-line bg-card p-6 transition-colors hover:border-accent/40">
                <div className="flex items-start justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-bg text-accent transition-colors group-hover:border-accent/40">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="font-mono text-xs tabular-nums text-subtle">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-8 font-display text-xl font-semibold tracking-tight text-fg">
                  {e.name}
                </h3>
                <p className="mt-2 text-sm text-muted">{e.level}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
