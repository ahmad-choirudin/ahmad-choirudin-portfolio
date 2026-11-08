import { Fragment } from "react";
import ScrambleText from "./ScrambleText";

type Props = {
  index?: string;
  eyebrow: string;
  title: string;
  note?: string;
  className?: string;
};

export default function SectionHeading({ index, eyebrow, title, note, className = "" }: Props) {
  const words = title.split(" ");

  return (
    <div data-reveal="words" className={className}>
      <p className="flex items-center gap-3 font-mono text-eyebrow font-medium uppercase text-accent">
        {index && <span className="tabular-nums text-subtle">{index}</span>}
        <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
        <ScrambleText text={eyebrow} delay={150} />
      </p>

      {/* Title reveals word by word from the left */}
      <h2 aria-label={title} className="mt-5 font-display text-display-md font-semibold text-fg">
        {words.map((w, i) => (
          <Fragment key={i}>
            <span className="wd" aria-hidden="true" style={{ "--w": i } as React.CSSProperties}>
              <span>{w}</span>
            </span>
            {i < words.length - 1 && " "}
          </Fragment>
        ))}
      </h2>

      {note && <p className="mt-4 max-w-md text-base leading-7 text-muted">{note}</p>}
    </div>
  );
}
