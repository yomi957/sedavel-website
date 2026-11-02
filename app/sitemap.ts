import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { siteConfiguration, absoluteSiteUrl, indexablePages } from "@/lib/site-url";
import { normalizeBlogPosts } from "@/lib/blog-cms";
import { editorialPost } from "@/lib/blog-indexing";
import { publishedClient } from "@/sanity/lib/client";
import { projectId, dataset } from "@/sanity/env";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const site = siteConfiguration();
  if (!site.indexable) return [];
  const pages: MetadataRoute.Sitemap = indexablePages.filter(path => path !== "/blog").map(path => ({ url: absoluteSiteUrl(path, site.origin) }));
  if (!publishedClient) return pages;
  try {
    // Never resolve Draft Mode here: even an editor receives the published sitemap.
    const raw = await publishedClient.fetch(`*[_type == "blogPost" && !(_id in path("drafts.**"))] | order(_id asc){_id,titleEn,titleZh,slug,publishedAt,noIndex}`, {}, { perspective: "published", cache: "no-store" });
    const posts = normalizeBlogPosts(raw, projectId, dataset).filter(editorialPost);
    if (posts.length) pages.push({ url: absoluteSiteUrl("/blog", site.origin) });
    for (const post of posts) pages.push({ url: absoluteSiteUrl(`/blog/${post.slug}`, site.origin) });
  } catch { console.warn('[SEO] Blog sitemap query unavailable; retaining known public pages.'); }
  return pages;
}
