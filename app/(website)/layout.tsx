import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { PreviewStatus } from "@/components/preview-status";
import { Geist, Geist_Mono } from "next/font/google";
import { LanguageProvider } from "@/components/language-provider";
import { Suspense } from "react";
import { PublishedSiteChrome, SiteChrome } from "@/components/site-chrome";
import { getPublishedSiteSettings } from "@/sanity/lib/public-content";
import { resolveDefaultSeo, defaultOpenGraph } from "@/lib/site-settings-cms";
import { homeDefaultSeo } from "@/lib/home-cms";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublishedSiteSettings();
  return { ...resolveDefaultSeo(settings, "en", homeDefaultSeo), openGraph: defaultOpenGraph(settings, "en"), ...((await draftMode()).isEnabled ? { robots: { index: false, follow: false } } : {}) };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      style={{ colorScheme: "light" }}
    >
      <body className="min-h-full flex flex-col bg-slate-50 font-sans text-slate-900">
        <LanguageProvider>
          <Suspense fallback={<SiteChrome settings={null}>{children}</SiteChrome>}>
            <PublishedSiteChrome>{children}</PublishedSiteChrome>
          </Suspense>
          <Suspense fallback={null}><PreviewStatus/></Suspense>
        </LanguageProvider>
      </body>
    </html>
  );
}
