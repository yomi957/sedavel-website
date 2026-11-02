"use client";
import Link from "next/link";
import { useEffect, type ReactNode } from "react";
import { useLanguage } from "./language-provider";
import { keyedPath, useCmsEdit } from "./cms-edit-context";
import { CmsImage } from "./cms-image";
import { PageHero } from "./page-hero";
import { PostProvider, PostCard } from "./blog-post-card";
import { localize } from "@/lib/cms-content";
import { blogPostMetadata, type BlogBlock, type BlogPost } from "@/lib/blog-cms";
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
      {p.cover && <div data-sanity={edit("coverImage")}><CmsImage image={p.cover} eager sizes="(max-width: 767px) 100vw, 768px"/></div>}
      {!p.body[locale].length ? <p className="my-10 text-slate-500">{locale === "zh" ? "此语言的正文尚未提供。" : "Article content is not yet available in this language."}</p> : <RichBody blocks={p.body[locale]} field={`body${suffix}`}/>}
      <div className="mt-10 flex flex-wrap gap-2">{p.tags.map((tag, i) => <span data-sanity={edit(`tags[${i}].${locale}`)} key={i} className="rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-800">{localize(tag, locale)}</span>)}</div>
    </article>{!!related.length && <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6"><h2 className="mb-8 text-2xl font-semibold">{locale === "zh" ? "相关文章" : "Related articles"}</h2><div className="grid gap-6 md:grid-cols-2">{related.map(r => <PostProvider key={r.id} post={r} preview={preview}><PostCard post={r}/></PostProvider>)}</div></section>}
  </main>;
}
export function CmsBlogArticle(props: { post: BlogPost; related: BlogPost[]; preview: boolean }) { return <PostProvider post={props.post} preview={props.preview}><ArticleContent {...props}/></PostProvider>; }
