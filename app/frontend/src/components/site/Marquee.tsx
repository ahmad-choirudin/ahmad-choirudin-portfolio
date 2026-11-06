import { tools } from "@/data/tools";

export default function Marquee() {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center gap-8 pr-8" aria-hidden={hidden}>
      {tools.map((t) => (
        <li key={t} className="flex items-center gap-8 whitespace-nowrap text-sm text-muted">
          <span>{t}</span>
          <span className="text-accent/60" aria-hidden="true">✳</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div
      role="group"
      className="marquee overflow-hidden border-y border-line py-5 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
      aria-label="Tools and ecosystems I work with"
    >
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
