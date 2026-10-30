import type { Locale } from "@/lib/i18n";
import { dictionaries } from "@/lib/i18n";
import { action, bilingual, image, sourceKey, localize, object, text, type Bilingual, type CmsImage } from "./cms-content";
import { normalizeWebsitePage, pageSeo, type PageModule, type WebsitePage } from "./page-cms";
import { downloadPlatforms, downloadIconPresets, installerAvailability, type DownloadPlatform, type DownloadIconPreset } from "./download-platforms";
export type ReleaseDetails = { confirmed: boolean; version?: string; packageSize?: string; releasedAt?: string; requirements: Bilingual; architecture: Bilingual };
export type PlatformCard = { sourceKey?: string; key: DownloadPlatform; name: Bilingual; description: Bilingual; buttonText: Bilingual; statusDescription: Bilingual; iconPreset: DownloadIconPreset; showIcon: boolean; iconImage?: CmsImage; image?: CmsImage; releaseDetails: ReleaseDetails };
export type InstallationStep = { sourceKey?: string; key: string; platform: DownloadPlatform | "all"; title: Bilingual; description: Bilingual; image?: CmsImage };
export type DownloadPageContent = { page: WebsitePage; download: { eyebrow: Bilingual; title: Bilingual; description: Bilingual; platforms: PlatformCard[]; labels: Record<string, Bilingual>; showInstallation: boolean; installationTitle: Bilingual; installationDescription: Bilingual; steps: InstallationStep[]; shareImages: { en?: CmsImage; zh?: CmsImage } } };
export const downloadSeo = { title: "Download Sedavel | Sedavel", description: "Find the current Sedavel download entry and availability information." };
const moduleBase = (key: string, type: PageModule["type"], displayOrder: number): PageModule => ({ key, type, displayOrder, visible: true, title: {}, description: {}, eyebrow: {}, imageSide: "right", cards: [], items: [] });
export function defaultDownloadModules(): PageModule[] {
  return [
    { ...moduleBase("download-default-faq", "faqSection", 900), title: { en: "Download questions", zh: "下载常见问题" }, items: [
      { question: { en: "Can I download Sedavel now?", zh: "现在可以下载 Sedavel 吗？" }, answer: { en: "Official installers are not available yet. This page will be updated when verified releases are ready.", zh: "官方安装包尚未开放，核实后的正式版本准备好后将更新此页面。" } },
      { question: { en: "What are the system requirements?", zh: "有哪些系统兼容要求？" }, answer: { en: "Minimum operating system versions and supported architectures are pending confirmation. No unverified compatibility is promised.", zh: "最低操作系统版本及架构支持尚待确认，暂不承诺未经核实的兼容信息。" } },
      { question: { en: "Where can I find installation guidance?", zh: "在哪里查看安装指南？" }, answer: { en: "Verified installation instructions will be added here. You can also visit the Help Center for current guidance.", zh: "核实后的安装教程将在此补充，也可前往帮助中心查看现有指南。" } },
    ] },
    { ...moduleBase("download-default-cta", "ctaBanner", 1000), title: { en: dictionaries.en.cta.title, zh: dictionaries.zh.cta.title }, description: { en: dictionaries.en.cta.subtitle, zh: dictionaries.zh.cta.subtitle }, primaryAction: action({ label: { en: dictionaries.en.cta.signup, zh: dictionaries.zh.cta.signup }, href: "/register" }), secondaryAction: action({ label: { en: "Help Center", zh: "帮助中心" }, href: "/help" }) },
  ];
}
function date(value: unknown) {
  const v = text(value, 20);
  if (v && /^\d{4}-\d{2}-\d{2}$/.test(v) && Number.isFinite(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v) return v;
}
function normalizeDetails(value: unknown): ReleaseDetails {
  const v = object(value), confirmed = v.confirmed === true;
  if (!confirmed) return { confirmed: false, requirements: {}, architecture: {} };
  return { confirmed, version: text(v.version, 80), packageSize: text(v.packageSize, 80), releasedAt: date(v.releasedAt), requirements: bilingual(v.requirements), architecture: bilingual(v.architecture) };
}
export function normalizeDownloadContent(value: unknown, project: string, dataset: string): DownloadPageContent | null {
  const s = object(value); if (s._id !== "page-download" || s.pageKey !== "download") return null;
  const page = normalizeWebsitePage(value, project, dataset); if (!page) return null;
  page.modules = page.modules.filter(m => m.type !== "featureSection");
  for (const fallback of defaultDownloadModules()) if (!page.modules.some(m => m.type === fallback.type)) page.modules.push(fallback);
  page.modules = page.modules.filter(m => m.visible).sort((a, b) => a.displayOrder - b.displayOrder);
  const d = object(s.download), labels = object(d.labels), records = new Map<DownloadPlatform, Record<string, unknown>>();
  if (Array.isArray(d.platforms)) for (const raw of d.platforms.slice(0, 10)) { const p = object(raw); if (downloadPlatforms.includes(p.platformKey as DownloadPlatform) && !records.has(p.platformKey as DownloadPlatform)) records.set(p.platformKey as DownloadPlatform, p); }
  const platforms = downloadPlatforms.map(key => {
    const p = records.get(key) || {};
    return { sourceKey: sourceKey(p._key), key, name: bilingual(p.name), description: bilingual(p.description), buttonText: bilingual(p.buttonText), statusDescription: bilingual(p.statusDescription), iconPreset: downloadIconPresets.includes(p.iconPreset as DownloadIconPreset) ? p.iconPreset as DownloadIconPreset : key === "macos" ? "laptop" as const : "windows" as const, showIcon: p.showIcon !== false, iconImage: p.showIcon !== false ? image(p.iconImage, project, dataset) : undefined, image: p.showImage !== false ? image(p.image, project, dataset) : undefined, releaseDetails: normalizeDetails(p.releaseDetails) };
  });
  const steps: InstallationStep[] = Array.isArray(d.steps) ? d.steps.slice(0, 20).flatMap((raw, index) => {
    const step = object(raw); if (step.visible === false) return [];
    return [{ sourceKey: sourceKey(step._key), key: text(step._key, 100) || `step-${index}`, platform: step.platform === "macos" || step.platform === "windows" ? step.platform : "all", title: bilingual(step.title), description: bilingual(step.description), image: step.showImage !== false ? image(step.image, project, dataset) : undefined }];
  }) : [];
  return { page, download: { eyebrow: bilingual(d.eyebrow), title: bilingual(d.title), description: bilingual(d.description), platforms, labels: Object.fromEntries(["version", "requirements", "architecture", "packageSize", "releasedAt"].map(k => [k, bilingual(labels[k])])), showInstallation: d.showInstallation !== false, installationTitle: bilingual(d.installationTitle), installationDescription: bilingual(d.installationDescription), steps, shareImages: { en: image(d.shareImageEn, project, dataset), zh: image(d.shareImageZh, project, dataset) } } };
}
export function resolveDownloadCopy(content: DownloadPageContent | null | undefined, locale: Locale) {
  const d = content?.download, zh = locale === "zh", pending = zh ? "待确认" : "Pending confirmation";
  return {
    eyebrow: localize(d?.eyebrow, locale, zh ? "下载" : "Download"), title: localize(d?.title, locale, dictionaries[locale].cta.title), description: localize(d?.description, locale, dictionaries[locale].cta.subtitle),
    platforms: downloadPlatforms.map(key => {
      const p = d?.platforms.find(p => p.key === key), name = key === "macos" ? "macOS" : "Windows", details = p?.releaseDetails;
      return { sourceKey: p?.sourceKey, key, name: localize(p?.name, locale, name), description: localize(p?.description, locale, zh ? `${name} 版本资料将在核实后公布。` : `Information about the ${name} release will appear here once verified.`), buttonText: localize(p?.buttonText, locale, zh ? `下载 ${name} 版 · 即将开放` : `Download for ${name} · Coming Soon`), statusDescription: localize(p?.statusDescription, locale, zh ? "官方安装包尚未开放，暂无可用下载地址。" : "Official installers are not available yet. No download address is configured."), availability: installerAvailability[key], showIcon: p?.showIcon !== false, iconPreset: p?.iconPreset || (key === "macos" ? "laptop" : "windows"), iconImage: p?.iconImage, image: p?.image,
        details: [
          { key: "version", label: localize(d?.labels.version, locale, zh ? "软件版本" : "Software version"), value: details?.confirmed ? details.version || pending : pending },
          { key: "requirements", label: localize(d?.labels.requirements, locale, zh ? "系统要求" : "System requirements"), value: details?.confirmed ? localize(details.requirements, locale, pending) : pending },
          { key: "architecture", label: localize(d?.labels.architecture, locale, zh ? "架构支持" : "Architecture support"), value: details?.confirmed ? localize(details.architecture, locale, pending) : pending },
          { key: "packageSize", label: localize(d?.labels.packageSize, locale, zh ? "安装包大小" : "Package size"), value: details?.confirmed ? details.packageSize || pending : pending },
          { key: "releasedAt", label: localize(d?.labels.releasedAt, locale, zh ? "正式发布时间" : "Release date"), value: details?.confirmed ? details.releasedAt || pending : pending },
        ],
      };
    }),
    showInstallation: d?.showInstallation !== false, installationTitle: localize(d?.installationTitle, locale, zh ? "安装指南" : "Installation guidance"), installationDescription: localize(d?.installationDescription, locale, zh ? "核实后的详细安装说明将在官方安装包准备好后补充。" : "Verified installation instructions will be published alongside the official installers."), steps: d?.steps || [],
  };
}
export const downloadPageSeo = (content: DownloadPageContent | null | undefined, locale: Locale) => pageSeo(content?.page, locale, downloadSeo);
export function downloadPageMetadata(content: DownloadPageContent | null | undefined, locale: Locale) {
  const asset = content?.download.shareImages[locale];
  return { ...downloadPageSeo(content, locale), ...(asset ? { openGraph: { images: [{ url: asset.url, width: asset.width, height: asset.height, alt: localize(asset.alt, locale, "Sedavel") }] } } : {}) };
}
