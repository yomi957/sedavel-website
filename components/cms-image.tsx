"use client";
import { useState, type CSSProperties, type ReactNode } from "react";
import { Image } from "next-sanity/image";
import { useLanguage } from "@/components/language-provider";
import { localize, type CmsImage as CmsImageData } from "@/lib/cms-content";
export function CmsImage({ image, className, decorative = false, style, fallback, eager = false, sizes = "(max-width: 767px) 100vw, 50vw" }: { image: CmsImageData; className?: string; eager?: boolean; fallback?: ReactNode; decorative?: boolean; style?: CSSProperties; sizes?: string }) {
  const { locale } = useLanguage(); const [failed, setFailed] = useState(false);
  if (failed && fallback) return fallback;
  if (failed) return decorative ? null : <p className="rounded-2xl border border-emerald-100 bg-emerald-50 p-8 text-sm text-emerald-900">{locale === "zh" ? "图片暂时无法加载，等待正式素材。" : "Image unavailable. Awaiting the official asset."}</p>;
  const ratio = image.ratio === "wide" ? "16/9" : image.ratio === "square" ? "1/1" : undefined;
  return <Image loading={eager ? "eager" : undefined} fetchPriority={eager ? "high" : undefined} src={image.url} width={image.width} height={image.height} alt={decorative ? "" : localize(image.alt, locale, locale === "zh" ? "Sedavel 产品图片" : "Sedavel product image")} aria-hidden={decorative || undefined} sizes={sizes} className={className} style={{ width: "100%", height: "auto", aspectRatio: ratio, objectFit: ratio ? "cover" : "contain", objectPosition: image.position, borderRadius: image.style === "plain" ? 0 : 20, border: image.style === "framed" ? "1px solid #cce6d2" : undefined, ...style }} onError={() => setFailed(true)} />;
}
