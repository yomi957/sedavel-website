import { siteConfiguration } from "./lib/site-url";
import type { NextConfig } from "next";
import { dataset, isSanityConfigured, projectId } from "./sanity/env";

const site = siteConfiguration();
const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  // Keep SEO in the initial head for browsers and HTML-only consumers alike.
  // This waits for metadata queries; page content can still stream afterwards.
  htmlLimitedBots: /.*/,
  cacheComponents: true,
  partialPrefetching: true,
  async headers() {
    return [...(!site.indexable ? [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }] : []), { source: "/:path*", has: [{ type: "cookie", key: "__prerender_bypass" }], headers: [{ key: "Content-Security-Policy", value: "frame-ancestors 'self' http://localhost:3000 https://sedavel-cms.sanity.studio https://www.sanity.io" }, { key: "X-Robots-Tag", value: "noindex, nofollow" }, { key: "Referrer-Policy", value: "no-referrer" }] }, { source: "/api/draft-mode/:path*", headers: [{ key: "Cache-Control", value: "private, no-store" }, { key: "X-Robots-Tag", value: "noindex, nofollow" }, { key: "Referrer-Policy", value: "no-referrer" }] }];
  },
  images: {
    remotePatterns: isSanityConfigured ? [{
      protocol: "https",
      hostname: "cdn.sanity.io",
      pathname: `/images/${projectId}/${dataset}/**`,
    }] : [],
  },
};

export default nextConfig;
