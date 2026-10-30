"use client";
import { createContext, useContext, useEffect, Suspense, type ReactNode } from "react";
import { createDataAttribute } from "next-sanity";
import { projectId, dataset } from "@/sanity/env";
import { DefaultShareImage } from "@/components/default-share-image";
import type { SiteSettings } from "@/lib/site-settings-cms";
import { useLanguage } from "@/components/language-provider";
const Context = createContext<SiteSettings | null>(null);
const EditContext = createContext(false);
export function useSiteSettingsEdit() {
  const preview = useContext(EditContext);
  return (path?: string) => preview && path ? createDataAttribute({ projectId, dataset, id: "siteSettings", type: "siteSettings", path }).toString() : undefined;
}
export const useSiteSettings = () => useContext(Context);
export function SiteSettingsProvider({ settings, children, preview = false }: { settings: SiteSettings | null; children: ReactNode; preview?: boolean }) {
  const { initializeLocale } = useLanguage();
  useEffect(() => { if (settings?.defaultLanguage) initializeLocale(settings.defaultLanguage); }, [initializeLocale, settings?.defaultLanguage]);
  useEffect(() => {
    if (!settings?.favicon) return;
    const existing = [...document.head.querySelectorAll<HTMLLinkElement>('link[rel="icon"]')];
    existing.forEach(link => link.remove());
    const link = document.createElement("link"); link.rel = "icon"; link.href = settings.favicon.url; link.sizes = "any"; document.head.appendChild(link);
    return () => { link.remove(); existing.forEach(element => document.head.appendChild(element)); };
  }, [settings?.favicon]);
  return <EditContext.Provider value={preview}><Context.Provider value={settings}><Suspense fallback={null}><DefaultShareImage settings={settings}/></Suspense>{children}</Context.Provider></EditContext.Provider>;
}
