import { defineField, defineType } from "sanity";
import { isUniqueSlug } from "@/sanity/lib/unique-slug";

export const helpArticle = defineType({
  name: "helpArticle", title: "Help Article / 帮助文章", type: "document",
  initialValue: { displayOrder: 0 },
  fields: [
    defineField({ name: "titleEn", title: "Title EN", type: "string", validation: rule => rule.required().max(200) }),
    defineField({ name: "titleZh", title: "Title ZH", type: "string", validation: rule => rule.required().max(200) }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "titleEn", maxLength: 96, isUnique: isUniqueSlug }, validation: rule => rule.required().custom(value => !value?.current || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.current) || "Use lowercase letters, numbers and hyphens.") }),
    defineField({ name: "category", title: "Category / 分类", type: "string", options: { list: [{ title: "Installation / 安装下载", value: "installation" }, { title: "Accounts / 账号管理", value: "accounts" }, { title: "Translation / 翻译", value: "translation" }, { title: "Character credits / 字符额度", value: "credits" }, { title: "General / 通用", value: "general" }] }, validation: rule => rule.required() }),
    defineField({ name: "contentEn", title: "Content EN", type: "portableText", validation: rule => rule.required().min(1) }),
    defineField({ name: "contentZh", title: "Content ZH", type: "portableText", validation: rule => rule.required().min(1) }),
    defineField({ name: "displayOrder", title: "Display Order / 展示顺序", type: "number", validation: rule => rule.required().integer().min(0) }),
    defineField({ name: "seo", title: "SEO Metadata", type: "seoMetadata" }),
  ],
  orderings: [{ title: "Display order", name: "displayOrderAsc", by: [{ field: "displayOrder", direction: "asc" }] }],
  preview: { select: { title: "titleEn", subtitle: "category" } },
});
