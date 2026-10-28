"use client";

import Link from "next/link";
import { Logo } from "@/components/logo";
import { useLanguage } from "@/components/language-provider";

export function SiteFooter() {
  const { t } = useLanguage();
  const year = 2026;

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">
            {t.footer.blurb}
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-900">{t.footer.product}</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>
              <Link href="/#features" className="hover:text-slate-900">
                {t.nav.features}
              </Link>
            </li>
            <li>
              <Link href="/#pricing" className="hover:text-slate-900">
                {t.nav.pricing}
              </Link>
            </li>
            <li>
              <Link href="/#download" className="hover:text-slate-900">
                {t.nav.download}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-900">{t.footer.company}</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>
              <Link href="/#contact" className="hover:text-slate-900">
                {t.footer.contact}
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-slate-900">
                {t.footer.privacy}
                <span className="ml-2 text-xs text-slate-400">
                  {t.footer.placeholderLegal}
                </span>
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-slate-900">
                {t.footer.terms}
                <span className="ml-2 text-xs text-slate-400">
                  {t.footer.placeholderLegal}
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200">
        <p className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-500 sm:px-6">
          © {year} Sedavel. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
