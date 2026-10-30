import { getPublishedId, type SlugIsUniqueValidator } from "sanity";
import { apiVersion } from "@/sanity/env";

// Prevent a slug collision across content types, excluding all versions of this document.
export const isUniqueSlug: SlugIsUniqueValidator = async (slug, context) => {
  if (!slug || !context.document?._id) return true;
  return context.getClient({ apiVersion }).fetch<boolean>(
    `!defined(*[slug.current == $slug && !sanity::versionOf($published)][0]._id)`,
    { slug, published: getPublishedId(context.document._id) },
  );
};
