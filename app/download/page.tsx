import type { Metadata } from "next";
import { Cta } from "@/components/home-page";
import { PageIntro } from "@/components/page-intro";
export const metadata: Metadata = { title: "Download Sedavel | Sedavel", description: "Find the current Sedavel download entry and availability information." };
export default function Page() { return <main><PageIntro en="Download Sedavel" zh="下载 Sedavel"/><Cta /></main>; }
