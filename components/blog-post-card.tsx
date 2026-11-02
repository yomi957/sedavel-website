"use client";
import Link from "next/link";
import type { ReactNode } from "react";
import { useLanguage } from "./language-provider";
import { CmsEditProvider, useCmsEdit } from "./cms-edit-context";
import { CmsImage } from "./cms-image";
import { localize } from "@/lib/cms-content";
import type { BlogPost } from "@/lib/blog-cms";
const card = "rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm";
export function PostProvider({ post, preview, children }: { post: BlogPost; preview: boolean; children: ReactNode }) { return <CmsEditProvider id={preview ? post.id : undefined} type="blogPost">{children}</CmsEditProvider>; }
export function PostCard({ post: p }: { post: BlogPost }) {
  const { locale } = useLanguage(), edit = useCmsEdit(), suffix = locale === "zh" ? "Zh" : "En";
  return <article data-blog-post={p.slug} className={`${card} flex min-w-0 flex-col`}>
    {p.cover && <div data-sanity={edit("coverImage")} className="mb-5"><CmsImage image={p.cover} sizes="(max-width: 767px) 100vw, 33vw" style={{ aspectRatio: "16/9", objectFit: "cover" }}/></div>}
    <p className="mb-3 text-sm font-semibold text-emerald-800">{localize(p.category?.title, locale, p.legacyCategory || "")}{p.featured && <span data-sanity={edit("featured")} className="ml-2 rounded-full bg-emerald-50 px-2 py-1">{locale === "zh" ? "推荐" : "Featured"}</span>}</p>
    <h2 data-sanity={edit(`title${suffix}`)} className="text-xl leading-8 font-semibold"><Link href={`/blog/${p.slug}`}>{localize(p.title, locale, "Sedavel Blog")}</Link></h2>
    <p data-sanity={edit(`summary${suffix}`)} className="mt-4 flex-1 text-sm leading-7 text-slate-600">{localize(p.summary, locale)}</p>
    {p.date && <time data-sanity={edit("publishedAt")} dateTime={p.date} className="mt-6 text-xs text-slate-500">{new Date(p.date).toISOString().slice(0, 10)}</time>}
    <Link href={`/blog/${p.slug}`} className="mt-5 font-semibold text-emerald-800">{locale === "zh" ? "阅读文章 →" : "Read article →"}</Link>
  </article>;
}
