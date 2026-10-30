"use client";

import Link from "next/link";
import { useCmsEdit } from "./cms-edit-context";
import type { HeroContent } from "@/lib/page-cms";
import Image, { type StaticImageData } from "next/image";
import { useLanguage } from "@/components/language-provider";
import { CmsImage } from "@/components/cms-image";
import type { CmsImage as CmsImageData } from "@/lib/cms-content";
import styles from "./page-hero.module.css";

type Bilingual = { en: string; zh: string };
type HeroAction = { label: Bilingual; href: `/${string}` };

export type PageHeroProps = {
  editContent?: HeroContent;
  eyebrowEditPath?: string;
  titleEditPath?: string;
  descriptionEditPath?: string;
  en: string;
  zh: string;
  eyebrow?: Bilingual;
  description?: Bilingual;
  compact?: boolean;
  backgroundStyle?: "brand" | "pale" | "deep";
  backgroundImage?: CmsImageData;
  decorativeImage?: CmsImageData;
  showDecoration?: boolean;
  backgroundWord?: string;
  decoration?: StaticImageData;
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
};

/** Presentation only: copy, routes and CMS data remain owned by the calling page. */
export function PageHero({ titleEditPath, descriptionEditPath, eyebrowEditPath, editContent, en, zh, eyebrow, description, compact = false, backgroundStyle = "brand", backgroundImage, decorativeImage, showDecoration = true, backgroundWord = "SEDAVEL", decoration, primaryAction, secondaryAction }: PageHeroProps) {
  const { locale } = useLanguage();
  const edit = useCmsEdit();
  return <header data-page-hero className={`${styles.hero} ${backgroundStyle === "brand" ? "" : styles[backgroundStyle]} ${compact ? styles.compact : ""}`}>
    {backgroundImage && <div data-sanity={editContent?.backgroundImage ? edit("hero.backgroundImage") : undefined} className={styles.backgroundImage}><CmsImage key={backgroundImage.url} image={backgroundImage} decorative style={{ height: "100%", objectFit: "cover", borderRadius: 0 }} sizes="100vw" /></div>}
    {showDecoration && backgroundWord && <span className={styles.word} aria-hidden="true">{backgroundWord}</span>}
    {showDecoration && decorativeImage && <div data-sanity={editContent?.decorativeImage ? edit("hero.decorativeImage") : undefined} className={styles.decoration}><CmsImage key={decorativeImage.url} image={decorativeImage} decorative style={{ height: "100%", objectFit: "contain" }} /></div>}
    {showDecoration && decoration && <Image src={decoration} alt="" aria-hidden="true" className={styles.decoration} sizes="(max-width: 639px) 50vw, 30vw" />}
    <div className={styles.content}>
      <p data-sanity={edit(eyebrowEditPath)} className={styles.eyebrow}><span aria-hidden="true" />{eyebrow?.[locale] || "SEDAVEL"}</p>
      <h1 data-sanity={titleEditPath ? edit(titleEditPath) : editContent?.title[locale] ? edit(`hero.title.${locale}`) : undefined}>{locale === "zh" ? zh : en}</h1>
      {description && <p data-sanity={descriptionEditPath ? edit(descriptionEditPath) : editContent?.description[locale] ? edit(`hero.description.${locale}`) : undefined} className={styles.description}>{description[locale]}</p>}
      {(primaryAction || secondaryAction) && <div className={styles.actions}>
        {primaryAction && <Link data-sanity={editContent?.primaryAction?.label[locale] ? edit(`hero.primaryAction.label.${locale}`) : undefined} href={primaryAction.href} className={styles.primary}>{primaryAction.label[locale]}<span aria-hidden="true">↗</span></Link>}
        {secondaryAction && <Link data-sanity={editContent?.secondaryAction?.label[locale] ? edit(`hero.secondaryAction.label.${locale}`) : undefined} href={secondaryAction.href} className={styles.secondary}>{secondaryAction.label[locale]}<span aria-hidden="true">↗</span></Link>}
      </div>}
    </div>
  </header>;
}
