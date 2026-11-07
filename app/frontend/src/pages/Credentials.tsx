import Certificate from "@/components/site/Certificate";
import { usePageMeta } from "@/usePageMeta";
import { routes } from "@/config/seo";

export default function Credentials() {
  usePageMeta(routes["/credentials"]);
  return <Certificate />;
}
