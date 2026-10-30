"use client";
import { keyedPath, useCmsEdit } from "./cms-edit-context";
import { useEffect } from "react";
import { useLanguage } from "@/components/language-provider";
import { useSiteSettings } from "@/components/site-settings-provider";
import { PageHero } from "@/components/page-hero";
import { GlassButton, GlassCard } from "@/components/glass-ui";
import { CmsImage } from "@/components/cms-image";
import { PageModuleView } from "@/components/page-modules";
import { localize } from "@/lib/cms-content";
import { heroProps } from "@/lib/page-cms";
import { defaultDownloadModules, downloadPageSeo, resolveDownloadCopy, type DownloadPageContent } from "@/lib/download-cms";
import type { DownloadIconPreset } from "@/lib/download-platforms";
import styles from "./download-page.module.css";
function PlatformIcon({ preset }: { preset: DownloadIconPreset }) {
  const path = preset === "windows" ? "M3 4h8v7H3zM14 4h7v7h-7zM3 14h8v7H3zM14 14h7v7h-7z" : preset === "desktop" ? "M3 4h18v13H3zM8 21h8M12 17v4" : "M5 4h14v12H5zM2 20h20l-3-4H5z";
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" aria-hidden="true"><path d={path}/></svg>;
}
/** Page-specific image wins. Global images remain the fallback for each language. */
function DownloadShareImage({ content }: { content?: DownloadPageContent | null }) {
  const { locale } = useLanguage(), settings = useSiteSettings();
  const hasPageImage = !!(content?.download.shareImages.en || content?.download.shareImages.zh);
  const asset = content?.download.shareImages[locale] || settings?.seoImages[locale];
  useEffect(() => {
    if (!hasPageImage) return;
    const originals = [...document.head.querySelectorAll<HTMLMetaElement>('meta[property="og:image"],meta[property="og:image:alt"],meta[property="og:image:width"],meta[property="og:image:height"]')];
    originals.forEach(node => node.remove());
    const nodes: HTMLMetaElement[] = [];
    if (asset) for (const [property, value] of Object.entries({ "og:image": asset.url, "og:image:alt": localize(asset.alt, locale, "Sedavel"), "og:image:width": String(asset.width), "og:image:height": String(asset.height) })) { const node = document.createElement("meta"); node.setAttribute("property", property); node.content = value; node.dataset.downloadShareImage = "true"; document.head.appendChild(node); nodes.push(node); }
    return () => { nodes.forEach(node => node.remove()); if (location.pathname === "/download") originals.forEach(node => document.head.appendChild(node)); };
  }, [asset, hasPageImage, locale]);
  return null;
}
export function DownloadPage({ content }: { content?: DownloadPageContent | null }) {
  const { locale } = useLanguage(), zh = locale === "zh";
  const edit = useCmsEdit();
  const copy = resolveDownloadCopy(content, locale), seo = downloadPageSeo(content, locale);
  useEffect(() => { document.title = seo.title; document.querySelector('meta[name="description"]')?.setAttribute("content", seo.description); }, [seo.title, seo.description]);
  return <main className={styles.page}><DownloadShareImage content={content}/><PageHero {...heroProps(content?.page.hero, { en: "Download Sedavel", zh: "下载 Sedavel" })} editContent={content?.page.hero}/>
    <section id="download" className={styles.section} aria-labelledby="download-heading"><p data-sanity={content?.download.eyebrow[locale] ? edit(`download.eyebrow.${locale}`) : undefined} className={styles.eyebrow}>{copy.eyebrow}</p><h2 data-sanity={content?.download.title[locale] ? edit(`download.title.${locale}`) : undefined} id="download-heading">{copy.title}</h2><p data-sanity={content?.download.description[locale] ? edit(`download.description.${locale}`) : undefined} className={styles.intro}>{copy.description}</p>
      <div className={styles.grid}>{copy.platforms.map(platform => { const base = keyedPath("download.platforms", platform.sourceKey), raw = content?.download.platforms.find(p => p.key === platform.key); const field = (path: string) => base ? edit(`${base}.${path}`) : undefined; return <article key={platform.key} data-platform={platform.key} data-download-state={platform.availability} className={styles.platform}>
        <GlassCard className={styles.card}>
          <div className={styles.cardTop}>{platform.showIcon && <span data-sanity={field(platform.iconImage ? "iconImage" : "iconPreset")} className={styles.icon}>{platform.iconImage ? <CmsImage key={platform.iconImage.url} image={platform.iconImage} decorative fallback={<PlatformIcon preset={platform.iconPreset}/>} style={{ height: 40, width: 40, borderRadius: 10, objectFit: "contain" }}/> : <PlatformIcon preset={platform.iconPreset}/>}</span>}<span className={styles.badge}>{zh ? "即将开放 · Coming Soon" : "Coming Soon"}</span></div>
          <h3 data-sanity={raw?.name[locale] ? field(`name.${locale}`) : undefined}>{platform.name}</h3><p data-sanity={raw?.description[locale] ? field(`description.${locale}`) : undefined} className={styles.description}>{platform.description}</p>
          {platform.image && <figure data-sanity={field("image")} className={styles.figure}><CmsImage key={platform.image.url} image={platform.image} style={{ maxHeight: 220, objectFit: "contain" }}/>{localize(platform.image.caption, locale) && <figcaption data-sanity={field(locale === "zh" ? "image.captionZh" : "image.captionEn")}>{localize(platform.image.caption, locale)}</figcaption>}</figure>}
          <dl className={styles.details}>{platform.details.map(detail => <div key={detail.key} data-release-field={detail.key}><dt data-sanity={content?.download.labels[detail.key]?.[locale] ? edit(`download.labels.${detail.key}.${locale}`) : undefined}>{detail.label}</dt><dd>{detail.value}</dd></div>)}</dl>
          <p data-sanity={raw?.statusDescription[locale] ? field(`statusDescription.${locale}`) : undefined} id={`download-status-${platform.key}`} className={styles.notice}>{platform.statusDescription}</p>
          <GlassButton data-sanity={raw?.buttonText[locale] ? field(`buttonText.${locale}`) : undefined} disabled className={styles.downloadButton} aria-describedby={`download-status-${platform.key}`}>{platform.buttonText}</GlassButton>
        </GlassCard>
      </article>; })}</div>
    </section>
    {copy.showInstallation && <section className={`${styles.section} ${styles.installation}`} aria-labelledby="installation-heading"><h2 data-sanity={content?.download.installationTitle[locale] ? edit(`download.installationTitle.${locale}`) : undefined} id="installation-heading">{copy.installationTitle}</h2><p data-sanity={content?.download.installationDescription[locale] ? edit(`download.installationDescription.${locale}`) : undefined} className={styles.intro}>{copy.installationDescription}</p>
      {!!copy.steps.length && <ol className={styles.steps}>{copy.steps.map((step, index) => { const base = keyedPath("download.steps", step.sourceKey); const field = (path: string) => base ? edit(`${base}.${path}`) : undefined; return <li key={step.key} data-installation-step className={styles.step}><span className={styles.stepNumber} aria-hidden="true">{index + 1}</span><div className={styles.stepBody}><p className={styles.eyebrow}>{step.platform === "all" ? (zh ? "所有平台" : "All platforms") : copy.platforms.find(p => p.key === step.platform)?.name}</p><h3 data-sanity={step.title[locale] ? field(`title.${locale}`) : undefined}>{localize(step.title, locale, zh ? `步骤 ${index + 1}` : `Step ${index + 1}`)}</h3><p data-sanity={step.description[locale] ? field(`description.${locale}`) : undefined} className={styles.description}>{localize(step.description, locale)}</p>{step.image && <figure data-sanity={field("image")} className={styles.figure}><CmsImage key={step.image.url} image={step.image}/>{localize(step.image.caption, locale) && <figcaption data-sanity={field(locale === "zh" ? "image.captionZh" : "image.captionEn")}>{localize(step.image.caption, locale)}</figcaption>}</figure>}</div></li>; })}</ol>}
    </section>}
    {(content?.page.modules || defaultDownloadModules()).map(module => <div key={module.key} className={module.type === "ctaBanner" ? styles.cta : undefined}><PageModuleView module={module}/></div>)}
  </main>;
}
