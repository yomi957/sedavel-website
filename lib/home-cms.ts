import { homeContent } from "@/lib/home-content";
import type { Locale } from "@/lib/i18n";

export type HomePageCmsContent = {
  heroTitleEn?: string;
  heroTitleZh?: string;
  heroDescriptionEn?: string;
  heroDescriptionZh?: string;
  heroImage?: {
    url: string;
    width: number;
    height: number;
    altEn?: string;
    altZh?: string;
  };
  seo?: { titleEn?: string; titleZh?: string; descriptionEn?: string; descriptionZh?: string };
};

export const homeDefaultSeo = {
  title: "Sedavel — One Workspace. Every Conversation.",
  description: "Sedavel is a multilingual communication and customer management platform for cross-border e-commerce, international trade and global teams.",
};

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}
function text(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

// Do not let incomplete CMS data or an arbitrary image hostname break the public page.
export function normalizeHomeContent(value: unknown, projectId: string, dataset: string): HomePageCmsContent | null {
  const source = record(value);
  if (Object.keys(source).length === 0) return null;
  const result: HomePageCmsContent = {};
  for (const key of ["heroTitleEn", "heroTitleZh", "heroDescriptionEn", "heroDescriptionZh"] as const) {
    const field = text(source[key]);
    if (field) result[key] = field;
  }
  const seo = record(source.seo);
  const seoResult: NonNullable<HomePageCmsContent["seo"]> = {};
  for (const key of ["titleEn", "titleZh", "descriptionEn", "descriptionZh"] as const) {
    const field = text(seo[key]);
    if (field) seoResult[key] = field;
  }
  if (Object.keys(seoResult).length) result.seo = seoResult;
  const image = record(source.heroImage);
  const url = text(image.url);
  if (url) {
    try {
      const parsed = new URL(url);
      if (parsed.protocol === "https:" && parsed.hostname === "cdn.sanity.io" && !parsed.username && !parsed.password && !parsed.port && parsed.pathname.startsWith(`/images/${projectId}/${dataset}/`) &&
        typeof image.width === "number" && Number.isInteger(image.width) && image.width > 0 &&
        typeof image.height === "number" && Number.isInteger(image.height) && image.height > 0) {
        result.heroImage = { url, width: Math.round(image.width), height: Math.round(image.height) };
        const altEn = text(image.altEn);
        const altZh = text(image.altZh);
        if (altEn) result.heroImage.altEn = altEn;
        if (altZh) result.heroImage.altZh = altZh;
      }
    } catch { /* An invalid asset keeps the existing placeholder. */ }
  }
  return Object.keys(result).length ? result : null;
}

export function resolveHomeHero(locale: Locale, content?: HomePageCmsContent | null) {
  const defaults = homeContent[locale];
  const title = locale === "zh" ? content?.heroTitleZh : content?.heroTitleEn;
  const description = locale === "zh" ? content?.heroDescriptionZh : content?.heroDescriptionEn;
  return {
    titleLines: text(title)?.split(/\r?\n/) ?? defaults.heroTitle,
    description: text(description) ?? defaults.heroBody,
    image: content?.heroImage ? {
      ...content.heroImage,
      alt: text(locale === "zh" ? content.heroImage.altZh : content.heroImage.altEn) ?? (locale === "zh" ? "Sedavel 产品工作区截图" : "Sedavel product workspace screenshot"),
    } : null,
  };
}

export function resolveHomeSeo(locale: Locale, content?: HomePageCmsContent | null, defaults = homeDefaultSeo) {
  const title = locale === "zh" ? content?.seo?.titleZh : content?.seo?.titleEn;
  const description = locale === "zh" ? content?.seo?.descriptionZh : content?.seo?.descriptionEn;
  return {
    title: text(title) ?? defaults.title,
    description: text(description) ?? defaults.description,
  };
}
