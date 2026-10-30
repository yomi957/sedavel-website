import { defineField, defineType } from "sanity";
import { isUniqueSlug } from "@/sanity/lib/unique-slug";

export const blogPost = defineType({
  name: "blogPost", title: "Blog Post / 博客文章", type: "document",
  fields: [
    defineField({ name: "titleEn", title: "Title EN", type: "string", validation: rule => rule.required().max(200) }),
    defineField({ name: "titleZh", title: "Title ZH", type: "string", validation: rule => rule.required().max(200) }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "titleEn", maxLength: 96, isUnique: isUniqueSlug }, validation: rule => rule.required().custom(value => !value?.current || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.current) || "Use lowercase letters, numbers and hyphens.") }),
    defineField({ name: "coverImage", title: "Cover Image / 封面", type: "contentImage" }),
    defineField({ name: "summaryEn", title: "Summary EN", type: "text", rows: 3, validation: rule => rule.required().max(500) }),
    defineField({ name: "summaryZh", title: "Summary ZH", type: "text", rows: 3, validation: rule => rule.required().max(500) }),
    defineField({ name: "bodyEn", title: "Body EN", type: "portableText", validation: rule => rule.required().min(1) }),
    defineField({ name: "bodyZh", title: "Body ZH", type: "portableText", validation: rule => rule.required().min(1) }),
    defineField({ name: "category", title: "Category / 分类", type: "string", options: { list: [{ title: "Product Updates / 产品动态", value: "productUpdates" }, { title: "Cross-Border E-commerce / 跨境电商", value: "ecommerce" }, { title: "Customer Communication / 客户沟通", value: "communication" }, { title: "Multilingual Support / 多语言支持", value: "multilingual" }, { title: "Guides & Tutorials / 指南", value: "guides" }] }, description: "Legacy category; retained for existing documents. Use Category reference for new content.", hidden: ({document}) => !document?.category }),
    defineField({ name: "categoryRef", title: "Category / 双语分类", type: "reference", to: [{ type: "blogCategory" }], validation: r => r.custom((v, ctx) => v || ctx.document?.category ? true : "Choose a category / 请选择分类") }),
    defineField({ name: "tags", title: "Tags / 标签", type: "array", of: [{ type: "localizedString" }], validation: r => r.max(12) }),
    defineField({ name: "author", title: "Author / 作者", type: "object", fields: [defineField({ name: "name", type: "localizedString", title: "Name / 姓名" }), defineField({ name: "image", type: "contentImage", title: "Portrait / 头像" })] }),
    defineField({ name: "featured", title: "Featured / 推荐文章", type: "boolean", initialValue: false }),
    defineField({ name: "seoImage", title: "Open Graph Image / 分享图片", type: "contentImage" }),
    defineField({ name: "canonicalPath", title: "Canonical path / 规范路径", type: "string", description: "Optional internal /blog/slug path. Leave empty to use the current article.", validation: r => r.custom(v => !v || /^\/blog\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v) || "Use /blog/article-slug") }),
    defineField({ name: "noIndex", title: "No index / 禁止搜索索引", type: "boolean", initialValue: false }),
    defineField({ name: "noFollow", title: "No follow / 禁止链接跟踪", type: "boolean", initialValue: false }),
    defineField({ name: "publishedAt", title: "Publication Date / 发布时间", type: "datetime", validation: rule => rule.required() }),
    defineField({ name: "seo", title: "SEO Title & Description / SEO 标题与描述", type: "seoMetadata" }),
  ],
  orderings: [{ title: "Newest first", name: "publicationDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: { select: { title: "titleEn", subtitle: "titleZh", media: "coverImage" } },
});
