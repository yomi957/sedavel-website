"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { useLanguage } from "@/components/language-provider";
import { PLACEHOLDER_SIGNUP, type Locale } from "@/lib/i18n";

const navItems = [
  { href: "/#features", key: "features" as const },
  { href: "/#pricing", key: "pricing" as const },
  { href: "/#download", key: "download" as const },
  { href: "/#contact", key: "contact" as const },
];

export function SiteHeader() {
  const { t, locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="transition-colors hover:text-slate-900"
            >
              {t.nav[item.key]}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageToggle locale={locale} setLocale={setLocale} />
          <a
            href={PLACEHOLDER_SIGNUP}
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
            title={t.hero.ctaNote}
          >
            {t.nav.getStarted}
          </a>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
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
        </button>
      </div>

      {open ? (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3 text-sm font-medium text-slate-700">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2 hover:bg-slate-50"
              >
                {t.nav[item.key]}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex items-center justify-between gap-3">
            <LanguageToggle locale={locale} setLocale={setLocale} />
            <a
              href={PLACEHOLDER_SIGNUP}
              className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
              title={t.hero.ctaNote}
            >
              {t.nav.getStarted}
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function LanguageToggle({
  locale,
  setLocale,
}: {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}) {
  const options: { id: Locale; label: string }[] = [
    { id: "en", label: "EN" },
    { id: "zh", label: "中文" },
  ];

  return (
    <div
      className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1 text-xs font-semibold"
      role="group"
      aria-label="Language"
    >
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => setLocale(option.id)}
          className={`rounded-full px-2.5 py-1 transition ${
            locale === option.id
              ? "bg-white text-blue-700 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
