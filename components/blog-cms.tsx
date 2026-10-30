"use client";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { useLanguage } from "./language-provider";
import { CmsEditProvider, keyedPath, useCmsEdit } from "./cms-edit-context";
import { CmsImage } from "./cms-image";
import { PageHero } from "./page-hero";
import { GlassButton } from "./glass-ui";
import { posts as samplePosts } from "@/lib/resources";
import { localize } from "@/lib/cms-content";
import { blogPostMetadata, type BlogBlock, type BlogCategory, type BlogPost } from "@/lib/blog-cms";
const card = "rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm";
function PostProvider({ post, preview, children }: { post: BlogPost; preview: boolean; children: ReactNode }) { return <CmsEditProvider id={preview ? post.id : undefined} type="blogPost">{children}</CmsEditProvider>; }
function PostCard({ post: p }: { post: BlogPost }) {
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
function InlineText({ block }: { block: BlogBlock }) {
  return block.spans.map(span => { let node: ReactNode = span.text; for (const mark of span.marks) { if (mark === "strong") node = <strong>{node}</strong>; else if (mark === "em") node = <em>{node}</em>; else if (Object.hasOwn(block.links, mark)) node = <a className="text-emerald-800 underline underline-offset-4" href={block.links[mark]} rel="noopener noreferrer">{node}</a>; } return <span key={span.key}>{node}</span>; });
}
function RichBody({ blocks, field }: { blocks: BlogBlock[]; field: string }) {
  const edit = useCmsEdit();
  const rows: ReactNode[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i], path = keyedPath(field, b.key), mapping = edit(path);
    if (b.type === "image" && b.image) { rows.push(<figure key={b.key} data-sanity={mapping} className="my-10"><CmsImage image={b.image}/><Caption block={b}/></figure>); continue; }
    if (b.list) { const list: ReactNode[] = []; const kind = b.list; for (; i < blocks.length && blocks[i].type === "text" && blocks[i].list === kind; i++) { const v = blocks[i]; list.push(<li key={v.key} data-sanity={edit(keyedPath(field, v.key))} style={{ marginInlineStart: `${(v.level - 1) * 16}px` }}><InlineText block={v}/></li>); } i--; rows.push(kind === "number" ? <ol key={b.key} className="my-6 list-decimal space-y-2 pl-6">{list}</ol> : <ul key={b.key} className="my-6 list-disc space-y-2 pl-6">{list}</ul>); continue; }
    const content = <InlineText block={b}/>;
    rows.push(b.style === "h2" ? <h2 key={b.key} data-sanity={mapping} className="mt-12 mb-5 text-2xl font-semibold text-[#14251A]">{content}</h2> : b.style === "h3" ? <h3 key={b.key} data-sanity={mapping} className="mt-8 mb-4 text-xl font-semibold">{content}</h3> : b.style === "blockquote" ? <blockquote key={b.key} data-sanity={mapping} className="my-8 border-l-4 border-emerald-300 pl-6 italic">{content}</blockquote> : <p key={b.key} data-sanity={mapping} className="my-6 whitespace-pre-wrap">{content}</p>);
  }
  return <div className="min-w-0 text-base leading-8 text-slate-700 [overflow-wrap:anywhere]">{rows}</div>;
}
function Caption({ block }: { block: BlogBlock }) { const { locale } = useLanguage(); return block.image?.caption[locale] ? <figcaption className="mt-3 text-center text-sm text-slate-500">{block.image.caption[locale]}</figcaption> : null; }
function ArticleContent({ post: p, related, preview }: { post: BlogPost; related: BlogPost[]; preview: boolean }) {
  const { locale } = useLanguage(), edit = useCmsEdit(), suffix = locale === "zh" ? "Zh" : "En";
  useEffect(() => { const meta = blogPostMetadata(p, locale, preview); document.title = String(meta.title); document.querySelector('meta[name="description"]')?.setAttribute("content", String(meta.description)); }, [p, locale, preview]);
  return <main data-blog-article={p.slug}><PageHero compact backgroundWord="" en={p.title.en || "Sedavel Blog"} zh={p.title.zh || "Sedavel 博客"} description={{ en: p.summary.en || "", zh: p.summary.zh || "" }} titleEditPath={`title${suffix}`} descriptionEditPath={`summary${suffix}`}/>
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6"><Link className="font-semibold text-emerald-800" href="/blog">{locale === "zh" ? "← 返回博客" : "← Back to blog"}</Link>
      <div className="my-6 flex flex-wrap items-center gap-3 text-sm text-slate-500">{p.authorImage && <span data-sanity={edit("author.image")} className="w-10"><CmsImage image={p.authorImage}/></span>}<span data-sanity={p.author[locale] ? edit(`author.name.${locale}`) : undefined}>{localize(p.author, locale)}</span>{p.date && <time data-sanity={edit("publishedAt")} dateTime={p.date}>{new Date(p.date).toISOString().slice(0, 10)}</time>}<span>{localize(p.category?.title, locale, p.legacyCategory || "")}</span></div>
      {p.cover && <div data-sanity={edit("coverImage")}><CmsImage image={p.cover} sizes="(max-width: 767px) 100vw, 768px"/></div>}
      {!p.body[locale].length ? <p className="my-10 text-slate-500">{locale === "zh" ? "此语言的正文尚未提供。" : "Article content is not yet available in this language."}</p> : <RichBody blocks={p.body[locale]} field={`body${suffix}`}/>}
      <div className="mt-10 flex flex-wrap gap-2">{p.tags.map((tag, i) => <span data-sanity={edit(`tags[${i}].${locale}`)} key={i} className="rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-800">{localize(tag, locale)}</span>)}</div>
    </article>{!!related.length && <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6"><h2 className="mb-8 text-2xl font-semibold">{locale === "zh" ? "相关文章" : "Related articles"}</h2><div className="grid gap-6 md:grid-cols-2">{related.map(r => <PostProvider key={r.id} post={r} preview={preview}><PostCard post={r}/></PostProvider>)}</div></section>}
  </main>;
}
export function CmsBlogArticle(props: { post: BlogPost; related: BlogPost[]; preview: boolean }) { return <PostProvider post={props.post} preview={props.preview}><ArticleContent {...props}/></PostProvider>; }
