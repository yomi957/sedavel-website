"use client";
import { keyedPath, useCmsEdit } from "./cms-edit-context";
import { useEffect } from "react";
import { PageHero } from "@/components/page-hero";
import { GlassCard } from "@/components/glass-ui";
import { CmsIconView, PageModuleView } from "@/components/page-modules";
import { CmsImage } from "@/components/cms-image";
import { useLanguage } from "@/components/language-provider";
import { localize, type Bilingual } from "@/lib/cms-content";
import { heroProps } from "@/lib/page-cms";
import { defaultReferralModules, defaultReferralSections, referralDefaults, referralPageSeo, referralRewardCopy, resolveProgramState, ruleKeys, type ReferralContent, type ReferralSection } from "@/lib/referral-cms";
import styles from "./referral-page.module.css";

const ruleLabels: Record<typeof ruleKeys[number], Bilingual> = {
  eligiblePurchaseDefinition: { en: "Eligible Purchase Definition", zh: "有效订单定义" }, attributionWindow: { en: "Referral Attribution Window", zh: "推广归因期限" }, settlementPeriod: { en: "Reward Settlement Period", zh: "奖励结算周期" }, minimumPayout: { en: "Minimum Payout Amount", zh: "最低提现金额" }, payoutMethod: { en: "Payout Method", zh: "返现发放方式" }, refundRules: { en: "Refund and Chargeback Rules", zh: "退款与拒付规则" }, programTerms: { en: "Program Terms", zh: "活动条款" },
};
export function ReferralPage({ content }: { content?: ReferralContent | null }) {
  const { locale } = useLanguage(), zh = locale === "zh", t = (v?: Bilingual, fallback = "") => localize(v, locale, fallback);
  const edit = useCmsEdit();
  const state = resolveProgramState(content, locale), reward = referralRewardCopy(content, locale), seo = referralPageSeo(content, locale);
  useEffect(() => { document.querySelector("title")?.replaceChildren(seo.title); document.querySelector('meta[name="description"]')?.setAttribute("content", seo.description); }, [seo.title, seo.description]);
  const hero = heroProps(content?.page.hero, referralDefaults.title);
  const sections = content?.sections || defaultReferralSections(), modules = content?.page.modules || defaultReferralModules();
  const blocks = [...sections.map(s => ({ key: s.kind, order: s.displayOrder, section: s })), ...modules.map(m => ({ key: m.key, order: m.displayOrder, module: m }))].sort((a, b) => a.order - b.order);
  const renderSection = (s: ReferralSection) => { const base = keyedPath("referral.sections", s.sourceKey); const field = (path: string) => base ? edit(`${base}.${path}`) : undefined; return <section data-referral-section={s.kind} className={styles.section}>
    <div className={styles.heading}><h2 data-sanity={field(`title.${locale}`)}>{t(s.title)}</h2>{t(s.description) && <p data-sanity={field(`description.${locale}`)}>{t(s.description)}</p>}</div>
    {s.kind === "reward" && <GlassCard className={styles.reward}><div><span className={styles.smallLabel}>{state.rulesLabel}</span><h3 data-sanity={content ? edit("referral.cashbackPercentage") : undefined}>{reward.title}</h3><p data-sanity={content?.rewardDescription[locale] ? edit(`referral.rewardDescription.${locale}`) : undefined}>{reward.description}</p><p className={styles.qualification}>{reward.qualification}</p></div><div className={styles.percentage}><strong data-sanity={content ? edit("referral.cashbackPercentage") : undefined}>{reward.percentage}<span>%</span></strong><span>{zh ? "返现比例" : "Referral Cashback"}</span><span className={styles.badge}>{state.label}</span></div></GlassCard>}
    {(s.kind === "steps" || s.kind === "benefits") && <div className={styles.cards} role={s.kind === "steps" ? "list" : undefined}>{s.cards.map((c, index) => { const card = base ? keyedPath(`${base}.cards`, c.sourceKey) : undefined; const attr = (path: string) => card ? edit(`${card}.${path}`) : undefined; return <article key={index} role={s.kind === "steps" ? "listitem" : undefined}><GlassCard className={styles.card}>{s.kind === "steps" ? <div className={styles.stepTop}><span className={styles.step}>{String(index + 1).padStart(2, "0")}</span><CmsIconView icon={c.icon} editPath={card ? `${card}.icon` : undefined}/></div> : <CmsIconView icon={c.icon} editPath={card ? `${card}.icon` : undefined}/>}<h3 data-sanity={attr(`title.${locale}`)}>{t(c.title)}</h3><p data-sanity={attr(`description.${locale}`)}>{t(c.description)}</p>{c.image && <figure data-sanity={attr("image")} className={styles.figure}><CmsImage image={c.image}/>{t(c.image.caption) && <figcaption data-sanity={attr(locale === "zh" ? "image.captionZh" : "image.captionEn")}>{t(c.image.caption)}</figcaption>}</figure>}</GlassCard></article>; })}</div>}
    {s.kind === "terms" && <div className={styles.terms}><p className={styles.termsNotice}>{state.rulesLabel} · {zh ? "未填写的规则均待确认。" : "Unspecified rules remain pending confirmation."}</p><dl>{ruleKeys.map(key => <div key={key}><dt>{t(ruleLabels[key])}</dt><dd data-sanity={content?.terms[key][locale] ? edit(`referral.terms.${key}.${locale}`) : undefined}>{t(content?.terms[key], zh ? "待团队确认" : "Pending team confirmation")}</dd></div>)}</dl></div>}
    {s.image && <figure data-sanity={field("image")} className={styles.figure}><CmsImage image={s.image}/>{t(s.image.caption) && <figcaption data-sanity={field(locale === "zh" ? "image.captionZh" : "image.captionEn")}>{t(s.image.caption)}</figcaption>}</figure>}
  </section>; };
  return <main className={styles.page} data-referral-status={state.status} data-participation-enabled="false">
    <PageHero {...hero} editContent={content?.page.hero} eyebrowEditPath={content?.eyebrow[locale] ? `referral.eyebrow.${locale}` : undefined} eyebrow={{ en: localize(content?.eyebrow, "en", referralDefaults.eyebrow.en), zh: localize(content?.eyebrow, "zh", referralDefaults.eyebrow.zh) }} description={{ en: localize(content?.page.hero?.description, "en", referralDefaults.description.en), zh: localize(content?.page.hero?.description, "zh", referralDefaults.description.zh) }}/>
    <aside className={styles.status} aria-label={zh ? "当前活动状态" : "Current program status"}><span data-sanity={content ? edit("referral.programStatus") : undefined} className={styles.badge}>{state.label}</span><p>{state.notice}</p></aside>
    {blocks.map((b, index) => <div key={`${b.key}-${index}`} className={"module" in b && b.module.type === "ctaBanner" ? styles.cta : undefined}>{"section" in b ? renderSection(b.section) : <PageModuleView module={b.module}/>}</div>)}
  </main>;
}
