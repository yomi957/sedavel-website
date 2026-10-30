import "server-only";

import { cache } from "react";
import { connection } from "next/server";
import { defineQuery } from "next-sanity";
import { normalizeHomeContent } from "@/lib/home-cms";
import { dataset, projectId } from "@/sanity/env";
import { publishedClient } from "./client";

export const homePageQuery = defineQuery(`
  *[_type == "homePage" && _id == "homePage"][0]{
    heroTitleEn, heroTitleZh, heroDescriptionEn, heroDescriptionZh,
    "heroImage": heroImage{
      altEn, altZh,
      "url": asset->url,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height
    },
    seo{titleEn, titleZh, descriptionEn, descriptionZh}
  }
`);

// React cache deduplicates metadata + page reads only within the same request.
// There is no cross-request cache, revalidation interval or CDN delay.
export const getPublishedHomePage = cache(async () => {
  // With Cache Components, keep fresh CMS reads out of the pre-rendered shell.
  await connection();
  if (!publishedClient) return null;
  try {
    const document = await publishedClient.fetch<unknown>(homePageQuery, {}, {
      perspective: "published",
      cache: "no-store",
    });
    return normalizeHomeContent(document, projectId, dataset);
  } catch {
    // Do not log request objects or errors that could include a private read token.
    console.warn("[Sanity] Published homepage unavailable; using existing defaults.");
    return null;
  }
});
