import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { Contact } from "@/components/home-page";
import { PageHero } from "@/components/page-hero";
export async function generateMetadata(): Promise<Metadata> { return pageMetadata("/contact", { title: "Contact us | Sedavel", description: "Contact and support information for Sedavel." }); }
export default function Page() { return <main><PageHero en="Contact us" zh="联系我们"/><Contact /></main>; }
