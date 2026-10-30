"use client";
import { usePresentationNavigate, usePresentationParams } from "sanity/presentation";
import { previewPages } from "@/lib/preview-policy";

export function PreviewNavigator() {
  const navigate = usePresentationNavigate(), params = usePresentationParams();
  const current = new URL(params.preview || "/", "http://localhost:3000");
  const locale = current.searchParams.get("previewLocale") === "zh" ? "zh" : "en";
  const change = (path: string, language: string) => navigate(`${path}?previewLocale=${language}`);
  return <div style={{ padding: 16, display: "grid", gap: 16, fontSize: 13 }}>
    <label style={{ display: "grid", gap: 8 }}>Page / 页面<select aria-label="Preview page" value={current.pathname} onChange={e => change(e.target.value, locale)} style={{ padding: 10, maxWidth: "100%" }}>{!previewPages.some(p => p.path === current.pathname) && <option value={current.pathname}>{current.pathname}</option>}{previewPages.map(p => <option key={p.path} value={p.path}>{p[locale]}</option>)}</select></label>
    <label style={{ display: "grid", gap: 8 }}>Language / 语言<select aria-label="Preview language" value={locale} onChange={e => change(current.pathname, e.target.value)} style={{ padding: 10 }}><option value="en">English</option><option value="zh">中文</option></select></label>
    <p style={{ lineHeight: 1.8 }}>Home Hero, Features, Pricing, Download, Referral, Blog and shared settings support drafts. Other page bodies remain static.<br/>首页 Hero、Features、Pricing、Download、推广返现、博客及公共设置支持草稿，其他页面主体仍为静态内容。</p>
  </div>;
}
