"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/components/language-provider";
import { homeContent } from "@/lib/home-content";
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
  return <div className={`${styles.downloadGroup} ${inverse ? styles.inverse : ""}`}>
    <div className={styles.downloadButtons}>
      <Link href="/register" className={styles.signupButton}>{t.signup}<Arrow /></Link>
      <Link href="/download" className={styles.downloadButton}>{t.download}<Arrow /></Link>
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
function SectionHeading({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return <div className={styles.sectionHeading}><p className={styles.eyebrow}>{eyebrow}</p><h2>{title}</h2>{body && <p className={styles.sectionDescription}>{body}</p>}</div>;
}
export function HomeLanding() {
  const { locale } = useLanguage();
  const t = homeContent[locale];
  return <main className={styles.home}>
    <section className={styles.hero} aria-labelledby="home-title">
      <div className={`${styles.container} ${styles.heroGrid}`}>
        <div className={styles.heroCopy}>
          <p className={styles.heroEyebrow}><span aria-hidden="true" />{t.eyebrow}</p>
          <h1 id="home-title">{t.heroTitle[0]}<br /><span>{t.heroTitle[1]}</span></h1>
          <p className={styles.heroBody}>{t.heroBody}</p>
          <HomeActions t={t} />
        </div>
        <div className={styles.heroVisual}><Screenshot t={t} hero /></div>
      </div>
    </section>

    <section className={`${styles.values} ${styles.container}`} aria-label={t.valueLabel}>
      <p className={styles.eyebrow}>{t.valueLabel}</p>
      <div className={styles.valueGrid}>{t.values.map((v, i) => <article key={v.title}><span className={styles.icon}><Icon kind={i} /></span><h2>{v.title}</h2><p>{v.body}</p></article>)}</div>
    </section>

    <section className={styles.softSection} aria-labelledby="core-features-title">
      <div className={styles.container}>
        <div id="core-features-title"><SectionHeading eyebrow={t.featureLabel} title={t.featureTitle} body={t.featureBody} /></div>
        <ul className={styles.featureOverview}>{t.features.map((f, i) => <li key={f.title}><Link href={`#home-feature-${i}`}><span className={styles.icon}><Icon kind={i === 0 ? 1 : i === 1 ? 0 : i} /></span><span>{f.title}{i === 3 && <small>{t.coming}</small>}</span><Arrow /></Link></li>)}</ul>
      </div>
    </section>

    <section className={`${styles.showcaseSection} ${styles.container}`}>
      <SectionHeading eyebrow={t.showcaseLabel} title={t.showcaseTitle} />
      {t.features.map((f, i) => <article id={`home-feature-${i}`} key={f.tag} className={`${styles.showcaseRow} ${i % 2 === 1 ? styles.showcaseReverse : ""}`}>
        <div className={styles.showcaseCopy}>
          <p className={styles.eyebrow}>{f.tag}</p><h3>{f.title}</h3>
          {f.status && <span className={styles.featureStatus}>{f.status}</span>}
          <p>{f.body}</p>
          <ul className={styles.featurePoints}>{f.points.map(point => <li key={point}><span aria-hidden="true">✓</span>{point}</li>)}</ul>
          <Link className={styles.textLink} href="/features">{t.learn}<Arrow /></Link>
        </div>
        <Screenshot t={t} label={f.image} />
      </article>)}
    </section>

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
