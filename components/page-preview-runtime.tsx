import type { ReactNode } from "react";
import { CmsEditProvider } from "./cms-edit-context";
/** Shared website runtime lives in SiteChrome; this boundary only selects a page document. */
export function PagePreviewRuntime({ id, children }: { id: string; children: ReactNode }) {
  return <CmsEditProvider id={id} type="websitePage">{children}</CmsEditProvider>;
}
