import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/legal-page";

export async function generateMetadata() { return pageMetadata("/privacy", { title: "Privacy | Sedavel" }, false); }

export default function PrivacyPage() {
  return <LegalPage kind="privacy" />;
}
