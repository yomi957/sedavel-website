import { cookies, draftMode } from "next/headers";
import { NextResponse } from "next/server";
export async function GET(request: Request) {
  (await draftMode()).disable();
  const jar = await cookies();
  const partitioned = process.env.NODE_ENV === "production" && jar.has("sanity-preview-partitioned");
  for (const name of ["__prerender_bypass", "sanity-preview-perspective", "sanity-preview-variant", "sanity-preview-partitioned"]) {
    // Clear the current top-level or partitioned iframe session; leave login cookies alone.
    jar.set(name, "", { path: "/", maxAge: 0, httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", partitioned });
  }
  const result = NextResponse.redirect(new URL("/", request.url));
  result.headers.set("Cache-Control", "private, no-store"); result.headers.set("X-Robots-Tag", "noindex, nofollow");
  return result;
}
