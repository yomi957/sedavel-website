"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/language-provider";
import { localize } from "@/lib/cms-content";
import type { SiteSettings } from "@/lib/site-settings-cms";
/** Only replace global default images. A page's own image takes precedence. */
export function DefaultShareImage({ settings }: { settings: SiteSettings | null }) {
  const { locale } = useLanguage(), pathname = usePathname();
  useEffect(() => {
    if (!settings) return;
    const known = [settings.seoImages.en?.url, settings.seoImages.zh?.url].filter(Boolean);
    const current = [...document.head.querySelectorAll<HTMLMetaElement>('meta[property="og:image"]')];
    if (current.some(m => !known.includes(m.content))) return;
    const originals = [...document.head.querySelectorAll<HTMLMetaElement>('meta[property="og:image"],meta[property="og:image:width"],meta[property="og:image:height"],meta[property="og:image:alt"]')];
    originals.forEach(node => node.remove());
    const asset = settings.seoImages[locale], nodes: HTMLMetaElement[] = [];
    if (asset) for (const [property, content] of Object.entries({ "og:image": asset.url, "og:image:width": String(asset.width), "og:image:height": String(asset.height), "og:image:alt": localize(asset.alt, locale) })) {
      const node = document.createElement("meta"); node.setAttribute("property", property); node.content = content; document.head.appendChild(node); nodes.push(node);
    }
    return () => { nodes.forEach(node => node.remove()); originals.forEach(node => document.head.appendChild(node)); };
  }, [locale, pathname, settings]);
  return null;
}
