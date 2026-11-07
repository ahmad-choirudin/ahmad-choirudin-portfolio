import Timeline from "@/components/site/Timeline";
import Expertise from "@/components/site/Expertise";
import Process from "@/components/site/Process";
import { usePageMeta } from "@/usePageMeta";
import { routes } from "@/config/seo";

export default function About() {
  usePageMeta(routes["/about"]);
  return (
    <>
      <Timeline />
      <Expertise />
      <Process />
    </>
  );
}
