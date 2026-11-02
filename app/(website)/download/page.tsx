import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { getDownloadPreview } from "@/sanity/lib/page-preview";
import { PagePreviewRuntime } from "@/components/page-preview-runtime";
import { Suspense } from "react";
import { DownloadPage } from "@/components/download-page";
import { getPublishedDownloadPage } from "@/sanity/lib/public-content";
import { downloadPageMetadata } from "@/lib/download-cms";
export async function generateMetadata({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }): Promise<Metadata> {
  const [published, preview] = await Promise.all([getPublishedDownloadPage(), getDownloadPreview()]);
  const locale = preview && (await searchParams).previewLocale === "zh" ? "zh" : "en";
  return pageMetadata("/download", downloadPageMetadata(preview?.content ?? published, locale));
}
async function PublishedDownload() {
  const content = await getPublishedDownloadPage(), preview = await getDownloadPreview();
  if (!preview) return <DownloadPage content={content}/>;
  return <PagePreviewRuntime id="page-download"><DownloadPage content={preview.content ?? content}/></PagePreviewRuntime>;
}
export default function Page() { return <Suspense fallback={<DownloadPage/>}><PublishedDownload/></Suspense>; }
