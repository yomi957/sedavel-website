/** Explicit public routes, not arbitrary redirect destinations. */
export const previewPages = [
  { path: "/", en: "Home · Hero drafts", zh: "首页 · Hero 草稿" },
  { path: "/features", en: "Features · Drafts", zh: "功能 · 草稿" },
  { path: "/pricing", en: "Pricing · Drafts", zh: "价格 · 草稿" },
  { path: "/download", en: "Download · Drafts", zh: "下载 · 草稿" },
  { path: "/referral", en: "Referral Rewards · Drafts", zh: "推广返现 · 草稿" },
  { path: "/help", en: "Help · Static content", zh: "帮助 · 静态内容" },
  { path: "/blog", en: "Blog · Drafts", zh: "博客 · 草稿" },
  { path: "/contact", en: "Contact · Static content", zh: "联系 · 静态内容" },
  { path: "/register", en: "Register · Static content", zh: "注册 · 静态内容" },
] as const;
export const localPreviewOrigin = "http://localhost:3000";
export const onlinePreviewOrigin = "https://preview.sedavel.com";
export function validatedPreviewOrigin(value: unknown): string | undefined {
  return value === localPreviewOrigin || value === onlinePreviewOrigin ? value : undefined;
}
export function safePreviewPath(value: string | null): string | undefined {
  if (!value) return "/";
  if (!value.startsWith("/") || value.startsWith("//") || /[\\%\s]/.test(value)) return;
  const u = new URL(value, localPreviewOrigin);
  if (u.origin !== localPreviewOrigin || !(previewPages.some(p => p.path === u.pathname) || /^\/blog\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(u.pathname))) return;
  for (const [key, v] of u.searchParams) {
    if (key === "previewLocale" && ["en", "zh"].includes(v)) continue;
    if (key === "sanity-preview-perspective" && ["drafts", "published"].includes(v)) continue;
    return;
  }
  return u.pathname + u.search;
}
export const trustedStudioOrigins = [localPreviewOrigin, "https://sedavel-cms.sanity.studio", "https://www.sanity.io"];
