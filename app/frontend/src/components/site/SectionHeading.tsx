import ScrambleText from "./ScrambleText";
import TypewriterText from "./TypewriterText";

type Props = {
  index?: string;
  eyebrow: string;
  title: string;
  note?: string;
  className?: string;
};

const TITLE_DELAY = 150;
const TITLE_SPEED = 45;
const NOTE_SPEED = 14;

export default function SectionHeading({ index, eyebrow, title, note, className = "" }: Props) {
  // The note starts typing right after the title has finished.
  const noteDelay = TITLE_DELAY + title.length * TITLE_SPEED + 150;

  return (
    <div data-reveal="words" className={className}>
      <p className="flex items-center gap-3 font-mono text-eyebrow font-medium uppercase text-accent">
        {index && <span className="tabular-nums text-subtle">{index}</span>}
        <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
        <ScrambleText text={eyebrow} />
      </p>

      <h2 className="mt-5 font-display text-display-md font-semibold text-fg">
        <TypewriterText text={title} delay={TITLE_DELAY} speed={TITLE_SPEED} />
      </h2>

      {note && (
        <p className="mt-4 max-w-md text-base leading-7 text-muted">
          <TypewriterText text={note} delay={noteDelay} speed={NOTE_SPEED} caret={false} />
        </p>
      )}
    </div>
  );
}
