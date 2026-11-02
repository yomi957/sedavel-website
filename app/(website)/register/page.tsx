import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { RegisterPage } from "@/components/register-page";
export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/register", {
    title: "Sign Up Free | Sedavel",
    description: "Preview Sedavel registration. Account creation is not connected yet; form submission is disabled.",
  });
}
export default function Page() { return <RegisterPage />; }
