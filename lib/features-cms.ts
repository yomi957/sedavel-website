import { image as normalizeImage, type CmsImage } from "@/lib/cms-content";
import { homeContent } from "@/lib/home-content";
import { normalizeHomeContent, type HomePageCmsContent } from "@/lib/home-cms";
import type { Locale } from "@/lib/i18n";

export const featureKeys = ["translation", "messaging", "customers", "ai"] as const;
export type FeatureKey = typeof featureKeys[number];
export type FeatureStatus = "available" | "comingSoon" | "inDevelopment" | "planned" | "unconfirmed" | "archived";
export type FeatureRecord = {
  id: string; key?: FeatureKey; nameEn?: string; nameZh?: string;
  descriptionEn?: string; descriptionZh?: string; benefitsEn?: string[]; benefitsZh?: string[];
  image?: HomePageCmsContent["heroImage"]; media?: CmsImage; order: number; status: FeatureStatus;
  isPublic: boolean; showOnHomepage: boolean; isFallback?: boolean;
};
function obj(value: unknown): Record<string, unknown> { return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {}; }
function str(value: unknown) { return typeof value === "string" && value.trim() ? value.trim() : undefined; }
function benefits(value: unknown) { return Array.isArray(value) ? value.map(str).filter((v): v is string => Boolean(v)) : undefined; }
function inferKey(name?: string): FeatureKey | undefined {
  const value = name?.toLowerCase().trim();
  if (["smart multilingual translation", "real-time translation", "智能多语言翻译", "实时翻译"].includes(value ?? "")) return "translation";
  if (["unified messaging", "multi-account management", "多渠道消息聚合", "多账号管理"].includes(value ?? "")) return "messaging";
  if (["customer management", "客户信息与跟进管理", "客户管理"].includes(value ?? "")) return "customers";
  if (["ai copilot", "ai 助手", "ai 助手 copilot"].includes(value ?? "")) return "ai";
}

export function normalizeFeatures(value: unknown, projectId: string, dataset: string): FeatureRecord[] | null {
  if (!Array.isArray(value)) return null;
  return value.flatMap(raw => {
    const v = obj(raw); const id = str(v._id);
    if (!id || id.startsWith("drafts.") || id.startsWith("versions.")) return [];
    const nameEn = str(v.nameEn); const nameZh = str(v.nameZh);
    const key = featureKeys.includes(v.featureKey as FeatureKey) ? v.featureKey as FeatureKey : inferKey(nameEn) ?? inferKey(nameZh);
    if (!nameEn && !nameZh && !key) return [];
    const knownStatuses = ["available", "comingSoon", "inDevelopment", "planned", "archived"];
    let status = knownStatuses.includes(String(v.publicationStatus)) ? v.publicationStatus as FeatureStatus : "unconfirmed";
    // AI Copilot is not released. Publishing a document must not imply availability.
    if (key === "ai" && status === "available") status = "comingSoon";
    return [{ id, key, nameEn, nameZh, descriptionEn: str(v.descriptionEn), descriptionZh: str(v.descriptionZh), benefitsEn: benefits(v.benefitsEn), benefitsZh: benefits(v.benefitsZh), image: normalizeHomeContent({ heroImage: v.image }, projectId, dataset)?.heroImage, media: normalizeImage(v.image, projectId, dataset), order: typeof v.displayOrder === "number" && Number.isFinite(v.displayOrder) ? v.displayOrder : 1000, status, isPublic: v.isPublic !== false, showOnHomepage: v.showOnHomepage !== false }];
  });
}

export function defaultFeatures(): FeatureRecord[] {
  const statuses: FeatureStatus[] = ["available", "unconfirmed", "planned", "comingSoon"];
  return featureKeys.map((key, i) => ({ id: `default-${key}`, key, order: i, status: statuses[i], isPublic: true, showOnHomepage: true, isFallback: true }));
}

// Merge on the server: private/hidden records never reach the browser, and an
// explicit hide suppresses its static counterpart instead of resurrecting it.
export function selectFeatures(records: FeatureRecord[] | null, scope: "home" | "features"): FeatureRecord[] {
  if (!records?.length) return defaultFeatures();
  const sorted = [...records].sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
  const keys = new Set<FeatureKey>();
  const result: FeatureRecord[] = [];
  for (const record of sorted) {
    if (record.key && keys.has(record.key)) continue;
    if (record.key) keys.add(record.key);
    if (!record.isPublic || record.status === "archived" || (scope === "home" && !record.showOnHomepage)) continue;
    result.push(record);
  }
  for (const fallback of defaultFeatures()) if (!keys.has(fallback.key!)) result.push(fallback);
  return result.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
}

export function localizeFeature(record: FeatureRecord, locale: Locale) {
  const index = record.key ? featureKeys.indexOf(record.key) : -1;
  const defaults = index >= 0 ? homeContent[locale].features[index] : undefined;
  const statusLabels: Record<FeatureStatus, { en: string; zh: string }> = {
    available: { en: "Available", zh: "已上线" }, comingSoon: { en: "Coming Soon", zh: "即将推出" },
    inDevelopment: { en: "In Development", zh: "开发中" }, planned: { en: "Planned · Pending confirmation", zh: "规划中 · 待确认" },
    unconfirmed: { en: "Availability pending confirmation", zh: "上线状态待确认" }, archived: { en: "Archived", zh: "已归档" },
  };
  const title = (locale === "zh" ? record.nameZh : record.nameEn) ?? defaults?.title ?? (locale === "zh" ? "产品功能" : "Product Feature");
  const points = locale === "zh" ? record.benefitsZh : record.benefitsEn;
  return {
    id: record.id, key: record.key, title,
    body: (locale === "zh" ? record.descriptionZh : record.descriptionEn) ?? defaults?.body ?? (locale === "zh" ? "功能介绍正在整理中。" : "Feature description is being prepared."),
    points: points?.length ? points : record.isFallback ? defaults?.points ?? [] : [],
    status: statusLabels[record.status][locale],
    image: record.image ? { ...record.image, alt: (locale === "zh" ? record.image.altZh : record.image.altEn) ?? title } : null,
    media: record.media,
    imageLabel: locale === "zh" ? `等待${title}真实截图` : `${title} screenshot pending`,
  };
}
