import type { Metadata } from "next";
import { Solutions } from "@/components/home-page";
import { PageIntro } from "@/components/page-intro";
export const metadata: Metadata = { title: "Solutions | Sedavel", description: "Explore Sedavel business scenarios." };
export default function Page() { return <main><PageIntro en="Solutions" zh="解决方案"/><Solutions /></main>; }
