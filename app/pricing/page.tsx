import type { Metadata } from "next";
import { Pricing } from "@/components/home-page";
import { PageIntro } from "@/components/page-intro";
export const metadata: Metadata = { title: "Pricing | Sedavel", description: "View the existing Sedavel character quota plans." };
export default function Page() { return <main><PageIntro en="Pricing" zh="价格"/><Pricing /></main>; }
