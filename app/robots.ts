import type { MetadataRoute } from "next";
import { siteConfiguration, absoluteSiteUrl } from "@/lib/site-url";
export default function robots(): MetadataRoute.Robots {
  const site = siteConfiguration();
  return site.indexable ? { rules: { userAgent: "*", allow: "/", disallow: ["/studio", "/api/", "/*?*previewLocale=", "/*?*sanity-preview-"] }, sitemap: absoluteSiteUrl('/sitemap.xml', site.origin) } : { rules: { userAgent: "*", disallow: "/" } };
}
