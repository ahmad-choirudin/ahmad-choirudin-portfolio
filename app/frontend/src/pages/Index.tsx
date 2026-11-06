import SiteNav from "@/components/site/SiteNav";
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
import CursorLayer from "@/components/site/CursorLayer";
import PageTransition from "@/components/site/PageTransition";
import SiteFooter from "@/components/site/SiteFooter";

export default function Index() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-bg"
      >
        Skip to content
      </a>
      <PageTransition />
      <CursorLayer />
      <SiteNav />
      <main id="main">
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
      </main>
      <SiteFooter />
    </>
  );
}
