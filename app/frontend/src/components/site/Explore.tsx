import Section from "./Section";
import SectionHeading from "./SectionHeading";

const links = [
  { to: "/work", title: "Work", text: "Selected projects across Web3, dashboards, and marketplaces." },
  { to: "/about", title: "Experience", text: "My background, expertise, and the way I work." },
  { to: "/credentials", title: "Credentials", text: "Blockchain certificates from Avalanche, Rise In, and Starknet." },
  { to: "/contact", title: "Contact", text: "Questions, collaborations, or just to say hi." },
];

export default function Explore() {
  return (
    <Section id="explore" className="pt-10 md:pt-12">
      <SectionHeading eyebrow="Explore" title="Explore the Site" />
      <ul className="mt-12 grid gap-4 sm:grid-cols-2">
        {links.map((l, i) => (
          <li key={l.to} data-reveal>
            <a
              href={l.to}
              className="group flex h-full flex-col rounded-2xl border border-line bg-card p-6 transition-colors hover:border-accent/40"
            >
              <span className="font-mono text-xs tabular-nums text-subtle">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-8 flex items-center justify-between font-display text-2xl font-semibold tracking-tight text-fg">
                {l.title}
                <span aria-hidden="true" className="text-accent transition-transform duration-300 group-hover:translate-x-1">→</span>
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted">{l.text}</p>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
