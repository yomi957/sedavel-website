"use client";
import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { VisualEditing } from "next-sanity/visual-editing";

/** Official Presentation mutations refresh server-rendered drafts without a browser token. */
export function HomePreviewRuntime() {
  const router = useRouter();
  const pending = useRef<{ timer: ReturnType<typeof setTimeout>; resolve: () => void } | null>(null);
  useEffect(() => () => { if (pending.current) { clearTimeout(pending.current.timer); pending.current.resolve(); } }, []);
  const refresh = useCallback(() => new Promise<void>(resolve => {
    if (pending.current) { clearTimeout(pending.current.timer); pending.current.resolve(); }
    pending.current = { timer: setTimeout(() => { pending.current = null; router.refresh(); resolve(); }, 300), resolve };
  }), [router]);
  return <VisualEditing refresh={refresh}/>;
}
