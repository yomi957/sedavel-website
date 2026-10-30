"use client";

import { PageHero } from "@/components/page-hero";
import { FeatureShowcase } from "@/components/feature-showcase";
import type { FeatureRecord } from "@/lib/features-cms";
import { useSiteSettings } from "@/components/site-settings-provider";
import { resolveDefaultSeo } from "@/lib/site-settings-cms";
import { useEffect } from "react";
import { useLanguage } from "@/components/language-provider";
import { PageModuleView } from "@/components/page-modules";
import { heroProps, pageSeo, featuresSeo, type WebsitePage } from "@/lib/page-cms";
import styles from "./home-landing.module.css";

export function FeaturesPage({ features, content, preview = false }: { features: FeatureRecord[]; content?: WebsitePage | null; preview?: boolean }) {
  const { locale } = useLanguage();
  const settings = useSiteSettings();
  const seo = pageSeo(content, locale, resolveDefaultSeo(settings, locale, featuresSeo));
  useEffect(() => { document.title = seo.title; document.querySelector('meta[name="description"]')?.setAttribute("content", seo.description); }, [seo.title, seo.description]);
  return <main className={styles.home}><PageHero {...heroProps(content?.hero)} editContent={content?.hero}/>{content ? content.modules.filter(m => m.visible).map(m => m.type === "featureSection" ? <FeatureShowcase key={m.key} features={m.features?.length ? features.filter(f => m.features!.includes(f.id)) : features} standalone preview={preview} heading={m} copy={content.displayCopy}/> : <PageModuleView key={m.key} module={m}/>) : <FeatureShowcase features={features} standalone preview={preview}/>}</main>;
}
