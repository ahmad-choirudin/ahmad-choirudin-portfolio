import Hero from "@/components/site/Hero";
import Marquee from "@/components/site/Marquee";
import SelectWork from "@/components/site/SelectWork";
import Introduction from "@/components/site/Introduction";
import Timeline from "@/components/site/Timeline";
import Expertise from "@/components/site/Expertise";
import Certificate from "@/components/site/Certificate";
import Process from "@/components/site/Process";
import Faq from "@/components/site/Faq";
import Contact from "@/components/site/Contact";
import { usePageMeta } from "@/usePageMeta";

export default function Home() {
  usePageMeta(
    "Ahmad Choirudin — Web3, Frontend, Community & AI",
    "Ahmad Choirudin — independent digital professional from Indonesia working across Web3, frontend, community, and AI data."
  );
  return (
    <>
      <Hero />
      <Marquee />
      <SelectWork />
      <Introduction />
      <Timeline />
      <Expertise />
      <Certificate />
      <Process />
      <Faq />
      <Contact />
    </>
  );
}
