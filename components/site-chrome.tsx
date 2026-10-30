import { draftMode } from "next/headers";
import { getSiteSettingsPreview } from "@/sanity/lib/page-preview";
import { homeLive } from "@/sanity/lib/live";
import { SitePreviewRuntime } from "./site-preview-runtime";
import type { ReactNode } from "react";
import type { SiteSettings } from "@/lib/site-settings-cms";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SiteSettingsProvider } from "@/components/site-settings-provider";
import { getPublishedSiteSettings } from "@/sanity/lib/public-content";
export function SiteChrome({ children, settings, preview = false }: { children: ReactNode; settings: SiteSettings | null; preview?: boolean }) {
  return <SiteSettingsProvider settings={settings} preview={preview}><SiteHeader/><div className="flex-1">{children}</div><SiteFooter/></SiteSettingsProvider>;
}
export async function PublishedSiteChrome({ children }: { children: ReactNode }) {
  const [published, draft] = await Promise.all([getPublishedSiteSettings(), getSiteSettingsPreview()]);
  const preview = (await draftMode()).isEnabled && !!homeLive;
  return <><SiteChrome settings={draft?.content ?? published} preview={preview}>{children}</SiteChrome>{preview && <SitePreviewRuntime/>}</>;
}
