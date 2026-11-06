import Certificate from "@/components/site/Certificate";
import { usePageMeta } from "@/usePageMeta";

export default function Credentials() {
  usePageMeta(
    "Credentials — Ahmad Choirudin",
    "Blockchain certificates earned by Ahmad Choirudin from Avalanche Academy, Rise In, and Starknet."
  );
  return <Certificate />;
}
