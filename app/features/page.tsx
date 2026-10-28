import type { Metadata } from "next";
import { Features } from "@/components/home-page";
import { PageIntro } from "@/components/page-intro";
export const metadata: Metadata = { title: "Features | Sedavel", description: "Explore Sedavel translation, communication and customer management." };
export default function Page() { return <main><PageIntro en="Features" zh="功能"/><Features /></main>; }
