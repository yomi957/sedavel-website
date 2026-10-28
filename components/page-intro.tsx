"use client";
import { useLanguage } from "@/components/language-provider";
export function PageIntro({ en, zh, description }: {
    en: string;
    zh: string;
    description?: {
        en: string;
        zh: string;
    };
}) {
    const { locale } = useLanguage();
    return <div className="border-b border-emerald-100 bg-emerald-50/60"><div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20"><p className="text-xs font-semibold tracking-widest text-emerald-800">SEDAVEL</p><h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{locale === "zh" ? zh : en}</h1>{description && <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">{description[locale]}</p>}</div></div>;
}
