import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { getHomePreview } from "@/sanity/lib/home-preview";
import { homeLive } from "@/sanity/lib/live";
import { Suspense } from "react";
import { getPublishedFeatures } from "@/sanity/lib/features";
import { selectFeatures } from "@/lib/features-cms";
import { HomeLanding } from "@/components/home-landing";
import { getPublishedSiteSettings } from "@/sanity/lib/public-content";
import { resolveDefaultSeo } from "@/lib/site-settings-cms";
import { homeDefaultSeo, resolveHomeSeo } from "@/lib/home-cms";
import { getPublishedHomePage } from "@/sanity/lib/home-page";

export async function generateMetadata(): Promise<Metadata> {
  const [content, settings] = await Promise.all([getPublishedHomePage(), getPublishedSiteSettings()]);
  // The existing website uses English on the server. Language switching stays client-side.
  return pageMetadata("/", resolveHomeSeo("en", content, resolveDefaultSeo(settings, "en", homeDefaultSeo)));
}

async function PublishedHome() {
  const [content, features] = await Promise.all([getPublishedHomePage(), getPublishedFeatures()]);
  const enabled = (await draftMode()).isEnabled && !!homeLive;
  if (!enabled) return <HomeLanding cmsContent={content} features={selectFeatures(features, "home")} />;
  const preview = await getHomePreview();
  // Phase 1 previews Hero only. Keep SEO, Features and shared settings published.
  const heroContent = preview ? { ...preview, seo: content?.seo } : content;
  return <><HomeLanding cmsContent={heroContent} features={selectFeatures(features, "home")} preview/></>;
}

export default function Home() {
  return <Suspense fallback={<HomeLanding />}><PublishedHome/></Suspense>;
}
