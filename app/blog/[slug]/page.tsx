import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticle } from "@/components/resource-pages";
import { posts } from "@/lib/resources";
export function generateStaticParams() { return posts.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: {
    params: Promise<{
        slug: string;
    }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const post = posts.find(p => p.slug === slug);
    if (!post)
        return { title: "Article not found | Sedavel", robots: { index: false, follow: false } };
    return { title: `${post.title.en} | Sedavel Blog`, description: `Sample article: ${post.excerpt.en}`, robots: { index: false, follow: true }, openGraph: { title: post.title.en, description: post.excerpt.en, type: "article", publishedTime: post.date } };
}
export default async function Page({ params }: {
    params: Promise<{
        slug: string;
    }>;
}) { const { slug } = await params; if (!posts.some(p => p.slug === slug))
    notFound(); return <BlogArticle slug={slug}/>; }
