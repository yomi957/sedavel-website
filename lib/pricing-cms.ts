import type { Dictionary, Locale } from "@/lib/i18n";
import { action, bilingual, icon, image, localize, object, text, type Bilingual, type CmsIcon, type CmsImage } from "./cms-content";
import { normalizeWebsitePage, pageSeo, type PageModule, type WebsitePage } from "./page-cms";
import { pricingCatalog, pricingBasePoints, recommendedPlan, type PricingPlanKey } from "./pricing-catalog";
export type PlanMarketing = { sourceKey?: string; description: Bilingual; benefitsEn?: string[]; benefitsZh?: string[]; buttonText: Bilingual; image?: CmsImage; icon?: CmsIcon };
export type PricingCopy = { eyebrow: Bilingual; title: Bilingual; introduction: Bilingual; benefitsEn?: string[]; benefitsZh?: string[]; featuredLabel: Bilingual; buttonText: Bilingual; cards: Partial<Record<PricingPlanKey, PlanMarketing>> };
export type PricingPageContent = { page: WebsitePage; pricing: PricingCopy };
export const pricingSeo = { title: "Pricing | Sedavel", description: "View the existing Sedavel character quota plans." };
const list = (v: unknown, max = 8) => Array.isArray(v) ? v.slice(0, max).map(x => text(x, 200)).filter((x): x is string => !!x) : undefined;
const emptyModule = (key: string, type: PageModule["type"], displayOrder: number): PageModule => ({ key, type, displayOrder, visible: true, title: {}, description: {}, eyebrow: {}, imageSide: "right", cards: [], items: [] });
export function defaultPricingModules(): PageModule[] {
  return [
    { ...emptyModule("pricing-default-faq", "faqSection", 900), title: { en: "Pricing questions", zh: "价格常见问题" }, items: [
      { question: { en: "Do I need a membership?", zh: "是否需要购买会员？" }, answer: { en: "No. Registered users can access all released features, with character packs available as needed.", zh: "无须购买会员。注册用户可使用全部已上线功能，字符额度包按需购买。" } },
      { question: { en: "Can I pay on this website now?", zh: "现在可以在官网付款吗？" }, answer: { en: "Online checkout is not connected yet. The displayed packs are reference information.", zh: "官网尚未接入在线支付，当前套餐仅作展示参考。" } },
      { question: { en: "How do I choose a pack?", zh: "如何选择字符额度包？" }, answer: { en: "Compare the displayed character quantities with your communication needs.", zh: "可根据客户沟通需求，对比页面展示的字符数量。" } },
    ] },
    { ...emptyModule("pricing-default-cta", "ctaBanner", 1000), title: { en: "Explore Sedavel before you start.", zh: "开始之前，进一步了解 Sedavel。" }, description: { en: "Explore the features and check registration availability.", zh: "了解产品功能，并查看注册入口的当前状态。" }, primaryAction: action({ label: { en: "Get Started Free", zh: "免费开始" }, href: "/register" }), secondaryAction: action({ label: { en: "Explore Features", zh: "了解功能" }, href: "/features" }) },
  ];
}
export function normalizePricingContent(raw: unknown, project: string, dataset: string): PricingPageContent | null {
  const source = object(raw);
  if (source._id !== "page-pricing" || source.pageKey !== "pricing") return null;
  const page = normalizeWebsitePage(raw, project, dataset); if (!page) return null;
  page.modules = page.modules.filter(m => m.type !== "featureSection");
  for (const fallback of defaultPricingModules()) if (!page.modules.some(m => m.type === fallback.type)) page.modules.push(fallback);
  page.modules = page.modules.filter(m => m.visible).sort((a, b) => a.displayOrder - b.displayOrder);
  const p = object(source.pricing), cards: PricingCopy["cards"] = {};
  if (Array.isArray(p.cards)) for (const raw of p.cards.slice(0, 20)) {
    const c = object(raw), key = c.planKey as PricingPlanKey;
    if (!pricingCatalog.some(plan => plan.key === key) || cards[key]) continue;
    cards[key] = { sourceKey: typeof c._key === "string" && /^[a-zA-Z0-9_-]+$/.test(c._key) ? c._key : undefined, description: bilingual(c.description), benefitsEn: list(c.benefitsEn, 6), benefitsZh: list(c.benefitsZh, 6), buttonText: bilingual(c.buttonText), image: image(c.image, project, dataset), icon: c.icon && typeof c.icon === "object" ? icon(c.icon, project, dataset) : undefined };
  }
  return { page, pricing: { eyebrow: bilingual(p.eyebrow), title: bilingual(p.title), introduction: bilingual(p.introduction), benefitsEn: list(p.benefitsEn), benefitsZh: list(p.benefitsZh), featuredLabel: bilingual(p.featuredLabel), buttonText: bilingual(p.buttonText), cards } };
}
/** CMS marketing fields are copied explicitly; all financial display values come from the approved catalog. */
export function resolvePricingCopy(content: PricingCopy | null | undefined, locale: Locale, defaults: Dictionary["pricing"]) {
  return { ...defaults, eyebrow: localize(content?.eyebrow, locale, defaults.eyebrow), title: localize(content?.title, locale, defaults.title), subtitle: localize(content?.introduction, locale, defaults.subtitle), featured: localize(content?.featuredLabel, locale, defaults.featured), benefits: (locale === "zh" ? content?.benefitsZh : content?.benefitsEn) || [], plans: pricingCatalog.map(plan => {
    const c = content?.cards[plan.key];
    return { key: plan.key, name: plan.name, price: plan.price, quota: plan.quota, description: localize(c?.description, locale, plan.description[locale]), points: (locale === "zh" ? c?.benefitsZh : c?.benefitsEn) ?? pricingBasePoints[locale], buttonText: localize(c?.buttonText, locale, localize(content?.buttonText, locale, defaults.cta)), featured: plan.key === recommendedPlan, image: c?.image, icon: c?.icon };
  }) };
}
export const pricingPageSeo = (content: PricingPageContent | null | undefined, locale: Locale) => pageSeo(content?.page, locale, pricingSeo);
