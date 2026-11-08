import TypewriterText from "./TypewriterText";

type Props = {
  index?: string;
  eyebrow: string;
  title: string;
  note?: string;
  className?: string;
};

export default function SectionHeading({ index, eyebrow, title, note, className = "" }: Props) {
  return (
    <div data-reveal="words" className={className}>
      <p className="flex items-center gap-3 font-mono text-eyebrow font-medium uppercase text-accent">
        {index && <span className="tabular-nums text-subtle">{index}</span>}
        <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
        {eyebrow}
      </p>

      <h2 className="mt-5 font-display text-display-md font-semibold text-fg">
        <TypewriterText text={title} delay={150} speed={45} />
      </h2>

      {note && <p className="mt-4 max-w-md text-base leading-7 text-muted">{note}</p>}
    </div>
  );
}
