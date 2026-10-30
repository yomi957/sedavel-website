import type { Metadata, ResolvingMetadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BlogArticle } from "@/components/resource-pages";
import { CmsBlogArticle } from "@/components/blog-cms";
import { posts } from "@/lib/resources";
import { blogPostMetadata, validBlogSlug } from "@/lib/blog-cms";
import { getBlogContent } from "@/sanity/lib/blog";
type Props = { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };
// Only existing examples are prebuilt; new CMS slugs remain available at request time.
export function generateStaticParams() { return posts.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params; if (!validBlogSlug(slug)) return { title: "Article not found | Sedavel", robots: { index: false, follow: false } };
  const data = await getBlogContent(), post = data.posts.find(p => p.slug === slug);
  const locale = (await searchParams).previewLocale === "zh" ? "zh" : "en";
  if (post) { const meta = blogPostMetadata(post, locale, data.preview); return { ...meta, openGraph: { ...meta.openGraph, images: post.seo.image || post.cover ? meta.openGraph?.images : (await parent).openGraph?.images } }; }
  const sample = posts.find(p => p.slug === slug);
  return sample ? { title: `${sample.title[locale]} | Sedavel Blog`, description: `Sample article: ${sample.excerpt[locale]}`, robots: { index: false, follow: true } } : { title: "Article not found | Sedavel", robots: { index: false, follow: false } };
}
async function Content({ params }: Pick<Props, "params">) {
  const { slug } = await params; if (!validBlogSlug(slug)) notFound();
  const data = await getBlogContent(), post = data.posts.find(p => p.slug === slug);
  if (post) { const related = data.posts.filter(p => p.id !== post.id).toSorted((a, b) => Number(b.category?.id === post.category?.id) - Number(a.category?.id === post.category?.id)).slice(0, 2); return <CmsBlogArticle post={post} related={related} preview={data.preview}/>; }
  if (posts.some(p => p.slug === slug)) return <BlogArticle slug={slug}/>;
  notFound();
}
export default function Page({ params }: Props) { return <Suspense fallback={<main className="mx-auto max-w-3xl p-12" aria-busy="true">Sedavel Blog…</main>}><Content params={params}/></Suspense>; }
