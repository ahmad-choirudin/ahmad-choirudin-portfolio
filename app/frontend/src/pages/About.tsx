import Timeline from "@/components/site/Timeline";
import Expertise from "@/components/site/Expertise";
import Process from "@/components/site/Process";
import { usePageMeta } from "@/usePageMeta";

export default function About() {
  usePageMeta(
    "About & Experience — Ahmad Choirudin",
    "Experience, expertise, and working process of Ahmad Choirudin across Web3, AI data, community operations, and frontend development."
  );
  return (
    <>
      <Timeline />
      <Expertise />
      <Process />
    </>
  );
}
