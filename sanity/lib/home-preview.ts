import "server-only";
import { cache } from "react";
import { cookies, draftMode } from "next/headers";
import { resolvePerspectiveFromCookies } from "next-sanity/live";
import { normalizeHomeContent } from "@/lib/home-cms";
import { dataset, projectId } from "@/sanity/env";
import { homePageQuery } from "./home-page";
import { homeLive } from "./live";

// Cache Components requires the official Live query inside a cache boundary.
// Next bypasses that cache during an authenticated Draft Mode request.
async function fetchHomePreview(perspective: "drafts" | "published") {
  "use cache";
  if (!homeLive) return null;
  const { data } = await homeLive.sanityFetch({ query: homePageQuery, perspective, stega: false });
  return normalizeHomeContent(data, projectId, dataset);
}
export const getHomePreview = cache(async () => {
  if (!(await draftMode()).isEnabled || !homeLive) return null;
  const perspective = await resolvePerspectiveFromCookies({ cookies: await cookies() });
  try { return await fetchHomePreview(perspective === "published" ? "published" : "drafts"); }
  catch { console.warn("[Sanity] Hero preview unavailable; keeping published fallback."); return null; }
});
