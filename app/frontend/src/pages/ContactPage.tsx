import Contact from "@/components/site/Contact";
import Faq from "@/components/site/Faq";
import { usePageMeta } from "@/usePageMeta";
import { routes } from "@/config/seo";

export default function ContactPage() {
  usePageMeta(routes["/contact"]);
  return (
    <>
      <Contact />
      <Faq />
    </>
  );
}
