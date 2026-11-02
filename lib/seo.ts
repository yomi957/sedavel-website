import "server-only";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import logo from "@/sedavel-logo.png";
import { siteConfiguration, absoluteSiteUrl, indexablePages } from "./site-url";
import { getPublishedSiteSettings } from "@/sanity/lib/public-content";
import { localize } from "./cms-content";
/** Page fields override global defaults; no client-side metadata or draft token is emitted. */
export async function pageMetadata(path: string, fields: Metadata, allowIndex?: boolean): Promise<Metadata> {
  const site = siteConfiguration(), settings = await getPublishedSiteSettings();
  const draft = (await draftMode()).isEnabled;
  const title = typeof fields.title === 'string' ? fields.title : localize(settings?.seoTitle, 'en', 'Sedavel');
  const description = fields.description || localize(settings?.seoDescription, 'en', 'Sedavel multilingual customer communication.');
  const suppliedRobots = fields.robots && typeof fields.robots === 'object' ? fields.robots : {};
  const index = site.indexable && !draft && (allowIndex ?? (indexablePages as readonly string[]).includes(path)) && suppliedRobots.index !== false;
  const canonical = absoluteSiteUrl(path, site.origin);
  const asset = settings?.seoImages.en;
  const images = asset ? [{ url: asset.url, width: asset.width, height: asset.height, alt: localize(asset.alt, 'en', 'Sedavel') }] : [{ url: absoluteSiteUrl(logo.src, site.origin), width: logo.width, height: logo.height, alt: 'Sedavel' }];
  return { ...fields, metadataBase: new URL(site.origin), title, description, alternates: { canonical }, robots: { ...suppliedRobots, index, follow: site.indexable && !draft && suppliedRobots.follow !== false }, openGraph: { type: 'website', title, description, siteName: 'Sedavel', locale: 'en_US', images, ...fields.openGraph, url: canonical } };
}
