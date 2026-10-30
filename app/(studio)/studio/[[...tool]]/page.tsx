import { Suspense } from "react";
import { SanityStudio } from "@/components/sanity-studio";

export { metadata, viewport } from "next-sanity/studio";

// Cache Components replaces the old dynamic='force-static' segment option.
// Pre-render the Studio shell; nested tool paths are resolved by Sanity in the browser.
export function generateStaticParams() {
  return [{ tool: [] }];
}

export default function StudioPage() {
  return <Suspense fallback={<p>Loading Studio…</p>}><SanityStudio /></Suspense>;
}
