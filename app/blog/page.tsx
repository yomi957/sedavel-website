import type { Metadata } from "next";
import { BlogPage } from "@/components/resource-pages";
export const metadata: Metadata = { title: "Blog | Sedavel", description: "Sample guides on cross-border communication and multilingual customer support." };
export default function Page() { return <BlogPage />; }
