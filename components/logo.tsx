"use client";
import { useLanguage } from "@/components/language-provider";
import { websiteName } from "@/lib/site-settings-cms";
import { useSiteSettingsEdit, useSiteSettings } from "@/components/site-settings-provider";
import { CmsImage } from "@/components/cms-image";
import Image from "next/image";
import sedavelLogo from "@/sedavel-logo.png";

export function Logo({ className = "" }: { className?: string }) {
  const settings = useSiteSettings();
  const { locale } = useLanguage();
  const name = websiteName(settings, locale);
  const edit = useSiteSettingsEdit();
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {settings?.logo ? <span data-sanity={edit("logo")} className="h-9 w-9 shrink-0 overflow-hidden rounded-xl"><CmsImage key={settings.logo.url} image={settings.logo} decorative fallback={<Image src={sedavelLogo} width={36} height={36} alt="" className="h-9 w-9 rounded-xl" />} style={{ width: 36, height: 36, borderRadius: 12 }}/></span> : <Image src={sedavelLogo} width={36} height={36} alt="" className="h-9 w-9 shrink-0 rounded-xl" />}
      <span data-sanity={settings?.websiteNameLocalized[locale] ? edit(`websiteNameLocalized.${locale}`) : settings?.websiteName ? edit("websiteName") : undefined} title={name} className="max-w-32 truncate text-xl font-semibold tracking-tight text-slate-900">{name}</span>
    </span>
  );
}
