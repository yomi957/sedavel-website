"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language-provider";

export function LegalPage({ kind }: { kind: "privacy" | "terms" }) {
  const { t } = useLanguage();
  const title = kind === "privacy" ? t.legal.privacyTitle : t.legal.termsTitle;

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
        {t.footer.placeholderLegal}
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
        {title}
      </h1>
      <p className="mt-6 text-base leading-7 text-slate-600">{t.legal.placeholder}</p>
      <Link
        href="/"
        className="mt-10 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-800"
      >
        {t.legal.back}
      </Link>
    </main>
  );
}
