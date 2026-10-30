import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { localPreviewOrigin, onlinePreviewOrigin, safePreviewPath, trustedStudioOrigins } from "@/lib/preview-policy";
import { previewClient } from "@/sanity/lib/preview-client";

const response = (status: number, message: string) => new Response(message, { status, headers: { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow", "Referrer-Policy": "no-referrer" } });
export async function GET(request: Request) {
  const url = new URL(request.url);
  if (![localPreviewOrigin, onlinePreviewOrigin].includes(url.origin)) return response(403, "Preview origin not allowed");
  const source = request.headers.get("origin") || request.headers.get("referer");
  if (source) { try { if (!trustedStudioOrigins.includes(new URL(source).origin)) return response(403, "Studio origin not allowed"); } catch { return response(403, "Invalid origin"); } }
  if (!safePreviewPath(url.searchParams.get("sanity-preview-pathname"))) return response(400, "Invalid preview destination");
  if (!url.searchParams.get("sanity-preview-secret")) return response(401, "Preview authorization required");
  if (!previewClient) return response(503, "Preview is not configured");
  // Only this official, Sanity-validated handshake can enable the cookie.
  return defineEnableDraftMode({ client: previewClient }).GET(request);
}
