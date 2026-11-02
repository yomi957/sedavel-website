"use client";
import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "./language-provider";
import { PostProvider, PostCard } from "./blog-post-card";
import { PageHero } from "./page-hero";
import { GlassButton } from "./glass-ui";
import { posts as samplePosts } from "@/lib/resources";
import { localize } from "@/lib/cms-content";
import { type BlogCategory, type BlogPost } from "@/lib/blog-cms";
const card = "rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm";
export function CmsBlogList({ posts, categories, preview }: { posts: BlogPost[]; categories: BlogCategory[]; preview: boolean }) {
  const { locale } = useLanguage(), zh = locale === "zh";
  const [category, setCategory] = useState("all"), [count, setCount] = useState(9), [samples, setSamples] = useState(false);
  const choices = categories.filter(c => posts.some(p => p.category?.id === c.id));
  const filtered = posts.filter(p => category === "all" || p.category?.id === category).toSorted((a, b) => Number(b.featured) - Number(a.featured));
  return <main><PageHero en="Conversations, ideas & guides." zh="沟通、灵感与实践指南。" description={{ en: "Insights and practical guides for multilingual customer communication.", zh: "分享多语言客户沟通的洞察与实践指南。" }}/><div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
    <div role="group" aria-label={zh ? "文章分类" : "Article categories"} className="mb-10 flex flex-wrap gap-2">{[{ id: "all", title: { en: "All articles", zh: "全部文章" } }, ...choices].map(c => <GlassButton key={c.id} variant={category === c.id ? "primary" : "neutral"} aria-pressed={category === c.id} onClick={() => { setCategory(c.id); setCount(9); }}>{localize(c.title, locale)}</GlassButton>)}</div>
    {!!filtered.length && <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{filtered.slice(0, count).map(p => <PostProvider key={p.id} post={p} preview={preview}><PostCard post={p}/></PostProvider>)}</div>}
    {!filtered.length && <p role="status" className={`${card} text-slate-600`}>{zh ? "暂无正式发布的文章。" : "No published articles yet."}</p>}
    {filtered.length > count && <div className="mt-8 text-center"><GlassButton onClick={() => setCount(n => n + 9)}>{zh ? "加载更多" : "Load more"}</GlassButton></div>}
    <div className="mt-12 border-t border-emerald-100 pt-8"><p className="mb-4 text-sm text-slate-500">{zh ? "原有演示文章保留用于排版参考，不属于正式发布内容。" : "Original sample articles remain available for layout reference and are not official publications."}</p><GlassButton variant="neutral" aria-expanded={samples} onClick={() => setSamples(v => !v)}>{zh ? "查看演示文章" : "View sample articles"}</GlassButton>{samples && <div className="mt-8"><div className="grid gap-6 md:grid-cols-2">{samplePosts.map(p => <article key={p.slug} className={card}><p className="mb-3 text-sm text-slate-500">{zh ? "示例文章" : "Sample article"}</p><h2 className="text-xl font-semibold"><Link href={`/blog/${p.slug}`}>{p.title[locale]}</Link></h2><p className="mt-4 text-slate-600">{p.excerpt[locale]}</p></article>)}</div></div>}</div>
  </div></main>;
}
