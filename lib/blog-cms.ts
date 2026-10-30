import type { Metadata } from "next";
import type { Locale } from "./i18n";
import { bilingual, image, object, sourceKey, text, type Bilingual, type CmsImage } from "./cms-content";
export type BlogSpan = { key: string; text: string; marks: string[] };
export type BlogBlock = { key: string; type: "text" | "image"; style: string; list?: "bullet" | "number"; level: number; spans: BlogSpan[]; links: Record<string, string>; image?: CmsImage };
export type BlogCategory = { id: string; title: Bilingual; order: number };
export type BlogPost = { id: string; slug: string; title: Bilingual; summary: Bilingual; body: { en: BlogBlock[]; zh: BlogBlock[] }; cover?: CmsImage; category?: BlogCategory; legacyCategory?: string; tags: Bilingual[]; author: Bilingual; authorImage?: CmsImage; date?: string; featured: boolean; seo: { title: Bilingual; description: Bilingual; image?: CmsImage; canonical?: string; noIndex: boolean; noFollow: boolean } };
export const validBlogSlug = (v: unknown): v is string => typeof v === "string" && v.length <= 96 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v);
export function blogLink(value: unknown): string | undefined {
  const v = text(value, 2000); if (!v || /[\s\\<>\u0000-\u001f]/.test(v)) return;
  if (/^\/(?!\/)[a-zA-Z0-9/_#-]*$/.test(v)) return v;
  if (/^mailto:[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v)) return v;
  try { const u = new URL(v); if (u.protocol === "https:" && !u.username && !u.password) return u.href; } catch { /* reject unsafe protocols */ }
}
export function normalizeBody(value: unknown, project: string, dataset: string): BlogBlock[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((v): BlogBlock[] => {
    const b = object(v), key = sourceKey(b._key); if (!key) return [];
    if (b._type === "contentImage") { const asset = image(b, project, dataset); return asset ? [{ key, type: "image", image: asset, spans: [], links: {}, style: "normal", level: 1 }] : []; }
    if (b._type !== "block") return [];
    const links: Record<string, string> = {};
    if (Array.isArray(b.markDefs)) for (const raw of b.markDefs) { const m = object(raw), k = sourceKey(m._key), href = m._type === "link" ? blogLink(m.href) : undefined; if (k && href) Object.defineProperty(links, k, { value: href, enumerable: true }); }
    const spans = Array.isArray(b.children) ? b.children.flatMap((v): BlogSpan[] => { const c = object(v), k = sourceKey(c._key); return c._type === "span" && k && typeof c.text === "string" ? [{ key: k, text: c.text.slice(0, 100000), marks: Array.isArray(c.marks) ? c.marks.filter((m): m is string => typeof m === "string" && (["strong", "em"].includes(m) || Object.hasOwn(links, m))) : [] }] : []; }) : [];
    return [{ key, type: "text", style: ["h2", "h3", "blockquote"].includes(String(b.style)) ? String(b.style) : "normal", list: b.listItem === "number" || b.listItem === "bullet" ? b.listItem : undefined, level: typeof b.level === "number" ? Math.max(1, Math.min(6, Math.floor(b.level))) : 1, spans, links }];
  });
}
export function normalizeCategory(v: unknown): BlogCategory | undefined { const s = object(v); return typeof s._id === "string" && !s._id.startsWith("drafts.") ? { id: s._id, title: bilingual(s.title), order: typeof s.displayOrder === "number" ? s.displayOrder : 0 } : undefined; }
export function normalizeBlogPosts(value: unknown, project: string, dataset: string): BlogPost[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value.flatMap((v): BlogPost[] => {
    const s = object(v), slug = object(s.slug).current; if (typeof s._id !== "string" || s._id.startsWith("drafts.") || !validBlogSlug(slug) || seen.has(slug)) return [];
    seen.add(slug); const seo = object(s.seo), author = object(s.author); const date = typeof s.publishedAt === "string" && !Number.isNaN(Date.parse(s.publishedAt)) ? s.publishedAt : undefined;
    return [{ id: s._id, slug, title: { en: text(s.titleEn), zh: text(s.titleZh) }, summary: { en: text(s.summaryEn), zh: text(s.summaryZh) }, body: { en: normalizeBody(s.bodyEn, project, dataset), zh: normalizeBody(s.bodyZh, project, dataset) }, cover: image(s.coverImage, project, dataset), category: normalizeCategory(s.categoryRef), legacyCategory: text(s.category, 100), tags: Array.isArray(s.tags) ? s.tags.map(bilingual) : [], author: bilingual(author.name), authorImage: image(author.image, project, dataset), date, featured: s.featured === true, seo: { title: { en: text(seo.titleEn), zh: text(seo.titleZh) }, description: { en: text(seo.descriptionEn), zh: text(seo.descriptionZh) }, image: image(s.seoImage, project, dataset), canonical: typeof s.canonicalPath === "string" && /^\/blog\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s.canonicalPath) ? s.canonicalPath : undefined, noIndex: s.noIndex === true, noFollow: s.noFollow === true } }];
  });
}
export function blogPostMetadata(post: BlogPost, locale: Locale, preview = false): Metadata {
  const title = post.seo.title[locale] || post.title[locale] || "Sedavel Blog", description = post.seo.description[locale] || post.summary[locale] || "Sedavel Blog"; const asset = post.seo.image || post.cover;
  return { title, description, alternates: { canonical: post.seo.canonical || `/blog/${post.slug}` }, robots: { index: !preview && !post.seo.noIndex, follow: !preview && !post.seo.noFollow }, openGraph: { type: "article", title, description, publishedTime: post.date, ...(asset ? { images: [{ url: asset.url, width: asset.width, height: asset.height, alt: asset.alt[locale] || title }] } : {}) } };
}
