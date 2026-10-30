"use client";

import Link from "next/link";
import { useSiteSettingsEdit } from "@/components/site-settings-provider";
import { useSiteSettings } from "@/components/site-settings-provider";
import { publicNavigation } from "@/lib/site-navigation";
import { navigationLabelPath, resolveNavigation } from "@/lib/site-settings-cms";
import { localize } from "@/lib/cms-content";
import { GlassButton, GlassIconButton, GlassNavigation, GlassToggle } from "@/components/glass-ui";
import styles from "./site-header.module.css";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import { Logo } from "@/components/logo";
import { useLanguage } from "@/components/language-provider";
import type { Locale } from "@/lib/i18n";

export function SiteHeader() {
  return <Suspense fallback={<div className="h-16 border-b border-slate-200 bg-white" />}><HeaderContent /></Suspense>;
}

function HeaderContent() {
  const { t, locale, setLocale } = useLanguage();
  const settings = useSiteSettings();
  const navItems = resolveNavigation(settings);
  const edit = useSiteSettingsEdit();
  const navLabel = (key: typeof publicNavigation[number]["key"]) => localize(settings?.navigation[key], locale, t.nav[key]);
  const ctaLabel = localize(settings?.globalCtaText, locale, t.nav.getStarted);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const active = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <GlassNavigation data-open={open} onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); }} className={`${styles.header} ${pathname === "/" ? styles.homeHeader : ""} sticky z-50`}>
      <div className={styles.bar}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" onClick={() => setOpen(false)} className="rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">
          <Logo />
        </Link>

        <nav className="hidden min-w-0 flex-1 justify-center items-center gap-0.5 text-[13px] font-medium text-slate-600 xl:flex">
          {navItems.map((item) => (
            <Link
              key={item.key}
              data-sanity={edit(navigationLabelPath(settings, item.key, locale))}
              href={item.href}
              aria-current={active(item.href) ? "page" : undefined}
              onClick={() => setOpen(false)}
              title={navLabel(item.key)}
              className={`${styles.navItem} min-w-0 max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap px-2 py-2`}
            >
              {navLabel(item.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <LanguageToggle locale={locale} setLocale={setLocale} />
          <GlassButton data-sanity={settings?.globalCtaText[locale] ? edit(`globalCtaText.${locale}`) : undefined} className="max-w-[180px]" href="/register" onClick={() => setOpen(false)}><span className="min-w-0 truncate" title={ctaLabel}>{ctaLabel}</span></GlassButton>
        </div>

        <GlassIconButton
          className={`${styles.menuButton} xl:hidden`}
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
        >
          <span className="sr-only">{open ? t.nav.closeMenu : t.nav.openMenu}</span>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            {open ? (
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </GlassIconButton>
      </div>
      </div>

      {open ? (
        <div id="mobile-navigation" className={`${styles.mobileMenu} overflow-y-auto px-4 py-4 xl:hidden`}>
          <nav className="flex flex-col gap-3 text-sm font-medium text-slate-700">
            {navItems.map((item) => (
              <Link
                key={item.key}
              data-sanity={edit(navigationLabelPath(settings, item.key, locale))}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active(item.href) ? "page" : undefined}
                className={`${styles.navItem} px-3 py-2`}
              >
                {navLabel(item.key)}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <LanguageToggle locale={locale} setLocale={setLocale} />
            <GlassButton data-sanity={settings?.globalCtaText[locale] ? edit(`globalCtaText.${locale}`) : undefined} className="max-w-[180px]" href="/register" onClick={() => setOpen(false)}><span className="min-w-0 truncate" title={ctaLabel}>{ctaLabel}</span></GlassButton>
          </div>
        </div>
      ) : null}
    </GlassNavigation>
  );
}

function LanguageToggle({
  locale,
  setLocale,
}: {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}) {
  const settings = useSiteSettings(), edit = useSiteSettingsEdit();
  return <GlassToggle<Locale>
    value={locale}
    onChange={setLocale}
    label={localize(settings?.languageLabels.label, locale, locale === "zh" ? "语言" : "Language")}
    options={[{ value: "en", label: <span data-sanity={settings?.languageLabels.english[locale] ? edit(`languageLabels.english.${locale}`) : undefined} className="block max-w-16 truncate" title={localize(settings?.languageLabels.english, locale, "EN")}>{localize(settings?.languageLabels.english, locale, "EN")}</span> }, { value: "zh", label: <span data-sanity={settings?.languageLabels.chinese[locale] ? edit(`languageLabels.chinese.${locale}`) : undefined} className="block max-w-16 truncate" title={localize(settings?.languageLabels.chinese, locale, "中文")}>{localize(settings?.languageLabels.chinese, locale, "中文")}</span> }]}
  />;
}
