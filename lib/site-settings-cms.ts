import type { Locale } from "@/lib/i18n";
import { bilingual, image, localize, object, safeHref, sourceKey, text, type Bilingual, type CmsImage } from "./cms-content";
import { footerPages, publicNavigation, type FooterPageKey, type NavigationKey } from "./site-navigation";
export type NavigationItem = { sourceKey?: string; key: NavigationKey; href: string; label: Bilingual; visible: boolean; displayOrder: number };
export type FooterLink = { sourceKey?: string; page: FooterPageKey; href: string; label: Bilingual; showLegalNotice: boolean };
export type FooterGroup = { sourceKey?: string; key: string; title: Bilingual; links: FooterLink[] };
export type SiteSettings = {
  websiteName?: string; websiteNameLocalized: Bilingual; logo?: CmsImage; favicon?: CmsImage; defaultLanguage?: Locale;
  navigation: Record<string, Bilingual>; navigationItems: NavigationItem[];
  languageLabels: { english: Bilingual; chinese: Bilingual; label: Bilingual };
  footer: Record<string, Bilingual>; footerGroups?: FooterGroup[]; footerCopyright: Bilingual;
  globalCtaText: Bilingual; contactInformation: Bilingual; contactEmail?: string;
  socialLinks: { sourceKey?: string; label: Bilingual; url: string }[]; seoTitle: Bilingual; seoDescription: Bilingual;
  seoImages: { en?: CmsImage; zh?: CmsImage };
};
export function normalizeSiteSettings(value: unknown, project: string, dataset: string): SiteSettings | null {
  const s = object(value); if (!Object.keys(s).length || typeof s._id === "string" && /^(drafts|versions)\./.test(s._id)) return null;
  const navigation: Record<string, Bilingual> = {}, overrides = new Map<string, Record<string, unknown>>(), footer = object(s.footerContent);
  if (Array.isArray(s.navigationItems)) for (const raw of s.navigationItems.slice(0, 32)) {
    const n = object(raw);
    if (typeof n.key === "string" && publicNavigation.some(p => p.key === n.key) && !overrides.has(n.key)) { overrides.set(n.key, n); navigation[n.key] = bilingual(n.label); }
  }
  const navigationItems = publicNavigation.map((page, index) => {
    const item = overrides.get(page.key) || {};
    return { ...page, sourceKey: sourceKey(item._key), label: bilingual(item.label), visible: item.visible !== false, displayOrder: typeof item.displayOrder === "number" && Number.isFinite(item.displayOrder) && item.displayOrder >= 0 ? item.displayOrder : index * 10 };
  }).sort((a, b) => a.displayOrder - b.displayOrder);
  let footerGroups: FooterGroup[] | undefined;
  if (Array.isArray(s.footerGroups) && s.footerGroups.length) {
    const groups = s.footerGroups.slice(0, 2).flatMap((raw, index) => {
      const g = object(raw);
      if (g.visible === false) return [{ hidden: true, sourceKey: undefined, key: String(index), title: {}, links: [] }];
      const title = bilingual(g.title), seen = new Set<string>();
      const links: FooterLink[] = Array.isArray(g.links) ? g.links.slice(0, 16).flatMap(rawLink => {
        const l = object(rawLink), page = footerPages.find(p => p.key === l.page);
        if (!page || l.visible === false || seen.has(page.key)) return [];
        seen.add(page.key);
        return [{ sourceKey: sourceKey(l._key), page: page.key, href: page.href, label: bilingual(l.label), showLegalNotice: l.showLegalNotice !== false && (page.key === "privacy" || page.key === "terms") }];
      }) : [];
      return title.en || title.zh || links.length ? [{ hidden: false, sourceKey: sourceKey(g._key), key: text(g._key, 100) || `group-${index}`, title, links }] : [];
    });
    if (groups.length) footerGroups = groups.filter(g => !g.hidden).map(({ sourceKey, key, title, links }) => ({ sourceKey, key, title, links }));
  }
  const languageLabels = object(s.languageLabels);
  return {
    websiteName: text(s.websiteName, 100), websiteNameLocalized: bilingual(s.websiteNameLocalized),
    logo: image(s.logo, project, dataset), favicon: image(s.favicon, project, dataset),
    defaultLanguage: s.defaultLanguage === "zh" || s.defaultLanguage === "en" ? s.defaultLanguage : undefined,
    navigation, navigationItems, languageLabels: { english: bilingual(languageLabels.english), chinese: bilingual(languageLabels.chinese), label: bilingual(languageLabels.label) },
    footer: Object.fromEntries(["blurb", "product", "company", "contact", "privacy", "terms", "placeholderLegal", "rights"].map(k => [k, bilingual(footer[k])])), footerGroups, footerCopyright: bilingual(s.footerCopyright),
    globalCtaText: bilingual(s.globalCtaText), contactInformation: bilingual(s.contactInformation),
    contactEmail: typeof s.contactEmail === "string" && /^[A-Z0-9._+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(s.contactEmail) ? s.contactEmail : undefined,
    socialLinks: Array.isArray(s.socialLinks) ? s.socialLinks.slice(0, 12).flatMap(raw => { const l = object(raw), url = safeHref(l.url, true); return l.visible !== false && url?.startsWith("https:") ? [{ sourceKey: sourceKey(l._key), url, label: bilingual(l.label) }] : []; }) : [],
    seoTitle: bilingual(s.seoDefaultTitle), seoDescription: bilingual(s.seoDefaultDescription),
    seoImages: { en: image(s.seoDefaultImageEn, project, dataset), zh: image(s.seoDefaultImageZh, project, dataset) },
  };
}
export function resolveNavigation(settings?: SiteSettings | null): NavigationItem[] {
  return (settings?.navigationItems || publicNavigation.map((p, i) => ({ ...p, label: {}, visible: true, displayOrder: i * 10 }))).filter(p => p.visible);
}
export const websiteName = (settings: SiteSettings | null | undefined, locale: Locale) => localize(settings?.websiteNameLocalized, locale, settings?.websiteName || "Sedavel");
export function resolveDefaultSeo(settings: SiteSettings | null | undefined, locale: Locale, fallback: { title: string; description: string }) {
  return { title: localize(settings?.seoTitle, locale, fallback.title), description: localize(settings?.seoDescription, locale, fallback.description) };
}
export function defaultOpenGraph(settings: SiteSettings | null | undefined, locale: Locale) {
  const asset = settings?.seoImages[locale];
  return asset ? { images: [{ url: asset.url, width: asset.width, height: asset.height, alt: localize(asset.alt, locale, websiteName(settings, locale)) }] } : undefined;
}

export function navigationLabelPath(settings: SiteSettings | null | undefined, key: string, locale: Locale) {
  const item = settings?.navigationItems.find(n => n.key === key);
  return item?.sourceKey && item.label[locale] ? `navigationItems[_key==${JSON.stringify(item.sourceKey)}].label.${locale}` : undefined;
}
