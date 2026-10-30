import "server-only";
import { cache } from "react";
import { cookies, draftMode } from "next/headers";
import { connection } from "next/server";
import { resolvePerspectiveFromCookies } from "next-sanity/live";
import { normalizeWebsitePage } from "@/lib/page-cms";
import { normalizePricingContent } from "@/lib/pricing-cms";
import { normalizeDownloadContent } from "@/lib/download-cms";
import { normalizeReferralContent } from "@/lib/referral-cms";
import { normalizeSiteSettings } from "@/lib/site-settings-cms";
import { normalizeFeatures } from "@/lib/features-cms";
import { dataset, projectId } from "@/sanity/env";
import { homeLive } from "./live";
import { featuresQuery } from "./features";
import { websitePageQuery, pricingPageQuery, downloadPageQuery, referralPageQuery, siteSettingsQuery } from "./public-content";

const queries = { featuresPage: websitePageQuery, features: featuresQuery, pricingPage: pricingPageQuery, downloadPage: downloadPageQuery, referralPage: referralPageQuery, siteSettings: siteSettingsQuery };
async function fetchPreview(kind: keyof typeof queries, perspective: "drafts" | "published") {
  "use cache";
  if (!homeLive) return null;
  return (await homeLive.sanityFetch({ query: queries[kind], perspective, stega: false })).data;
}
async function authorizedPerspective() {
  if (!(await draftMode()).isEnabled || !homeLive) return null;
  // Authenticated drafts are request-only, not speculative route prerenders.
  await connection();
  const perspective = await resolvePerspectiveFromCookies({ cookies: await cookies() });
  return perspective === "published" ? "published" as const : "drafts" as const;
}
export const getFeaturesPreview = cache(async () => {
  const perspective = await authorizedPerspective(); if (!perspective) return null;
  try {
    const [page, features] = await Promise.all([fetchPreview("featuresPage", perspective), fetchPreview("features", perspective)]);
    const content = normalizeWebsitePage(page, projectId, dataset);
    return { content: content ? { ...content, modules: content.modules.filter(m => m.visible) } : null, records: normalizeFeatures(features, projectId, dataset) };
  } catch { console.warn("[Sanity] Features preview unavailable; retaining published fallback."); return null; }
});
export const getPricingPreview = cache(async () => {
  const perspective = await authorizedPerspective(); if (!perspective) return null;
  try { return { content: normalizePricingContent(await fetchPreview("pricingPage", perspective), projectId, dataset) }; }
  catch { console.warn("[Sanity] Pricing preview unavailable; retaining published fallback."); return null; }
});

export const getDownloadPreview = cache(async () => {
  const perspective = await authorizedPerspective(); if (!perspective) return null;
  try { return { content: normalizeDownloadContent(await fetchPreview("downloadPage", perspective), projectId, dataset) }; }
  catch { console.warn("[Sanity] Download preview unavailable; retaining published fallback."); return null; }
});
export const getReferralPreview = cache(async () => {
  const perspective = await authorizedPerspective(); if (!perspective) return null;
  try { return { content: normalizeReferralContent(await fetchPreview("referralPage", perspective), projectId, dataset) }; }
  catch { console.warn("[Sanity] Referral preview unavailable; retaining published fallback."); return null; }
});
export const getSiteSettingsPreview = cache(async () => {
  const perspective = await authorizedPerspective(); if (!perspective) return null;
  try { return { content: normalizeSiteSettings(await fetchPreview("siteSettings", perspective), projectId, dataset) }; }
  catch { console.warn("[Sanity] Settings preview unavailable; retaining published fallback."); return null; }
});
