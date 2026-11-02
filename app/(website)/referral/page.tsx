import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { getReferralPreview } from "@/sanity/lib/page-preview";
import { PagePreviewRuntime } from "@/components/page-preview-runtime";
import { Suspense } from "react";
import { ReferralPage } from "@/components/referral-page";
import { getPublishedReferralPage } from "@/sanity/lib/public-content";
import { referralPageSeo } from "@/lib/referral-cms";
export async function generateMetadata(): Promise<Metadata> { return pageMetadata("/referral", referralPageSeo(await getPublishedReferralPage(), "en")); }
async function PublishedReferral() {
  const content = await getPublishedReferralPage(), preview = await getReferralPreview();
  if (!preview) return <ReferralPage content={content}/>;
  return <PagePreviewRuntime id="page-referral"><ReferralPage content={preview.content ?? content}/></PagePreviewRuntime>;
}
export default function Page() { return <Suspense fallback={<ReferralPage/>}><PublishedReferral/></Suspense>; }
