import { editorialPost } from "@/lib/blog-indexing";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { Suspense } from "react";
import { CmsBlogList } from "@/components/blog-cms";
import { getBlogContent } from "@/sanity/lib/blog";
export async function generateMetadata(): Promise<Metadata> { const data = await getBlogContent(); return pageMetadata("/blog", { title: "Blog | Sedavel", description: "Insights and practical guides for multilingual customer communication." }, data.posts.some(editorialPost)); }
async function Content() { const data = await getBlogContent(); return <CmsBlogList {...data}/>; }
export default function Page() { return <Suspense fallback={<CmsBlogList posts={[]} categories={[]} preview={false}/>}><Content/></Suspense>; }
