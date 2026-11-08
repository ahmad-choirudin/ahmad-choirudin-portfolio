import Section from "./Section";
import SectionHeading from "./SectionHeading";
import StatsCounter from "./StatsCounter";
import DotPortrait from "./DotPortrait";

export default function Introduction() {
  return (
    <Section id="about" className="pb-10 md:pb-12">
      <div className="grid gap-12 md:grid-cols-12 md:gap-16">
        <div data-reveal className="md:col-span-7">
          <SectionHeading eyebrow="About" title="About Me" />

          <p className="mt-8 text-xl leading-8 text-fg md:text-2xl md:leading-9">
            I’m Ahmad Choirudin, a digital professional from Indonesia with
            experience across Web3 research, community operations, and AI data
            projects.
          </p>

          <div className="mt-6 space-y-5 text-base leading-7 text-muted">
            <p>
              My work includes blockchain ecosystem research, online community
              moderation, AI evaluation, and data annotation. I’m also building
              practical frontend projects to strengthen my skills in creating
              modern web experiences.
            </p>

            <p>
              I value clear communication, attention to detail, and continuous
              learning. I’m interested in contributing to remote teams working
              on digital products, emerging technologies, and online
              communities.
            </p>
          </div>
        </div>

        <div data-reveal className="md:col-span-5">
          <DotPortrait
            label="Portrait of Ahmad Choirudin"
            className="aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl border border-line bg-card md:ml-auto"
          />
        </div>
      </div>

      <div
        data-reveal
        className="mt-16 border-t border-line pt-10 md:mt-24 md:pt-12"
      >
        <StatsCounter />
      </div>
    </Section>
  );
}
