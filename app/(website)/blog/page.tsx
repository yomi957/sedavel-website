import type { Metadata } from "next";
import { Suspense } from "react";
import { CmsBlogList } from "@/components/blog-cms";
import { getBlogContent } from "@/sanity/lib/blog";
export const metadata: Metadata = { title: "Blog | Sedavel", description: "Insights and practical guides for multilingual customer communication." };
async function Content() { const data = await getBlogContent(); return <CmsBlogList {...data}/>; }
export default function Page() { return <Suspense fallback={<CmsBlogList posts={[]} categories={[]} preview={false}/>}><Content/></Suspense>; }
