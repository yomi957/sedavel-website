import { siteConfiguration } from "./lib/site-url";
import type { NextConfig } from "next";
import { dataset, isSanityConfigured, projectId } from "./sanity/env";

const site = siteConfiguration();
const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  // Keep production SEO/404 metadata blocking. Next 16.4.3's development
  // static-shell validator misclassifies this app's uncached blocking metadata.
  // Use the framework's default metadata streaming in development instead.
  htmlLimitedBots: process.env.NODE_ENV === "production" ? /.*/ : undefined,
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
