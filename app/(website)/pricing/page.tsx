import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { getPricingPreview } from "@/sanity/lib/page-preview";
import { PagePreviewRuntime } from "@/components/page-preview-runtime";
import { Suspense } from "react";
import { PricingPage } from "@/components/pricing-page";
import { getPublishedPricingPage } from "@/sanity/lib/public-content";
import { pricingPageSeo } from "@/lib/pricing-cms";
export async function generateMetadata(): Promise<Metadata> { return pageMetadata("/pricing", pricingPageSeo(await getPublishedPricingPage(), "en")); }
async function PublishedPricing() {
  const content = await getPublishedPricingPage(), preview = await getPricingPreview();
  if (!preview) return <PricingPage content={content}/>;
  const draftContent = preview.content ? { ...preview.content, page: { ...preview.content.page, seo: content?.page.seo || {} } } : content;
  return <PagePreviewRuntime id="page-pricing"><PricingPage content={draftContent} preview/></PagePreviewRuntime>;
}
export default function Page() { return <Suspense fallback={<PricingPage/>}><PublishedPricing/></Suspense>; }
