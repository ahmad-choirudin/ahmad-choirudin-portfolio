import TypewriterText from "./TypewriterText";
import LetterRise from "./LetterRise";

type Props = {
  /** Nomor otomatis per halaman (CSS counter). Set false untuk menonaktifkan. */
  numbered?: boolean;
  eyebrow: string;
  title: string;
  note?: string;
  className?: string;
};

// Eyebrow diketik (typewriter), judul naik per huruf (rise in).
export default function SectionHeading({ numbered = true, eyebrow, title, note, className = "" }: Props) {
  return (
    <div data-reveal="words" className={className}>
      <p className="eyebrow-type flex items-center gap-3 font-mono text-eyebrow font-medium uppercase text-accent">
        {numbered && <span className="sec-index tabular-nums text-subtle" aria-hidden="true" />}
        <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
        <TypewriterText text={eyebrow} speed={45} />
      </p>

      <h2 className="mt-5 font-display text-display-md font-semibold text-fg">
        <LetterRise text={title} delay={250} />
      </h2>

      {note && <p className="mt-4 max-w-md text-base leading-7 text-muted">{note}</p>}
    </div>
  );
}
