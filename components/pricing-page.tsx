"use client";
import { useEffect } from "react";
import { Pricing } from "@/components/home-page";
import { PageHero } from "@/components/page-hero";
import { PageModuleView } from "@/components/page-modules";
import { useLanguage } from "@/components/language-provider";
import { heroProps } from "@/lib/page-cms";
import { defaultPricingModules, pricingPageSeo, type PricingPageContent } from "@/lib/pricing-cms";
export function PricingPage({ content, preview = false }: { content?: PricingPageContent | null; preview?: boolean }) {
  const { locale } = useLanguage(), seo = pricingPageSeo(content, locale);
  useEffect(() => { document.title = seo.title; document.querySelector('meta[name="description"]')?.setAttribute("content", seo.description); }, [seo.title, seo.description]);
  return <main className="break-words bg-white"><PageHero {...heroProps(content?.page.hero, { en: "Pricing", zh: "价格" })} editContent={content?.page.hero}/><Pricing content={content?.pricing} preview={preview}/>{(content?.page.modules || defaultPricingModules()).map(module => <PageModuleView key={module.key} module={module}/>)}</main>;
}
