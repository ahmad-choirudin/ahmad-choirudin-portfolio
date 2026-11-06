import Contact from "@/components/site/Contact";
import Faq from "@/components/site/Faq";
import { usePageMeta } from "@/usePageMeta";

export default function ContactPage() {
  usePageMeta(
    "Contact — Ahmad Choirudin",
    "Get in touch with Ahmad Choirudin for remote work, collaborations, or questions."
  );
  return (
    <>
      <Contact />
      <Faq />
    </>
  );
}
