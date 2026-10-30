import { homeLive } from "@/sanity/lib/live";
import { HomePreviewRuntime } from "./home-preview-runtime";
/** One connection/overlay for the whole authorized website, including shared chrome. */
export function SitePreviewRuntime() {
  const Live = homeLive?.SanityLive;
  return <><HomePreviewRuntime/>{Live && <Live includeDrafts={false} action="refresh"/>}</>;
}
