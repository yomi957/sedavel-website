"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/components/language-provider";
export function PreviewControls({ configured }: { configured: boolean }) {
  const params = useSearchParams(), { setLocale } = useLanguage();
  const locale = params.get("previewLocale");
  useEffect(() => { if (locale === "en" || locale === "zh") setLocale(locale); }, [locale, setLocale]);
  return <aside aria-label="Draft preview" data-draft-preview style={{ position: "fixed", bottom: 16, left: 16, zIndex: 999, padding: "10px 16px", borderRadius: 16, background: "#14251a", color: "#fff", fontSize: 12, maxWidth: "calc(100vw - 32px)", boxShadow: "0 4px 18px #0003" }}>
    <span>{configured ? "Draft preview · 草稿预览（CMS 页面及公共设置）" : "Preview unavailable · 缺少服务端配置"}</span>{" · "}<a href="/api/draft-mode/disable" style={{ color: "#a5e8b6", textDecoration: "underline" }}>Exit / 退出</a>
  </aside>;
}
