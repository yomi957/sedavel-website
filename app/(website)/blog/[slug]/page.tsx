import { pageMetadata } from "@/lib/seo";
import { editorialPost } from "@/lib/blog-indexing";
import type { Metadata } from "next";
import { cache, Suspense } from "react";
import { notFound } from "next/navigation";
import { BlogArticle } from "@/components/resource-pages";
import { CmsBlogArticle } from "@/components/blog-article";
import { posts } from "@/lib/resources";
import { blogPostMetadata, validBlogSlug } from "@/lib/blog-cms";
import { getBlogContent } from "@/sanity/lib/blog";
type Props = { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };
// Only existing examples are prebuilt; new CMS slugs remain available at request time.
export function generateStaticParams() { return posts.map(({ slug }) => ({ slug })); }
// Metadata is blocking in this project. Resolve the same authorized article before
// Next commits the streaming shell, so missing articles retain a real HTTP 404.
const getArticle = cache(async (slug: string) => {
  if (!validBlogSlug(slug)) notFound();
  const data = await getBlogContent();
  const post = data.posts.find(p => p.slug === slug);
  if (post) return { kind: "cms" as const, data, post };
  const sample = posts.find(p => p.slug === slug);
  if (sample) return { kind: "sample" as const, sample };
  notFound();
});
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const article = await getArticle((await params).slug);
  const locale = (await searchParams).previewLocale === "zh" ? "zh" : "en";
  if (article.kind === "cms") {
    const { post, data } = article;
    const meta = blogPostMetadata(post, locale, data.preview);
    return pageMetadata(`/blog/${post.slug}`, { ...meta, openGraph: { ...meta.openGraph, locale: locale === "zh" ? "zh_CN" : "en_US" } }, editorialPost(post));
  }
  const { sample } = article;
  return pageMetadata(`/blog/${sample.slug}`, { title: `${sample.title[locale]} | Sedavel Blog`, description: `Sample article: ${sample.excerpt[locale]}`, robots: { index: false, follow: true } }, false);
}
async function Content({ params }: Pick<Props, "params">) {
  const article = await getArticle((await params).slug);
  if (article.kind === "cms") {
    const { post, data } = article;
    const related = data.posts.filter(p => p.id !== post.id).toSorted((a, b) => Number(b.category?.id === post.category?.id) - Number(a.category?.id === post.category?.id)).slice(0, 2);
    return <CmsBlogArticle post={post} related={related} preview={data.preview}/>;
  }
  return <BlogArticle slug={article.sample.slug}/>;
}
export default function Page({ params }: Props) { return <Suspense fallback={<main className="mx-auto min-h-screen max-w-3xl p-12" aria-busy="true">Sedavel Blog…</main>}><Content params={params}/></Suspense>; }
