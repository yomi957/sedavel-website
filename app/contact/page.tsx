import type { Metadata } from "next";
import { Contact } from "@/components/home-page";
import { PageIntro } from "@/components/page-intro";
export const metadata: Metadata = { title: "Contact us | Sedavel", description: "Contact and support information for Sedavel." };
export default function Page() { return <main><PageIntro en="Contact us" zh="联系我们"/><Contact /></main>; }
