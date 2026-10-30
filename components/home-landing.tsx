"use client";

import Link from "next/link";
import { createDataAttribute } from "next-sanity";
import { dataset, projectId } from "@/sanity/env";
import { useSiteSettingsEdit, useSiteSettings } from "@/components/site-settings-provider";
import { resolveDefaultSeo } from "@/lib/site-settings-cms";
import { localize } from "@/lib/cms-content";
import { GlassButton, GlassCard } from "@/components/glass-ui";
import { FeatureShowcase } from "@/components/feature-showcase";
import { defaultFeatures, localizeFeature, type FeatureRecord } from "@/lib/features-cms";
import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import { Image as SanityImage } from "next-sanity/image";
import { useLanguage } from "@/components/language-provider";
import { homeContent } from "@/lib/home-content";
import { homeDefaultSeo, resolveHomeHero, resolveHomeSeo, type HomePageCmsContent } from "@/lib/home-cms";
import sedavelLogo from "@/sedavel-logo.png";
import styles from "./home-landing.module.css";

type Content = typeof homeContent.en;
function Icon({ kind = 0 }: { kind?: number }) {
  const paths = [
    "M4 4h7v7H4zM14 4h6v7h-6zM4 14h7v6H4zM14 14h6v6h-6z",
    "M3 5h11M8 3v2M5 5c0 5 4 9 8 10M12 5c0 4-3 8-8 11M13 21l4-11 4 11M14.5 17h5",
    "M8 7a4 4 0 1 0 8 0 4 4 0 0 0-8 0M4 21v-2a8 8 0 0 1 16 0v2",
    "m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z",
    "M3 4h18v13H3zM8 21h8M12 17v4",
    "M4 8h16v12H4zM8 8V4h8v4M4 13h16M10 13v3h4v-3",
  ];
  return <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={paths[kind]} /></svg>;
}
function Arrow() { return <span aria-hidden="true">↗</span>; }
function HomeActions({ t, inverse = false }: { t: Content; inverse?: boolean }) {
  const settings = useSiteSettings(), editSettings = useSiteSettingsEdit();
  const { locale } = useLanguage();
  return <div className={`${styles.downloadGroup} ${inverse ? styles.inverse : ""}`}>
    <div className={styles.downloadButtons}>
      <GlassButton data-sanity={settings?.globalCtaText[locale] ? editSettings(`globalCtaText.${locale}`) : undefined} href="/register">{localize(settings?.globalCtaText, locale, t.signup)}<Arrow /></GlassButton>
      <GlassButton href="/download" variant="secondary">{t.download}<Arrow /></GlassButton>
    </div>
    <p className={styles.platforms}>{t.platforms}</p>
    <p className={styles.downloadStatus}>{t.unavailable}</p>
  </div>;
}
function Screenshot({ t, label, hero = false }: { t: Content; label?: string; hero?: boolean }) {
  return <figure className={`${styles.screenshot} ${hero ? styles.heroScreenshot : ""}`}>
    <div className={styles.screenshotCanvas}>
      <span className={styles.previewTag}>{t.previewLabel}</span>
      <Image src={sedavelLogo} alt="" width={64} height={64} className={styles.previewLogo} />
      <p className={styles.previewTitle}>{label || t.previewTitle}</p>
      <p className={styles.previewNote}>{t.previewNote}</p>
    </div>
    <figcaption>{t.previewBadge}</figcaption>
  </figure>;
}
function HeroImage({ t, image, editAttribute }: { editAttribute?: string; t: Content; image: NonNullable<ReturnType<typeof resolveHomeHero>["image"]> }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <Screenshot t={t} hero />;
  return <figure data-sanity={editAttribute} className={`${styles.screenshot} ${styles.heroScreenshot} ${styles.realHeroImage}`}>
    <SanityImage src={image.url} alt={image.alt} width={image.width} height={image.height} sizes="(max-width: 899px) 100vw, 50vw" className={styles.heroProductImage} onError={() => setFailed(true)} />
  </figure>;
}
function SectionHeading({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return <div className={styles.sectionHeading}><p className={styles.eyebrow}>{eyebrow}</p><h2>{title}</h2>{body && <p className={styles.sectionDescription}>{body}</p>}</div>;
}
export function HomeLanding({ cmsContent, features = defaultFeatures(), preview = false }: { cmsContent?: HomePageCmsContent | null; features?: FeatureRecord[]; preview?: boolean }) {
  const { locale } = useLanguage();
  const t = homeContent[locale];
  const hero = resolveHomeHero(locale, cmsContent);
  const edit = (path: string) => preview ? createDataAttribute({ projectId, dataset, id: "homePage", type: "homePage", path }).toString() : undefined;
  const settings = useSiteSettings();
  const seo = resolveHomeSeo(locale, cmsContent, resolveDefaultSeo(settings, locale, homeDefaultSeo));
  useEffect(() => {
    document.title = seo.title;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", seo.description);
  }, [seo.title, seo.description]);
  return <main className={`${styles.home} ${styles.premium}`}>
    <section className={styles.hero} aria-labelledby="home-title">
      <div className={styles.brandWord} aria-hidden="true">SEDAVEL</div>
      <div className={`${styles.container} ${styles.heroGrid}`}>
        <div className={styles.heroCopy}>
          <p className={styles.heroEyebrow}><span aria-hidden="true" />{t.eyebrow}</p>
          <h1 id="home-title" data-sanity={edit(locale === "zh" ? "heroTitleZh" : "heroTitleEn")}>{hero.titleLines.map((line, index) => <Fragment key={index}>{index > 0 && <br />}{index > 0 ? <span>{line}</span> : line}</Fragment>)}</h1>
          <p className={styles.heroBody} data-sanity={edit(locale === "zh" ? "heroDescriptionZh" : "heroDescriptionEn")}>{hero.description}</p>
          <HomeActions t={t} />
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.productStage}>
            <div className={styles.productWindow} data-sanity={!hero.image ? edit("heroImage") : undefined}>
              <div className={styles.windowBar} aria-hidden="true"><span className={styles.windowDots}><i/><i/><i/></span><span>SEDAVEL / {locale === "zh" ? "产品展示" : "PRODUCT VIEW"}</span><span>↗</span></div>
              {hero.image ? <HeroImage key={hero.image.url} t={t} image={hero.image} editAttribute={edit("heroImage")} /> : <Screenshot t={t} hero />}
            </div>
            <div className={styles.floatingCards}>
              {features.filter(record => ["translation", "messaging", "ai"].includes(record.key ?? "")).slice(0, 3).map(record => {
                const feature = localizeFeature(record, locale);
                return <div key={record.id} className={styles.floatingCard} data-float-key={record.key}>
                  <span className={styles.floatIcon}><Icon kind={record.key === "translation" ? 1 : record.key === "ai" ? 3 : 0}/></span>
                  <div><p>{feature.title}</p><small>{feature.status}</small></div>
                </div>;
              })}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className={`${styles.values} ${styles.container}`} aria-label={t.valueLabel}>
      <p className={styles.eyebrow}>{t.valueLabel}</p>
      <div className={styles.valueGrid}>{t.values.map((v, i) => <article key={v.title}><span className={styles.icon}><Icon kind={i} /></span><h2>{v.title}</h2><p>{v.body}</p></article>)}</div>
    </section>

    <section className={styles.softSection} aria-labelledby="core-features-title">
      <div className={styles.container}>
        <div id="core-features-title"><SectionHeading eyebrow={t.featureLabel} title={t.featureTitle} body={t.featureBody} /></div>
        <ul className={styles.featureOverview}>{features.map((record, i) => { const f = localizeFeature(record, locale); return <li key={record.id} data-feature-key={record.key}><GlassCard href={`#feature-${record.id}`}><span className={styles.icon}><Icon kind={i % 4} /></span><span>{f.title}<small>{f.status}</small></span><Arrow /></GlassCard></li>; })}</ul>
      </div>
    </section>

    <FeatureShowcase features={features} />

    <section className={styles.softSection}><div className={styles.container}>
      <SectionHeading eyebrow={t.casesLabel} title={t.casesTitle} />
      <div className={styles.caseGrid}>{t.cases.map((c, i) => <article key={c.title} className={styles.caseCard}><span className={styles.icon}><Icon kind={i === 1 ? 5 : i === 2 ? 2 : 0} /></span><p className={styles.caseTag}>{c.tag}</p><h3>{c.title}</h3><p>{c.body}</p></article>)}</div>
    </div></section>

    <section className={`${styles.pricingSection} ${styles.container}`}>
      <div><SectionHeading eyebrow={t.pricingLabel} title={t.pricingTitle} /><p className={styles.pricingLead}>{t.free}<br />{t.pay}</p><p className={styles.pricingBody}>{t.pricingBody}</p><Link className={styles.solidLink} href="/pricing">{t.pricingLink}<Arrow /></Link></div>
      <div className={styles.creditCard}><span className={styles.creditMark} aria-hidden="true">Aa</span><p className={styles.creditNumber}>50,000<span>{t.freeLabel}</span></p><div className={styles.creditDivider} /><p className={styles.creditFooter}><span aria-hidden="true">✓</span>{t.noMembership}</p></div>
    </section>

    <section className={styles.faqSection}><div className={styles.container}><SectionHeading eyebrow={t.faqLabel} title={t.faqTitle} /><div className={styles.faqList}>{t.faqs.map(f => <details key={f.q}><summary>{f.q}<span aria-hidden="true">+</span></summary><p>{f.a}</p></details>)}</div></div></section>

    <section className={styles.finalSection}><div className={`${styles.container} ${styles.finalCard}`}><p className={styles.eyebrow}>{t.ctaLabel}</p><h2>{t.ctaTitle}</h2><p className={styles.ctaBody}>{t.ctaBody}</p><HomeActions t={t} inverse /></div></section>
  </main>;
}
