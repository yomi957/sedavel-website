"use client";
import Link from "next/link";
import { keyedPath } from "./cms-edit-context";
import { useSiteSettingsEdit, useSiteSettings } from "@/components/site-settings-provider";
import { localize } from "@/lib/cms-content";
import { navigationLabelPath, websiteName, type FooterGroup, type FooterLink } from "@/lib/site-settings-cms";
import { Logo } from "@/components/logo";
import { useLanguage } from "@/components/language-provider";
export function SiteFooter() {
  const { t, locale } = useLanguage(), settings = useSiteSettings();
  const edit = useSiteSettingsEdit();
  const footerField = (key: string) => settings?.footer[key]?.[locale] ? edit(`footerContent.${key}.${locale}`) : undefined;
  const footer = (key: keyof typeof t.footer) => localize(settings?.footer[key], locale, t.footer[key]);
  const nav = (key: keyof typeof t.nav) => localize(settings?.navigation[key], locale, t.nav[key]);
  const year = 2026, name = websiteName(settings, locale);
  const linkLabel = (link: FooterLink) => localize(link.label, locale,
    link.page === "privacy" || link.page === "terms" || link.page === "contact" ? footer(link.page) : link.page === "register" ? localize(settings?.globalCtaText, locale, t.nav.getStarted) : nav(link.page));
  const defaultLink = (page: FooterLink["page"]): FooterLink => ({ page, href: page === "home" ? "/" : `/${page}`, label: {}, showLegalNotice: page === "privacy" || page === "terms" });
  const groups: FooterGroup[] = settings?.footerGroups ?? [
    { key: "product", title: { [locale]: footer("product") }, links: ["features", "pricing", "download"].map(p => defaultLink(p as FooterLink["page"])) },
    { key: "company", title: { [locale]: footer("company") }, links: ["referral", "help", "blog", "contact", "privacy", "terms"].map(p => defaultLink(p as FooterLink["page"])) },
  ];
  const linkField = (group: FooterGroup, link: FooterLink) => {
    const g = keyedPath("footerGroups", group.sourceKey), l = g ? keyedPath(`${g}.links`, link.sourceKey) : undefined;
    if (l && link.label[locale]) return edit(`${l}.label.${locale}`);
    if (["privacy", "terms", "contact"].includes(link.page)) return footerField(link.page);
    if (link.page === "register") return settings?.globalCtaText[locale] ? edit(`globalCtaText.${locale}`) : undefined;
    return edit(navigationLabelPath(settings, link.page, locale));
  };
  const copyright = localize(settings?.footerCopyright, locale).replaceAll("{year}", String(year)).replaceAll("{websiteName}", name) || `© ${year} ${name}. ${footer("rights")}`;
  return <footer className="break-words border-t border-slate-200 bg-white">
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
      <div className="min-w-0 md:col-span-2"><Logo/><p data-sanity={footerField("blurb")} className="mt-4 max-w-md text-sm leading-6 text-slate-600">{footer("blurb")}</p>
        {localize(settings?.contactInformation, locale) && <p data-sanity={edit(`contactInformation.${locale}`)} className="mt-4 text-sm leading-7 text-slate-600">{localize(settings?.contactInformation, locale)}</p>}
        {settings?.contactEmail && <a data-sanity={edit("contactEmail")} className="mt-3 inline-block text-sm text-emerald-800" href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>}
        {!!settings?.socialLinks.length && <ul className="mt-4 flex flex-wrap gap-4 text-sm text-emerald-800">{settings.socialLinks.map(s => <li key={s.url}><a data-sanity={s.sourceKey && s.label[locale] ? edit(`${keyedPath("socialLinks", s.sourceKey)}.label.${locale}`) : undefined} href={s.url} target="_blank" rel="noopener noreferrer">{localize(s.label, locale, new URL(s.url).hostname)}</a></li>)}</ul>}
      </div>
      {groups.map((group, index) => <div key={group.key} className="min-w-0"><h2 data-sanity={group.sourceKey && group.title[locale] ? edit(`${keyedPath("footerGroups", group.sourceKey)}.title.${locale}`) : footerField(index === 0 ? "product" : "company")} className="text-sm font-semibold text-slate-900">{localize(group.title, locale, footer(index === 0 ? "product" : "company"))}</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-600">{group.links.map(link => <li key={link.page}><Link data-sanity={linkField(group, link)} href={link.href} className="hover:text-slate-900">{linkLabel(link)}{link.showLegalNotice && <span data-sanity={footerField("placeholderLegal")} className="ml-2 text-xs text-slate-600">{footer("placeholderLegal")}</span>}</Link></li>)}</ul>
      </div>)}
    </div>
    <div className="border-t border-slate-200"><p data-sanity={settings?.footerCopyright[locale] ? edit(`footerCopyright.${locale}`) : footerField("rights")} className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-500 sm:px-6">{copyright}</p></div>
  </footer>;
}
