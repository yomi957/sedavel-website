import { draftMode } from "next/headers";
import { previewConfigured } from "@/sanity/lib/preview-client";
import { PreviewControls } from "./preview-controls";
export async function PreviewStatus() {
  if (!(await draftMode()).isEnabled) return null;
  return <PreviewControls configured={previewConfigured}/>;
}
