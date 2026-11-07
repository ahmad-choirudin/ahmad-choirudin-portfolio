import SelectWork from "@/components/site/SelectWork";
import { usePageMeta } from "@/usePageMeta";
import { routes } from "@/config/seo";

export default function Work() {
  usePageMeta(routes["/work"]);
  return <SelectWork />;
}
