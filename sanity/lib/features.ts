import "server-only";

import { cache } from "react";
import { connection } from "next/server";
import { defineQuery } from "next-sanity";
import { normalizeFeatures } from "@/lib/features-cms";
import { projectId, dataset } from "@/sanity/env";
import { publishedClient } from "./client";

// Retain visibility flags on the server so hidden core records also suppress fallback cards.
export const featuresQuery = defineQuery(`*[_type == "feature"] | order(displayOrder asc, _id asc){
  _id, featureKey, nameEn, nameZh, descriptionEn, descriptionZh,
  benefitsEn, benefitsZh, displayOrder, publicationStatus, isPublic, showOnHomepage,
  "image": image{altEn, altZh, captionEn, captionZh, ratio, style, crop, hotspot, "url": asset->url,
    "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height}
}`);

export const getPublishedFeatures = cache(async () => {
  await connection();
  if (!publishedClient) return null;
  try {
    const documents = await publishedClient.fetch<unknown>(featuresQuery, {}, { perspective: "published", cache: "no-store" });
    return normalizeFeatures(documents, projectId, dataset);
  } catch {
    console.warn("[Sanity] Published features unavailable; using existing defaults.");
    return null;
  }
});
