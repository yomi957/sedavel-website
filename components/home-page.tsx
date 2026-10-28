"use client";

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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_42%),radial-gradient(circle_at_left,rgba(37,99,235,0.12),transparent_36%)]" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
        <div className="animate-fade-up">
          <p className="text-sm font-semibold tracking-wide text-blue-700">
            {t.hero.eyebrow}
          </p>
          <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            {t.hero.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            {t.hero.subtitle}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={PLACEHOLDER_SIGNUP}
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
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

        <div className="animate-fade-up animation-delay-150">
          <ConceptualWorkspace label={t.conceptual} />
        </div>
      </div>
    </section>
  );
}

function ConceptualWorkspace({ label }: { label: string }) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-xl shadow-blue-900/5 ring-1 ring-blue-100 backdrop-blur">
      <div className="rounded-2xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-5">
        <div className="mb-4 flex gap-2">
          {["Account A", "Account B", "Account C"].map((account, index) => (
            <span
              key={account}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                index === 0
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-600 ring-1 ring-slate-200"
              }`}
            >
              {account}
            </span>
          ))}
        </div>
        <div className="space-y-3">
          <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-white px-4 py-3 text-sm text-slate-700 shadow-sm ring-1 ring-slate-100">
            Incoming message
            <span className="mt-1 block text-xs text-blue-700">
              Translated in real time
            </span>
          </div>
          <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-md bg-blue-600 px-4 py-3 text-sm text-white shadow-sm">
            Reply from one workspace
          </div>
          <div className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
            AI Quick Replies · Coming Soon
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-slate-500">{label}</p>
    </div>
  );
}

function Features() {
  const { t } = useLanguage();

  return (
    <section id="features" className="scroll-mt-24 bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={t.features.eyebrow}
          title={t.features.title}
          subtitle={t.features.subtitle}
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {t.features.items.map((item, index) => (
            <article
              key={item.title}
              className="group rounded-3xl border border-slate-200 bg-slate-50/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-lg hover:shadow-blue-900/5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-500 text-white shadow-sm">
                <FeatureIcon index={index} />
              </div>
              <div className="mt-5 flex items-center gap-2">
                <h3 className="text-lg font-semibold text-slate-950">
                  {item.title}
                </h3>
                {"badge" in item && item.badge ? (
                  <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-indigo-700">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.body}</p>
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
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" d="M12 5v2M8 8h8M7 12h10M9 16h6M12 19v-2" />
    </svg>
  );
}

function Benefits() {
  const { t } = useLanguage();

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow={t.benefits.eyebrow} title={t.benefits.title} />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {t.benefits.items.map((item, index) => (
            <article
              key={item.title}
              className="rounded-3xl bg-white p-7 ring-1 ring-slate-200"
            >
              <p className="text-sm font-semibold text-blue-700">0{index + 1}</p>
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

function Pricing() {
  const { t } = useLanguage();

  return (
    <section id="pricing" className="scroll-mt-24 bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={t.pricing.eyebrow}
          title={t.pricing.title}
          subtitle={t.pricing.subtitle}
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {t.pricing.plans.map((plan, index) => {
            const featured = index === 1;
            return (
              <article
                key={plan.name}
                className={`rounded-3xl p-7 transition hover:-translate-y-1 ${
                  featured
                    ? "bg-slate-950 text-white shadow-xl shadow-blue-900/20"
                    : "border border-slate-200 bg-white"
                }`}
              >
                {featured ? (
                  <p className="mb-4 inline-flex rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-100">
                    {t.pricing.featured}
                  </p>
                ) : null}
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className={`mt-2 text-sm ${featured ? "text-slate-300" : "text-slate-600"}`}>
                  {plan.description}
                </p>
                <p className="mt-6 flex items-end gap-1">
                  <span className="text-4xl font-semibold tracking-tight">
                    {plan.price}
                  </span>
                  <span className={`mb-1 text-sm ${featured ? "text-slate-400" : "text-slate-500"}`}>
                    {t.pricing.billed}
                  </span>
                </p>
                <p className={`mt-2 text-sm font-medium ${featured ? "text-blue-200" : "text-blue-700"}`}>
                  {plan.quota} {t.pricing.characters}
                </p>
                <ul className={`mt-6 space-y-2 text-sm ${featured ? "text-slate-300" : "text-slate-600"}`}>
                  {plan.points.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span className={featured ? "text-blue-300" : "text-blue-600"}>✓</span>
                      {point}
                    </li>
                  ))}
                </ul>
                <a
                  href={PLACEHOLDER_SIGNUP}
                  title={t.pricing.placeholderNote}
                  className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-4 py-3 text-sm font-semibold transition ${
                    featured
                      ? "bg-blue-500 text-white hover:bg-blue-400"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {t.pricing.cta}
                </a>
                <p className={`mt-3 text-center text-xs ${featured ? "text-slate-400" : "text-slate-500"}`}>
                  {t.pricing.placeholderNote}
                </p>
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

function Cta() {
  const { t } = useLanguage();

  return (
    <section id="download" className="scroll-mt-24 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-500 px-6 py-14 text-center text-white shadow-xl sm:px-12">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {t.cta.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-blue-50 sm:text-base">
            {t.cta.subtitle}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={PLACEHOLDER_SIGNUP}
              title={t.cta.signupNote}
              className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-700 transition hover:-translate-y-0.5"
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
          <p className="mt-4 text-xs text-blue-100">
            {t.cta.signupNote} · {t.cta.downloadNote}
          </p>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const { t } = useLanguage();

  return (
    <section id="contact" className="scroll-mt-24 bg-white pb-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-12 sm:px-10">
          <p className="text-sm font-semibold text-blue-700">{t.contact.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            {t.contact.title}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
            {t.contact.body}
          </p>
          <a
            href="#placeholder-contact"
            title={t.contact.note}
            className="mt-6 inline-flex rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
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
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-semibold tracking-wide text-blue-700">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-4 text-base leading-7 text-slate-600">{subtitle}</p>
      ) : null}
    </div>
  );
}
