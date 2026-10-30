import { defineDocuments, defineLocations, presentationTool } from "sanity/presentation";
import { localPreviewOrigin, validatedPreviewOrigin } from "@/lib/preview-policy";
import { PreviewNavigator } from "./navigator";

// Never turn an unconfigured standalone Studio into a team preview of localhost.
const origin = validatedPreviewOrigin(process.env.SANITY_STUDIO_PREVIEW_ORIGIN);
const standalone = process.env.SANITY_STUDIO_BASEPATH === "/";
export const presentationPlugin = !standalone || origin ? presentationTool({
  title: "Presentation / 可视化预览",
  allowOrigins: [origin || localPreviewOrigin],
  previewUrl: { initial: `${origin || localPreviewOrigin}/?previewLocale=en`, previewMode: { enable: "/api/draft-mode/enable", shareAccess: false } },
  resolve: {
    mainDocuments: defineDocuments([{ route: "/blog/:slug", filter: '_type == "blogPost" && slug.current == $slug' },{ route: "/", filter: '_type == "homePage" && _id == "homePage"' }, { route: "/features", filter: '_type == "websitePage" && _id == "page-features"' }, { route: "/pricing", filter: '_type == "websitePage" && _id == "page-pricing"' }, { route: "/download", filter: '_type == "websitePage" && _id == "page-download"' }, { route: "/referral", filter: '_type == "websitePage" && _id == "page-referral"' }]),
    locations: { blogPost: defineLocations({ select: { slug: "slug.current", title: "titleEn" }, resolve: doc => doc && typeof doc.slug === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(doc.slug) ? { locations: [{ title: `${doc.title || "Article"} · English`, href: `/blog/${doc.slug}?previewLocale=en` }, { title: "文章 · 中文", href: `/blog/${doc.slug}?previewLocale=zh` }, { title: "Blog list / 博客列表", href: "/blog?previewLocale=en" }] } : null }), blogCategory: defineLocations({ locations: [{ title: "Blog / 博客列表", href: "/blog?previewLocale=en" }] }), siteSettings: defineLocations({ locations: [{ title: "Shared website content / 全站公共内容", href: "/?previewLocale=en" }, { title: "全站公共内容 / 中文", href: "/?previewLocale=zh" }] }), homePage: defineLocations({ locations: [{ title: "Home Hero / 首页主视觉", href: "/?previewLocale=en" }, { title: "首页主视觉 / 中文", href: "/?previewLocale=zh" }] }), websitePage: defineLocations({ select: { pageKey: "pageKey" }, resolve: doc => doc && ["features", "pricing", "download", "referral"].includes(doc.pageKey) ? { locations: [{ title: `${doc.pageKey} · English`, href: `/${doc.pageKey}?previewLocale=en` }, { title: `${doc.pageKey} · 中文`, href: `/${doc.pageKey}?previewLocale=zh` }] } : null }), feature: defineLocations({ locations: [{ title: "Features / 产品功能", href: "/features?previewLocale=en" }, { title: "产品功能 / 中文", href: "/features?previewLocale=zh" }] }) },
  },
  components: { unstable_navigator: { component: PreviewNavigator, minWidth: 220, maxWidth: 300 } },
}) : null;
