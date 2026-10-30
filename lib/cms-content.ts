import type { Locale } from "@/lib/i18n";

export type Bilingual = { en?: string; zh?: string };
export const object = (v: unknown): Record<string, unknown> => v && typeof v === "object" && !Array.isArray(v) ? v as Record<string, unknown> : {};
export const text = (v: unknown, max = 2000): string | undefined => typeof v === "string" && v.trim() ? v.trim().slice(0, max) : undefined;
export const bilingual = (v: unknown): Bilingual => ({ en: text(object(v).en), zh: text(object(v).zh) });
export const localize = (v: Bilingual | undefined, locale: Locale, fallback = "") => v?.[locale] || fallback;
const socialHosts = new Set(["linkedin.com", "www.linkedin.com", "x.com", "twitter.com", "facebook.com", "www.facebook.com", "instagram.com", "www.instagram.com", "youtube.com", "www.youtube.com", "github.com", "www.github.com"]);
const internal = /^(?:\/(?:features|pricing|download|referral|help|blog|contact|register|privacy|terms|solutions)?|\/blog\/[a-z0-9]+(?:-[a-z0-9]+)*)(?:#[a-zA-Z0-9_-]+)?$/;
export function safeHref(v: unknown, external = false): string | undefined {
  const value = text(v, 1000);
  if (!value || /[\s\\<>%]/.test(value)) return;
  if (internal.test(value)) return value;
  if (!external) return;
  if (/^mailto:[A-Z0-9._+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) && !value.includes("?")) return value;
  try { const u = new URL(value); if (u.protocol === "https:" && !u.username && !u.password && !u.port && socialHosts.has(u.hostname) && !u.search) return u.href; } catch { /* reject */ }
}
export type CmsAction = { label: Bilingual; href: string };
export function action(v: unknown): CmsAction | undefined {
  const s = object(v), href = safeHref(s.href);
  if (href && (text(object(s.label).en) || text(object(s.label).zh))) return { href, label: bilingual(s.label) };
}
export type CmsImage = { url: string; width: number; height: number; alt: Bilingual; caption: Bilingual; ratio: "original" | "wide" | "square"; style: "plain" | "rounded" | "framed"; position: string };
export function image(v: unknown, project: string, dataset: string): CmsImage | undefined {
  const s = object(v); if (typeof s.url !== "string" || !Number.isInteger(s.width) || !Number.isInteger(s.height) || Number(s.width) <= 0 || Number(s.height) <= 0) return;
  try {
    const url = new URL(s.url);
    if (url.protocol !== "https:" || url.hostname !== "cdn.sanity.io" || url.username || url.password || url.port || url.search || url.hash || !url.pathname.startsWith(`/images/${project}/${dataset}/`) || !/\.(png|jpe?g|webp|avif)$/i.test(url.pathname)) return;
    let width = Number(s.width), height = Number(s.height);
    const crop = object(s.crop), valid = (n: unknown) => typeof n === "number" && Number.isFinite(n) && n >= 0 && n <= 1;
    const c = [crop.left, crop.top, crop.right, crop.bottom];
    if (c.every(valid) && Number(crop.left) + Number(crop.right) < 1 && Number(crop.top) + Number(crop.bottom) < 1) {
      const x = Math.round(width * Number(crop.left)), y = Math.round(height * Number(crop.top));
      width = Math.max(1, Math.min(width - x, Math.round(width * (1 - Number(crop.left) - Number(crop.right)))));
      height = Math.max(1, Math.min(height - y, Math.round(height * (1 - Number(crop.top) - Number(crop.bottom)))));
      url.searchParams.set("rect", `${x},${y},${width},${height}`);
    }
    const hotspot = object(s.hotspot);
    const pos = (n: unknown, start: unknown, end: unknown) => {
      if (!valid(n)) return 50;
      const a = c.every(valid) ? Number(start) : 0, b = c.every(valid) ? Number(end) : 0;
      return Math.max(0, Math.min(100, (Number(n) - a) / Math.max(.01, 1 - a - b) * 100));
    };
    return { url: url.href, width, height, alt: { en: text(s.altEn, 250), zh: text(s.altZh, 250) }, caption: { en: text(s.captionEn, 300), zh: text(s.captionZh, 300) }, ratio: s.ratio === "wide" || s.ratio === "square" ? s.ratio : "original", style: s.style === "plain" || s.style === "framed" ? s.style : "rounded", position: `${pos(hotspot.x, crop.left, crop.right)}% ${pos(hotspot.y, crop.top, crop.bottom)}%` };
  } catch { return; }
}
export const iconNames = ["translation", "accounts", "customers", "sparkles", "check", "globe"] as const;
export type CmsIcon = { name: typeof iconNames[number]; image?: CmsImage };
export function icon(v: unknown, project: string, dataset: string): CmsIcon {
  const s = object(v); return { name: iconNames.includes(s.name as typeof iconNames[number]) ? s.name as typeof iconNames[number] : "check", image: image(s.image, project, dataset) };
}

/** Stable Sanity array keys only; never synthesize editable paths for filtered rows. */
export const sourceKey = (v: unknown): string | undefined => typeof v === "string" && /^[a-zA-Z0-9_-]+$/.test(v) ? v : undefined;
