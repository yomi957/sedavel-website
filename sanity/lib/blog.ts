import "server-only";
import { cache } from "react";
import { connection } from "next/server";
import { cookies, draftMode } from "next/headers";
import { defineQuery } from "next-sanity";
import { resolvePerspectiveFromCookies } from "next-sanity/live";
import { normalizeBlogPosts, normalizeCategory } from "@/lib/blog-cms";
import { dataset, projectId } from "@/sanity/env";
import { publishedClient } from "./client";
import { homeLive } from "./live";
const asset = `altEn,altZh,captionEn,captionZh,ratio,style,crop,hotspot,"url":asset->url,"width":asset->metadata.dimensions.width,"height":asset->metadata.dimensions.height`;
export const blogPostsQuery = defineQuery(`*[_type == "blogPost"] | order(publishedAt desc, _id asc){_id,titleEn,titleZh,slug,summaryEn,summaryZh,coverImage{${asset}},bodyEn[]{...,_type=="contentImage"=>{${asset}}},bodyZh[]{...,_type=="contentImage"=>{${asset}}},category,categoryRef->{_id,title,displayOrder},tags,author{name,image{${asset}}},publishedAt,featured,seo,seoImage{${asset}},canonicalPath,noIndex,noFollow}`);
export const blogCategoriesQuery = defineQuery(`*[_type == "blogCategory"] | order(displayOrder asc, _id asc){_id,title,displayOrder}`);
async function fetchBlogPreview(perspective: "drafts" | "published") {
  "use cache";
  if (!homeLive) return null;
  const [posts, categories] = await Promise.all([homeLive.sanityFetch({ query: blogPostsQuery, perspective, stega: false }), homeLive.sanityFetch({ query: blogCategoriesQuery, perspective, stega: false })]);
  return { posts: posts.data, categories: categories.data };
}
export const getBlogContent = cache(async () => {
  await connection();
  const preview = (await draftMode()).isEnabled && !!homeLive;
  const normalize = (posts: unknown, categories: unknown) => ({ preview, posts: normalizeBlogPosts(posts, projectId, dataset), categories: Array.isArray(categories) ? categories.flatMap(v => { const c = normalizeCategory(v); return c ? [c] : []; }) : [] });
  if (preview) {
    const perspective = await resolvePerspectiveFromCookies({ cookies: await cookies() });
    try { const data = await fetchBlogPreview(perspective === "published" ? "published" : "drafts"); if (data) return normalize(data.posts, data.categories); }
    catch { console.warn("[Sanity] Blog preview unavailable; retaining published fallback."); }
  }
  if (!publishedClient) return normalize([], []);
  try { const [posts, categories] = await Promise.all([publishedClient.fetch(blogPostsQuery, {}, { perspective: "published", cache: "no-store" }), publishedClient.fetch(blogCategoriesQuery, {}, { perspective: "published", cache: "no-store" })]); return normalize(posts, categories); }
  catch { console.warn("[Sanity] Blog unavailable; retaining static examples."); return normalize([], []); }
});
