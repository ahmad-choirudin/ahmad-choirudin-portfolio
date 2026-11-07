import type { ReactNode } from "react";

export function Container({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`mx-auto w-full max-w-page px-6 md:px-10 ${className}`}>{children}</div>;
}

type SectionProps = {
  id?: string;
  tight?: boolean;
  className?: string;
  children: ReactNode;
};

export default function Section({ id, tight = false, className = "", children }: SectionProps) {
  return (
    <section id={id} className={`relative ${tight ? "py-8 md:py-12" : "py-12 md:py-16"} ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}
