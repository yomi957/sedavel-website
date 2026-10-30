import type { Metadata } from "next";
import { getFeaturesPreview } from "@/sanity/lib/page-preview";
import { PagePreviewRuntime } from "@/components/page-preview-runtime";
import { Suspense } from "react";
import { FeaturesPage } from "@/components/features-page";
import { defaultFeatures, selectFeatures } from "@/lib/features-cms";
import { resolveDefaultSeo } from "@/lib/site-settings-cms";
import { getPublishedWebsitePage, getPublishedSiteSettings } from "@/sanity/lib/public-content";
import { featuresSeo, pageSeo } from "@/lib/page-cms";
import { getPublishedFeatures } from "@/sanity/lib/features";

export async function generateMetadata(): Promise<Metadata> { const [content, settings] = await Promise.all([getPublishedWebsitePage(), getPublishedSiteSettings()]); return pageSeo(content, "en", resolveDefaultSeo(settings, "en", featuresSeo)); }
async function PublishedFeatures() {
  const [records, content] = await Promise.all([getPublishedFeatures(), getPublishedWebsitePage()]);
  const preview = await getFeaturesPreview();
  if (!preview) return <FeaturesPage features={selectFeatures(records, "features")} content={content} />;
  const draftContent = preview.content ? { ...preview.content, seo: content?.seo || {} } : content;
  return <PagePreviewRuntime id="page-features"><FeaturesPage features={selectFeatures(preview.records ?? records, "features")} content={draftContent} preview/></PagePreviewRuntime>;
}
export default function Page() {
  return <Suspense fallback={<FeaturesPage features={defaultFeatures()}/>}><PublishedFeatures /></Suspense>;
}
