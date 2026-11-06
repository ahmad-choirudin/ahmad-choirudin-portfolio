import Section from "./Section";
import SectionHeading from "./SectionHeading";
import { faq } from "@/data/faq";

// Structured data FAQPage di-generate saat build dari data yang sama (lihat vite.config.ts).
export default function Faq() {
  return (
    <Section id="faq">
      <SectionHeading index="07" eyebrow="FAQ" title="Questions" />
      <div className="mt-12 border-t border-line">
        {faq.map((f) => (
          <details key={f.q} data-reveal className="group border-b border-line">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-display text-xl text-fg marker:hidden [&::-webkit-details-marker]:hidden">
              {f.q}
              <span aria-hidden="true" className="font-mono text-muted transition-transform duration-300 group-open:rotate-45">+</span>
            </summary>
            <p className="max-w-2xl pb-6 text-base leading-7 text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
