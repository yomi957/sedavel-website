import "server-only";
import { cache } from "react";
import { connection } from "next/server";
import { defineQuery } from "next-sanity";
import { normalizeReferralContent } from "@/lib/referral-cms";
import { normalizeDownloadContent } from "@/lib/download-cms";
import { normalizePricingContent } from "@/lib/pricing-cms";
import { normalizeWebsitePage } from "@/lib/page-cms";
import { normalizeSiteSettings } from "@/lib/site-settings-cms";
import { dataset, projectId } from "@/sanity/env";
import { publishedClient } from "./client";
const asset = `altEn,altZh,captionEn,captionZh,ratio,style,crop,hotspot,"url":asset->url,"width":asset->metadata.dimensions.width,"height":asset->metadata.dimensions.height`;
export const websitePageQuery = defineQuery(`*[_type == "websitePage" && _id == "page-features" && pageKey == "features"][0]{_id,hero{title,description,backgroundStyle,showDecoration,primaryAction,secondaryAction,backgroundImage{${asset}},decorativeImage{${asset}}},seo,displayCopy,modules[]{_key,_type,visible,displayOrder,title,description,eyebrow,features,imageSide,action,primaryAction,secondaryAction,image{${asset}},items,cards[]{title,description,action,icon{name,image{${asset}}}}}}`);
export const pricingPageQuery = defineQuery(`*[_type == "websitePage" && _id == "page-pricing" && pageKey == "pricing"][0]{_id,pageKey,hero{title,description,backgroundStyle,showDecoration,primaryAction,secondaryAction,backgroundImage{${asset}},decorativeImage{${asset}}},seo,pricing{eyebrow,title,introduction,benefitsEn,benefitsZh,featuredLabel,buttonText,cards[]{_key,planKey,description,benefitsEn,benefitsZh,buttonText,image{${asset}},icon{name,image{${asset}}}}},modules[]{_key,_type,visible,displayOrder,title,description,eyebrow,imageSide,action,primaryAction,secondaryAction,image{${asset}},items,cards[]{title,description,action,icon{name,image{${asset}}}}}}`);
export const downloadPageQuery = defineQuery(`*[_type == "websitePage" && _id == "page-download" && pageKey == "download"][0]{_id,pageKey,hero{title,description,backgroundStyle,showDecoration,primaryAction,secondaryAction,backgroundImage{${asset}},decorativeImage{${asset}}},seo,download{eyebrow,title,description,labels,showInstallation,installationTitle,installationDescription,platforms[]{_key,platformKey,name,description,buttonText,statusDescription,showIcon,iconPreset,showImage,iconImage{${asset}},image{${asset}},releaseDetails{confirmed,version,packageSize,releasedAt,requirements,architecture}},steps[]{_key,platform,title,description,visible,showImage,image{${asset}}},shareImageEn{${asset}},shareImageZh{${asset}}},modules[]{_key,_type,visible,displayOrder,title,description,eyebrow,imageSide,action,primaryAction,secondaryAction,image{${asset}},items,cards[]{title,description,action,icon{name,image{${asset}}}}}}`);
export const referralPageQuery = defineQuery(`*[_type == "websitePage" && _id == "page-referral" && pageKey == "referral"][0]{_id,pageKey,hero{title,description,backgroundStyle,showDecoration,primaryAction,secondaryAction,backgroundImage{${asset}},decorativeImage{${asset}}},seo,referral{eyebrow,programStatus,cashbackPercentage,rulesConfirmed,rewardDescription,terms,sections[]{_key,kind,visible,displayOrder,title,description,showImage,image{${asset}},cards[]{_key,title,description,visible,showImage,image{${asset}},icon{name,image{${asset}}}}},modules[]{_key,_type,visible,displayOrder,title,description,eyebrow,imageSide,action,primaryAction,secondaryAction,image{${asset}},items,cards[]{title,description,action,icon{name,image{${asset}}}}}}`);
export const siteSettingsQuery = defineQuery(`*[_type == "siteSettings" && _id == "siteSettings"][0]{_id,websiteName,websiteNameLocalized,defaultLanguage,languageLabels,navigationItems,footerContent,footerGroups,footerCopyright,globalCtaText,contactInformation,contactEmail,socialLinks,seoDefaultTitle,seoDefaultDescription,logo{${asset}},favicon{${asset}},seoDefaultImageEn{${asset}},seoDefaultImageZh{${asset}}}`);
export const getPublishedWebsitePage = cache(async () => {
  await connection(); if (!publishedClient) return null;
  try {
    const content = normalizeWebsitePage(await publishedClient.fetch<unknown>(websitePageQuery, {}, { perspective: "published", cache: "no-store" }), projectId, dataset);
    // Strip hidden modules before serialization, after fallback decisions are made.
    return content ? { ...content, modules: content.modules.filter(module => module.visible) } : null;
  }
  catch { console.warn("[Sanity] Page content unavailable; using defaults."); return null; }
});
export const getPublishedSiteSettings = cache(async () => {
  await connection(); if (!publishedClient) return null;
  try { return normalizeSiteSettings(await publishedClient.fetch<unknown>(siteSettingsQuery, {}, { perspective: "published", cache: "no-store" }), projectId, dataset); }
  catch { console.warn("[Sanity] Site settings unavailable; using defaults."); return null; }
});

export const getPublishedPricingPage = cache(async () => {
  await connection(); if (!publishedClient) return null;
  try { return normalizePricingContent(await publishedClient.fetch<unknown>(pricingPageQuery, {}, { perspective: "published", cache: "no-store" }), projectId, dataset); }
  catch { console.warn("[Sanity] Pricing content unavailable; using defaults."); return null; }
});

export const getPublishedDownloadPage = cache(async () => {
  await connection(); if (!publishedClient) return null;
  try { return normalizeDownloadContent(await publishedClient.fetch<unknown>(downloadPageQuery, {}, { perspective: "published", cache: "no-store" }), projectId, dataset); }
  catch { console.warn("[Sanity] Download content unavailable; using defaults."); return null; }
});

export const getPublishedReferralPage = cache(async () => {
  await connection(); if (!publishedClient) return null;
  try { return normalizeReferralContent(await publishedClient.fetch<unknown>(referralPageQuery, {}, { perspective: "published", cache: "no-store" }), projectId, dataset); }
  catch { console.warn("[Sanity] Referral content unavailable; using defaults."); return null; }
});
