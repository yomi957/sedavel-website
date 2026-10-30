/** Approved public display baseline only. Not a payment, billing or quota-granting engine. */
export const pricingCatalog = [
  { key: "free", name: "Free", quota: "50,000", price: "$0", description: { en: "Get familiar with Sedavel's released features.", zh: "了解和体验 Sedavel 已上线的功能。" } },
  { key: "starter", name: "Starter", quota: "300,000", price: "$11.90", description: { en: "For everyday customer conversations.", zh: "适合日常客户沟通。" } },
  { key: "standard", name: "Standard", quota: "1,500,000", price: "$54.90", description: { en: "For growing conversation volumes.", zh: "适合沟通量持续增长的业务。" } },
  { key: "pro", name: "Pro", quota: "5,000,000", price: "$169.00", description: { en: "For higher-volume customer communication.", zh: "适合更高频的客户沟通。" } },
  { key: "business", name: "Business", quota: "15,000,000", price: "$459.00", description: { en: "A larger pack for greater communication needs.", zh: "适合更大规模沟通需求的字符额度包。" } },
] as const;
export type PricingPlanKey = typeof pricingCatalog[number]["key"];
export const pricingBasePoints = { en: ["All released features", "Multi-account workspace", "Real-time translation"], zh: ["全部已上线功能", "多账号工作区", "实时翻译"] };
export const recommendedPlan: PricingPlanKey = "standard";
