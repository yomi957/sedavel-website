import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { HelpPage } from "@/components/resource-pages";
export async function generateMetadata(): Promise<Metadata> { return pageMetadata("/help", { title: "Help Center | Sedavel", description: "Search local guides for installation, accounts, translation and character credits." }); }
export default function Page() { return <HelpPage />; }
