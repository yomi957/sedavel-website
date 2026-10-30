"use client";

import Link from "next/link";
import { CmsEditProvider, keyedPath, useCmsEdit } from "./cms-edit-context";
import { CmsImage } from "@/components/cms-image";
import Image from "next/image";
import { Image as SanityImage } from "next-sanity/image";
import { useState } from "react";
import { useLanguage } from "@/components/language-provider";
import type { Bilingual } from "@/lib/cms-content";
import { localize } from "@/lib/cms-content";
import { homeContent } from "@/lib/home-content";
import { localizeFeature, type FeatureRecord } from "@/lib/features-cms";
import sedavelLogo from "@/sedavel-logo.png";
import styles from "./home-landing.module.css";

function FeatureVisual({ feature, copy, copyAttributes }: { copyAttributes?: Record<string, string | undefined>; feature: ReturnType<typeof localizeFeature>; copy?: Record<string, Bilingual> }) {
  const { locale } = useLanguage();
  const [failed, setFailed] = useState(false);
  const edit = useCmsEdit();
  const t = homeContent[locale];
  if (feature.media) return <figure data-sanity={edit("image")} className={`${styles.screenshot} ${styles.realHeroImage}`} style={{ flexDirection: "column" }}><CmsImage image={feature.media} className={styles.heroProductImage}/>{localize(feature.media.caption, locale) && <figcaption data-sanity={edit(locale === "zh" ? "image.captionZh" : "image.captionEn")}>{localize(feature.media.caption, locale)}</figcaption>}</figure>;
  if (feature.image && !failed) return <figure data-sanity={edit("image")} className={`${styles.screenshot} ${styles.realHeroImage}`}><SanityImage src={feature.image.url} alt={feature.image.alt} width={feature.image.width} height={feature.image.height} sizes="(max-width: 639px) 100vw, 50vw" className={styles.heroProductImage} onError={() => setFailed(true)} /></figure>;
  return <figure data-sanity={edit("image")} className={styles.screenshot}><div className={styles.screenshotCanvas}><span data-sanity={copyAttributes?.previewLabel} className={styles.previewTag}>{localize(copy?.previewLabel, locale, t.previewLabel)}</span><Image src={sedavelLogo} alt="" width={56} height={56} className={styles.previewLogo}/><p data-sanity={copyAttributes?.previewTitle} className={styles.previewTitle}>{localize(copy?.previewTitle, locale, feature.imageLabel)}</p><p data-sanity={copyAttributes?.previewNote} className={styles.previewNote}>{localize(copy?.previewNote, locale, t.previewNote)}</p></div><figcaption data-sanity={copyAttributes?.previewBadge}>{localize(copy?.previewBadge, locale, t.previewBadge)}</figcaption></figure>;
}

export function FeatureShowcase({ features, standalone = false, heading, copy, preview = false }: { preview?: boolean; features: FeatureRecord[]; standalone?: boolean; heading?: { sourceKey?: string; key?: string; title: Bilingual; eyebrow: Bilingual; description?: Bilingual }; copy?: Record<string, Bilingual> }) {
  const { locale } = useLanguage();
  const t = homeContent[locale];
  const edit = useCmsEdit(), sectionPath = keyedPath("modules", heading?.sourceKey);
  const copyAttributes = Object.fromEntries(["previewLabel", "previewTitle", "previewNote", "previewBadge"].map(k => [k, copy?.[k]?.[locale] ? edit(`displayCopy.${k}.${locale}`) : undefined]));
  if (!features.length) return <section className={`${styles.container} ${styles.showcaseSection}`}><p data-sanity={copy?.emptyFeatures[locale] ? edit(`displayCopy.emptyFeatures.${locale}`) : undefined}>{localize(copy?.emptyFeatures, locale, locale === "zh" ? "暂无可公开展示的功能。" : "No public features are currently listed.")}</p></section>;
  return <section className={`${styles.container} ${styles.showcaseSection}`} aria-label={locale === "zh" ? "产品功能介绍" : "Product features"}>
    <div className={styles.sectionHeading}><p data-sanity={sectionPath && heading?.eyebrow[locale] ? edit(`${sectionPath}.eyebrow.${locale}`) : undefined} className={styles.eyebrow}>{localize(heading?.eyebrow, locale, t.showcaseLabel)}</p><h2 data-sanity={sectionPath && heading?.title[locale] ? edit(`${sectionPath}.title.${locale}`) : undefined}>{localize(heading?.title, locale, locale === "zh" ? "围绕客户沟通，了解 Sedavel。" : "Explore a clearer customer workflow.")}</h2>{localize(heading?.description, locale) && <p data-sanity={sectionPath ? edit(`${sectionPath}.description.${locale}`) : undefined} className={styles.sectionDescription}>{localize(heading?.description, locale)}</p>}</div>
    {features.map((record, index) => {
      return <CmsEditProvider key={record.id} id={preview && !record.isFallback ? record.id : undefined} type="feature"><FeatureRow record={record} index={index} standalone={standalone} copy={copy} copyAttributes={copyAttributes}/></CmsEditProvider>;
    })}
  </section>;
}

function FeatureRow({ record, index, standalone, copy, copyAttributes }: { copyAttributes?: Record<string, string | undefined>; record: FeatureRecord; index: number; standalone: boolean; copy?: Record<string, Bilingual> }) {
  const { locale } = useLanguage(), edit = useCmsEdit(), f = localizeFeature(record, locale), t = homeContent[locale];
  return <article id={`feature-${record.id}`} data-feature-id={record.id} className={`${styles.showcaseRow} ${index % 2 ? styles.showcaseReverse : ""}`}>
    <div className={styles.showcaseCopy}><p className={styles.eyebrow}>{String(index + 1).padStart(2, "0")} / SEDAVEL</p><h3 data-sanity={record[locale === "zh" ? "nameZh" : "nameEn"] ? edit(locale === "zh" ? "nameZh" : "nameEn") : undefined}>{f.title}</h3><span data-sanity={edit("publicationStatus")} className={styles.featureStatus}>{f.status}</span><p data-sanity={record[locale === "zh" ? "descriptionZh" : "descriptionEn"] ? edit(locale === "zh" ? "descriptionZh" : "descriptionEn") : undefined}>{f.body}</p>{f.points.length > 0 && <ul data-sanity={edit(locale === "zh" ? "benefitsZh" : "benefitsEn")} className={styles.featurePoints}>{f.points.map((point, i) => <li key={`${i}-${point}`}><span aria-hidden="true">✓</span>{point}</li>)}</ul>}{!standalone && <Link href="/features" className={styles.textLink}>{t.learn}<span aria-hidden="true">↗</span></Link>}</div>
    <FeatureVisual key={f.image?.url ?? "placeholder"} feature={f} copy={copy} copyAttributes={copyAttributes}/>
  </article>;
}
