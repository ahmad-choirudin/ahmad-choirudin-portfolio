import Hero from "@/components/site/Hero";
import Marquee from "@/components/site/Marquee";
import Introduction from "@/components/site/Introduction";
import Explore from "@/components/site/Explore";
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
      <Introduction />
      <Explore />
    </>
  );
}
