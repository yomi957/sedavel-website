import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/legal-page";

export async function generateMetadata() { return pageMetadata("/terms", { title: "Terms | Sedavel" }, false); }

export default function TermsPage() {
  return <LegalPage kind="terms" />;
}
