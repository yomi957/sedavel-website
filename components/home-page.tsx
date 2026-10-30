"use client";

import { keyedPath, useCmsEdit } from "./cms-edit-context";
import { GlassButton, GlassCard } from "@/components/glass-ui";
import { CmsImage } from "@/components/cms-image";
import { CmsIconView } from "@/components/page-modules";
import { localize } from "@/lib/cms-content";
import { resolvePricingCopy, type PricingCopy } from "@/lib/pricing-cms";
import pricingStyles from "./pricing-page.module.css";
import { useState } from "react";
import { useLanguage } from "@/components/language-provider";
import {
  PLACEHOLDER_DOWNLOAD,
  PLACEHOLDER_SIGNUP,
} from "@/lib/i18n";

export function HomePage() {
  return (
    <main>
      <Hero />
      <Features />
      <Solutions />
      <Benefits />
      <Pricing />
      <Faq />
      <Cta />
      <Contact />
    </main>
  );
}

function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-slate-50">

      <div className="relative mx-auto grid grid-cols-1 max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
        <div className="min-w-0 animate-fade-up">
          <p className="text-sm font-semibold tracking-wide text-emerald-700">
            {t.hero.eyebrow}
          </p>
          <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-6xl">
            {t.hero.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            {t.hero.subtitle}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={PLACEHOLDER_SIGNUP}
              className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-800"
              title={t.hero.ctaNote}
            >
              {t.hero.cta}
            </a>
            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50"
            >
              {t.hero.secondary}
            </a>
          </div>
          <p className="mt-3 text-xs text-slate-500">{t.hero.ctaNote}</p>
        </div>

        <div className="min-w-0 animate-fade-up animation-delay-150">
          <ProductPlaceholder />
        </div>
      </div>
    </section>
  );
}

function ProductPlaceholder() {
  const { t } = useLanguage();
  return (
    <div className="product-placeholder flex min-h-80 flex-col items-center justify-center rounded-3xl border border-emerald-200 bg-emerald-50/50 px-6 py-12 text-center sm:min-h-96">
      <span className="mb-8 text-[10px] font-semibold tracking-[0.18em] text-emerald-800">{t.preview.label}</span>
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-100"><FeatureIcon index={2} /></div>
      <p className="text-xl font-semibold tracking-tight text-slate-900">{t.preview.title}</p>
      <p className="mt-3 max-w-xs text-sm leading-6 text-slate-600">{t.preview.note}</p>
    </div>
  );
}

export function Features() {
  const { t } = useLanguage();

  return (
    <section id="features" className="scroll-mt-24 bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={t.features.eyebrow}
          title={t.features.title}
          subtitle={t.features.subtitle}
        />
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {t.features.items.map((item, index) => (
            <article
              key={item.title}
              className="group min-w-0 rounded-3xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-900/5 sm:p-8"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 shadow-sm">
                <FeatureIcon index={index} />
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold text-slate-950">
                  {item.title}
                </h3>
                {"badge" in item && item.badge ? (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.body}</p>
              <div className="mt-7 flex min-h-32 items-center gap-4 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/50 p-5 text-emerald-800">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white" aria-hidden="true"><FeatureIcon index={index} /></span>
                <span className="text-xs leading-5">{t.preview.featureNote}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureIcon({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" d="M7 8h10M7 12h6M5 5h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H9l-4 3V6a1 1 0 0 1 1-1Z" />
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" d="M4 7h7M13 17h7M7 7l5 10M12 7l5 10" />
      </svg>
    );
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" d={index === 2 ? "M4 5h12v9H9l-5 4V5Zm14 4h3v12l-5-4h-3" : "M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM5 21v-3a7 7 0 0 1 14 0v3M9 17h6"} />
    </svg>
  );
}

export function Solutions() {
  const { t } = useLanguage();
  return (
    <section id="solutions" className="scroll-mt-24 border-y border-slate-200/70 bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow={t.solutions.eyebrow} title={t.solutions.title} subtitle={t.solutions.subtitle} />
        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {t.solutions.items.map((item, index) => (
            <article key={item.title} className="min-w-0 rounded-3xl border border-slate-200 bg-white p-7">
              <span className="text-xs font-semibold tracking-widest text-emerald-700">0{index + 1} / SEDAVEL</span>
              <h3 className="mt-8 text-xl font-semibold tracking-tight text-slate-950">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  const { t } = useLanguage();

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow={t.benefits.eyebrow} title={t.benefits.title} />
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {t.benefits.items.map((item, index) => (
            <article
              key={item.title}
              className="rounded-3xl bg-white p-7 ring-1 ring-slate-200"
            >
              <p className="text-sm font-semibold text-emerald-700">0{index + 1}</p>
              <h3 className="mt-3 text-xl font-semibold text-slate-950">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Pricing({ content, preview = false }: { content?: PricingCopy; preview?: boolean } = {}) {
  const { t, locale } = useLanguage();
  const copy = resolvePricingCopy(content, locale, t.pricing);
  const edit = useCmsEdit(), field = (path?: string) => preview ? edit(path) : undefined;

  return (
    <section id="pricing" className="scroll-mt-24 bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          editAttributes={{ eyebrow: content?.eyebrow[locale] ? field(`pricing.eyebrow.${locale}`) : undefined, title: content?.title[locale] ? field(`pricing.title.${locale}`) : undefined, subtitle: content?.introduction[locale] ? field(`pricing.introduction.${locale}`) : undefined }}
          eyebrow={copy.eyebrow}
          title={copy.title}
          subtitle={copy.subtitle}
        />
        {!!copy.benefits.length && <ul data-sanity={field(locale === "zh" ? "pricing.benefitsZh" : "pricing.benefitsEn")} className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm text-emerald-800">{copy.benefits.map((b, i) => <li key={i}>✓ {b}</li>)}</ul>}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {copy.plans.map((plan) => {
            const featured = plan.featured, source = content?.cards[plan.key], base = keyedPath("pricing.cards", source?.sourceKey);
            const cardField = (name: string) => base ? field(`${base}.${name}`) : undefined;
            return (
              <article key={plan.key} data-plan={plan.key} data-recommended={featured} className="min-w-0">
                <GlassCard className={`${pricingStyles.card} ${featured ? pricingStyles.featured : ""} h-full rounded-3xl p-7`}>
                {plan.icon && <CmsIconView icon={plan.icon} editPath={base ? `${base}.icon` : undefined}/>}
                {featured ? (
                  <p data-sanity={content?.featuredLabel[locale] ? field(`pricing.featuredLabel.${locale}`) : undefined} className="mb-4 inline-flex rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-100">
                    {copy.featured}
                  </p>
                ) : null}
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p data-sanity={source?.description[locale] ? cardField(`description.${locale}`) : undefined} className={`mt-2 text-sm ${featured ? "text-slate-300" : "text-slate-600"}`}>
                  {plan.description}
                </p>
                {plan.image && <figure data-sanity={cardField("image")} className="mt-5"><CmsImage key={plan.image.url} image={plan.image} style={{ maxHeight: 160, objectFit: "contain" }} />{localize(plan.image.caption, locale) && <figcaption data-sanity={cardField(locale === "zh" ? "image.captionZh" : "image.captionEn")} className={`mt-2 text-xs ${featured ? "text-slate-200" : "text-slate-600"}`}>{localize(plan.image.caption, locale)}</figcaption>}</figure>}
                <p className="mt-6 flex flex-wrap items-end gap-1">
                  <span className="text-4xl font-semibold tracking-tight">
                    {plan.price}
                  </span>
                  <span className={`mb-1 text-sm ${featured ? "text-slate-200" : "text-slate-500"}`}>
                    {copy.billed}
                  </span>
                </p>
                <p className={`mt-2 text-sm font-medium ${featured ? "text-emerald-200" : "text-emerald-700"}`}>
                  {plan.quota} {copy.characters}
                </p>
                <ul data-sanity={source?.[locale === "zh" ? "benefitsZh" : "benefitsEn"] ? cardField(locale === "zh" ? "benefitsZh" : "benefitsEn") : undefined} className={`mt-6 space-y-2 text-sm ${featured ? "text-slate-300" : "text-slate-600"}`}>
                  {plan.points.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span className={featured ? "text-emerald-300" : "text-emerald-600"}>✓</span>
                      {point}
                    </li>
                  ))}
                </ul>
                <GlassButton data-sanity={source?.buttonText[locale] ? cardField(`buttonText.${locale}`) : content?.buttonText[locale] ? field(`pricing.buttonText.${locale}`) : undefined} href="/register" className="mt-8 w-full">{plan.buttonText}</GlassButton>
                <p className={`mt-3 text-center text-xs ${featured ? "text-slate-200" : "text-slate-500"}`}>
                  {copy.placeholderNote}
                </p>
                </GlassCard>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(0);

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading eyebrow={t.faq.eyebrow} title={t.faq.title} />
        <div className="mt-10 space-y-3">
          {t.faq.items.map((item, index) => {
            const isOpen = open === index;
            return (
              <div
                key={item.q}
                className="rounded-2xl border border-slate-200 bg-white"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-slate-900"
                  onClick={() => setOpen(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                >
                  {item.q}
                  <span className="ml-4 text-lg text-slate-400">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen ? (
                  <p className="px-5 pb-5 text-sm leading-6 text-slate-600">
                    {item.a}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Cta() {
  const { t } = useLanguage();

  return (
    <section id="download" className="scroll-mt-24 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-3xl bg-emerald-900 px-6 py-14 text-center text-white shadow-xl sm:px-12">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {t.cta.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-emerald-50 sm:text-base">
            {t.cta.subtitle}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={PLACEHOLDER_SIGNUP}
              title={t.cta.signupNote}
              className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-700 transition hover:-translate-y-0.5"
            >
              {t.cta.signup}
            </a>
            <a
              href={PLACEHOLDER_DOWNLOAD}
              title={t.cta.downloadNote}
              className="inline-flex rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {t.cta.download}
            </a>
          </div>
          <p className="mt-4 text-xs text-emerald-100">
            {t.cta.signupNote} · {t.cta.downloadNote}
          </p>
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  const { t } = useLanguage();

  return (
    <section id="contact" className="scroll-mt-24 bg-white pb-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-12 sm:px-10">
          <p className="text-sm font-semibold text-emerald-700">{t.contact.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            {t.contact.title}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
            {t.contact.body}
          </p>
          <a
            href="#placeholder-contact"
            title={t.contact.note}
            className="mt-6 inline-flex rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            {t.contact.action}
          </a>
          <p className="mt-3 text-xs text-slate-500">{t.contact.note}</p>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({
  editAttributes,
  eyebrow,
  title,
  subtitle,
}: {
  editAttributes?: { eyebrow?: string; title?: string; subtitle?: string };
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p data-sanity={editAttributes?.eyebrow} className="text-sm font-semibold tracking-wide text-emerald-700">{eyebrow}</p>
      <h2 data-sanity={editAttributes?.title} className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p data-sanity={editAttributes?.subtitle} className="mt-4 text-base leading-7 text-slate-600">{subtitle}</p>
      ) : null}
    </div>
  );
}
