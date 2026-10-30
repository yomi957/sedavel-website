import type { Locale } from "@/lib/i18n";
import { bilingual, icon, image, sourceKey, localize, object, type Bilingual, type CmsIcon, type CmsImage } from "./cms-content";
import { normalizeWebsitePage, type PageModule, type WebsitePage } from "./page-cms";

export const programStatuses = ["comingSoon", "active", "paused", "ended"] as const;
export type ProgramStatus = typeof programStatuses[number];
type SectionKind = "reward" | "steps" | "benefits" | "terms";
type ReferralCard = { sourceKey?: string; title: Bilingual; description: Bilingual; icon: CmsIcon; image?: CmsImage };
export type ReferralSection = { sourceKey?: string; kind: SectionKind; title: Bilingual; description: Bilingual; visible: boolean; displayOrder: number; image?: CmsImage; cards: ReferralCard[] };
export const ruleKeys = ["eligiblePurchaseDefinition", "attributionWindow", "settlementPeriod", "minimumPayout", "payoutMethod", "refundRules", "programTerms"] as const;
export type ReferralContent = { page: WebsitePage; status: ProgramStatus; percentage: number; rulesConfirmed: boolean; eyebrow: Bilingual; rewardDescription: Bilingual; terms: Record<typeof ruleKeys[number], Bilingual>; sections: ReferralSection[] };
export const referralDefaults = {
  eyebrow: { en: "REFERRAL REWARDS PROGRAM", zh: "推广返现计划" },
  title: { en: "Share Sedavel.\nEarn Rewards.", zh: "分享 Sedavel，\n让每一次推荐都有回报。" },
  description: { en: "Introduce Sedavel to more cross-border businesses and international trade professionals. Turn meaningful referrals into rewards.", zh: "邀请更多跨境电商和外贸伙伴了解 Sedavel，参与推广计划，让有价值的推荐获得相应回报。" },
  seo: {
    en: { title: "Sedavel Referral Rewards | Share & Earn", description: "Discover Sedavel’s upcoming referral rewards program. Learn how sharing Sedavel with eligible businesses may earn you cashback when the program launches." },
    zh: { title: "Sedavel 推广返现计划 | 分享推荐，获取奖励", description: "了解 Sedavel 即将推出的推广返现计划，探索邀请好友、分享产品及获取推广奖励的参与方式与活动规则。" },
  },
};
const pair = (en: string, zh: string): Bilingual => ({ en, zh });
const card = (title: Bilingual, description: Bilingual, name: CmsIcon["name"]): ReferralCard => ({ title, description, icon: { name } });
export function defaultReferralSections(): ReferralSection[] {
  const section = (kind: SectionKind, displayOrder: number, title: Bilingual, cards: ReferralCard[] = []): ReferralSection => ({ kind, displayOrder, title, description: {}, visible: true, cards });
  return [
    section("reward", 100, pair("A meaningful referral. A proposed reward.", "让有价值的推荐，获得相应回报。")),
    section("steps", 200, pair("How It Works", "如何参与推广"), [
      card(pair("Create Your Account", "注册 Sedavel"), pair("Create your Sedavel account and explore the referral rewards program.", "注册 Sedavel 账号，了解推广返现计划及参与方式。"), "customers"),
      card(pair("Share with Friends", "分享给好友"), pair("Once the program launches, share Sedavel with friends using your referral link.", "活动正式开放后，通过专属推广链接向好友推荐 Sedavel。"), "globe"),
      card(pair("Earn Referral Rewards", "获得推广奖励"), pair("Earn cashback when referred purchases meet the program’s published eligibility requirements.", "当好友的订单符合活动规则后，可按照正式公布的奖励政策获得返现。"), "sparkles"),
    ]),
    section("benefits", 300, pair("Share value with your network", "与伙伴分享实用价值"), [
      card(pair("Share a Useful Tool", "分享实用工具"), pair("Introduce Sedavel to cross-border businesses and international trade partners to help organize customer conversations more efficiently.", "向跨境电商与外贸伙伴推荐 Sedavel，帮助他们更高效地管理客户沟通。"), "accounts"),
      card(pair("Get Rewarded for Referrals", "让推荐产生价值"), pair("Qualifying referrals may receive rewards under the program’s official eligibility rules.", "通过推广返现计划，让符合条件的有效推荐获得相应奖励。"), "sparkles"),
      card(pair("Clear Program Rules", "清晰的活动规则"), pair("Review a shared set of rules for reward calculations, eligibility and settlement policies.", "通过统一的活动说明，了解奖励计算、资格条件和结算政策。"), "check"),
    ]),
    section("terms", 400, pair("Program rules", "活动规则说明")),
  ];
}
const moduleBase = (key: string, type: PageModule["type"], displayOrder: number): PageModule => ({ key, type, displayOrder, visible: true, title: {}, description: {}, eyebrow: {}, imageSide: "right", cards: [], items: [] });
export function defaultReferralModules(percentage = 10, status: ProgramStatus = "comingSoon", rulesConfirmed = false): PageModule[] {
  const upcoming = status === "comingSoon";
  const result: PageModule[] = [
    { ...moduleBase("referral-faq", "faqSection", 500), title: pair("Frequently asked questions", "常见问题"), items: [
      { question: pair("What is the Sedavel Referral Rewards Program?", "什么是 Sedavel 推广返现计划？"), answer: pair("The Sedavel Referral Rewards Program is designed to reward users who introduce Sedavel to businesses that need multilingual customer communication tools. Eligible referrals may earn rewards once the program launches.", "Sedavel 推广返现计划旨在鼓励用户将 Sedavel 推荐给有跨境客户沟通需求的伙伴。活动正式开放后，符合条件的推荐将有机会获得相应奖励。") },
      { question: pair("How much cashback can I earn?", "推广返现比例是多少？"), answer: pair(`The proposed cashback rate is ${percentage}% of eligible purchase amounts. The final rate, eligibility requirements, and calculation rules will be confirmed before launch.`, `目前计划的返现比例为符合条件的有效订单金额的 ${percentage}%。最终比例、适用范围及计算方式将在活动正式开放前公布。`) },
      { question: pair("How can I get my referral link?", "如何获得专属推广链接？"), answer: pair("Personal referral links will become available when the program officially launches. Please check Sedavel’s announcements for further instructions.", "专属推广链接功能将在推广计划正式开放后提供。具体使用方法请关注 Sedavel 官方公告。") },
      { question: pair("When will referral rewards be paid?", "返现奖励什么时候发放？"), answer: pair("The settlement schedule, payout methods, and withdrawal conditions are still being finalized and will be announced before the program launches.", "具体返现结算周期、发放方式及提现条件仍在制定中，将在活动正式开放前公布。") },
    ] },
    { ...moduleBase("referral-cta", "ctaBanner", 600), title: pair("Help More People Discover Sedavel.", "让更多人了解 Sedavel。"), description: upcoming ? pair("Join Sedavel and stay informed about the upcoming Referral Rewards Program.", "加入 Sedavel，了解即将推出的推广返现计划，与更多伙伴分享高效沟通工具。") : pair("Explore Sedavel and check the current program status and published rules before participating.", "了解 Sedavel，参与前请查看当前活动状态及正式公布的规则。"), primaryAction: { href: "/register", label: pair("Sign Up Free", "免费注册") }, secondaryAction: { href: "/features", label: pair("Explore Features", "了解产品功能") } },
  ];
  if (!upcoming) {
    const questions = result[0].items;
    questions[0].answer = pair("The program introduces Sedavel to businesses that need multilingual customer communication tools. Participation follows the current status and formally published rules; no rewards can be claimed through this website.", "该计划鼓励向有多语言客户沟通需求的企业推荐 Sedavel。参与须以当前活动状态及正式公布的规则为准，本网站暂不提供奖励领取服务。");
    questions[2].answer = pair("This website has not connected the real referral-link system. No personal link or invitation code can be generated here. Check official program instructions and the current status.", "本网站尚未接入真实推广链接系统，暂不能生成专属链接或邀请码。请查看官方参与说明及当前活动状态。");
    questions[3].answer = pair("Payment timing, methods and withdrawal conditions follow confirmed official rules. Unspecified details remain pending confirmation; no payout service is connected here.", "发放时间、方式及提现条件以正式确认的规则为准，未公布的内容仍待确认；本页面尚未接入发放服务。");
  }
  if (rulesConfirmed) result[0].items[1].answer = pair(`The displayed rate is ${percentage}%. Eligibility and calculation follow the published program rules. The current program status does not enable reward claims through this website.`, `当前展示比例为 ${percentage}%，资格及计算方式以正式公布的规则为准。当前活动状态不代表本网站已开放领取返现。`);
  return result;
}
const merge = (defaults: Bilingual, value: Bilingual): Bilingual => ({ en: value.en || defaults.en, zh: value.zh || defaults.zh });
export function normalizeReferralContent(value: unknown, project: string, dataset: string): ReferralContent | null {
  const s = object(value); if (s._id !== "page-referral" || s.pageKey !== "referral") return null;
  const page = normalizeWebsitePage(s, project, dataset); if (!page) return null;
  const r = object(s.referral), status = programStatuses.includes(r.programStatus as ProgramStatus) ? r.programStatus as ProgramStatus : "comingSoon";
  const percentage = typeof r.cashbackPercentage === "number" && Number.isFinite(r.cashbackPercentage) && r.cashbackPercentage >= 0 && r.cashbackPercentage <= 100 ? Math.round(r.cashbackPercentage * 100) / 100 : 10;
  page.modules = page.modules.filter(m => m.type !== "featureSection");
  for (const fallback of defaultReferralModules(percentage, status, r.rulesConfirmed === true)) {
    const matches = page.modules.filter(m => m.type === fallback.type);
    if (!matches.length) page.modules.push(fallback);
    else for (const m of matches) {
      m.title = merge(fallback.title, m.title); m.description = merge(fallback.description, m.description);
      if (m.type === "faqSection") m.items = m.items.length ? m.items.map((item, i) => ({ question: merge(fallback.items[i]?.question || {}, item.question), answer: merge(fallback.items[i]?.answer || {}, item.answer) })) : fallback.items;
      if (m.type === "ctaBanner") { m.primaryAction ||= fallback.primaryAction; m.secondaryAction ||= fallback.secondaryAction; }
    }
  }
  page.modules = page.modules.filter(m => m.visible).sort((a, b) => a.displayOrder - b.displayOrder);
  const raw = Array.isArray(r.sections) ? r.sections.slice(0, 10).map(object) : [];
  const sections = defaultReferralSections().flatMap(fallback => {
    const row = raw.find(v => v.kind === fallback.kind); if (row?.visible === false) return [];
    const cards = Array.isArray(row?.cards) && row.cards.length ? row.cards.slice(0, 3).flatMap((v, i) => {
      const c = object(v); if (c.visible === false) return [];
      return [{ sourceKey: sourceKey(c._key), title: merge(fallback.cards[i]?.title || {}, bilingual(c.title)), description: merge(fallback.cards[i]?.description || {}, bilingual(c.description)), icon: icon(c.icon, project, dataset), image: c.showImage !== false ? image(c.image, project, dataset) : undefined }];
    }) : fallback.cards;
    return [{ ...fallback, sourceKey: sourceKey(row?._key), title: merge(fallback.title, bilingual(row?.title)), description: bilingual(row?.description), displayOrder: typeof row?.displayOrder === "number" && Number.isFinite(row.displayOrder) ? row.displayOrder : fallback.displayOrder, image: row?.showImage !== false ? image(row?.image, project, dataset) : undefined, cards }];
  }).sort((a, b) => a.displayOrder - b.displayOrder);
  const terms = object(r.terms);
  return { page, status, percentage, rulesConfirmed: r.rulesConfirmed === true, eyebrow: bilingual(r.eyebrow), rewardDescription: bilingual(r.rewardDescription), terms: Object.fromEntries(ruleKeys.map(k => [k, bilingual(terms[k])])) as ReferralContent["terms"], sections };
}
/** Content status cannot enable a business integration. There is deliberately no referral URL or wallet data. */
export function resolveProgramState(content: ReferralContent | null | undefined, locale: Locale) {
  const status = content?.status || "comingSoon", zh = locale === "zh";
  const labels = { comingSoon: pair("Coming Soon", "即将推出"), active: pair("Active", "活动开放"), paused: pair("Paused", "活动暂停"), ended: pair("Ended", "活动已结束") };
  const notices = {
    comingSoon: pair("The program is being prepared. Cashback cannot be claimed yet.", "活动正在筹备，暂不能领取返现。"),
    active: pair("The program is marked Active. The referral participation system is not connected to this website, so no claim or referral-link entry is available here.", "活动信息标记为开放，但本网站尚未接入真实推广参与系统，暂不提供领取奖励或生成推广链接的入口。"),
    paused: pair("The program is paused. Participation and cashback claims are unavailable here.", "活动已暂停，本页面不开放参与或领取返现。"),
    ended: pair("The program has ended. Participation and cashback claims are unavailable here.", "活动已结束，本页面不开放参与或领取返现。"),
  };
  return { status, label: localize(labels[status], locale), notice: localize(notices[status], locale), canParticipate: false as const, rulesLabel: content?.rulesConfirmed ? (zh ? "已确认的活动规则 · 以公布条款为准" : "Confirmed program rules · See published terms") : (zh ? "拟定规则 · 待团队确认" : "Proposed rules · Pending team confirmation") };
}
export function referralPageSeo(content: ReferralContent | null | undefined, locale: Locale) {
  return { title: content?.page.seo[locale === "zh" ? "titleZh" : "titleEn"] || referralDefaults.seo[locale].title, description: content?.page.seo[locale === "zh" ? "descriptionZh" : "descriptionEn"] || referralDefaults.seo[locale].description };
}
export function referralRewardCopy(content: ReferralContent | null | undefined, locale: Locale) {
  const percentage = content?.percentage ?? 10, confirmed = content?.rulesConfirmed === true, zh = locale === "zh";
  return {
    percentage, title: zh ? `推广好友，享 ${percentage}% 返现` : `Earn ${percentage}% Cashback on Eligible Referrals`,
    qualification: confirmed ? (zh ? "适用范围和计算方式以正式公布的规则为准，不构成所有订单均可返现的承诺。" : "Eligibility and calculation follow the published program rules; not every purchase qualifies.") : (zh ? "计划比例，尚未正式生效。适用范围、奖励计算及发放规则待确认。" : "Proposed rate, not an effective offer. Eligibility, calculation and payout rules are pending confirmation."),
    description: localize(content?.rewardDescription, locale, zh ? "让符合条件的有效推荐获得相应回报。活动正式规则以 Sedavel 团队后续公布的内容为准。" : "Meaningful, eligible referrals may earn rewards under the final rules published by the Sedavel team."),
  };
}
