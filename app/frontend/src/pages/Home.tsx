import Hero from "@/components/site/Hero";
import Marquee from "@/components/site/Marquee";
import Introduction from "@/components/site/Introduction";
import Explore from "@/components/site/Explore";
import { usePageMeta } from "@/usePageMeta";
import { routes } from "@/config/seo";

export default function Home() {
  usePageMeta(routes["/"]);
  return (
    <>
      <Hero />
      <Marquee />
      <Introduction />
      <Explore />
    </>
  );
}
