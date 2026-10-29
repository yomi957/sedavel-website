import type { Metadata } from "next";
import { RegisterPage } from "@/components/register-page";

export const metadata: Metadata = {
  title: "Sign Up Free | Sedavel",
  description: "Preview Sedavel registration. Account creation is not connected yet; form submission is disabled.",
};

export default function Page() {
  return <RegisterPage />;
}
