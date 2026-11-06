import SelectWork from "@/components/site/SelectWork";
import { usePageMeta } from "@/usePageMeta";

export default function Work() {
  usePageMeta(
    "Work — Ahmad Choirudin",
    "Selected projects by Ahmad Choirudin across Web3 research, frontend development, and digital products."
  );
  return <SelectWork />;
}
