import { defineArrayMember, defineField, defineType } from "sanity";

export const homePage = defineType({
  name: "homePage", title: "Home Page / 首页", type: "document",
  fields: [
    defineField({ name: "heroTitleEn", title: "Hero Title EN", type: "string", validation: rule => rule.required().max(160) }),
    defineField({ name: "heroTitleZh", title: "Hero Title ZH", type: "string", validation: rule => rule.required().max(160) }),
    defineField({ name: "heroDescriptionEn", title: "Hero Description EN", type: "text", rows: 3, validation: rule => rule.required().max(500) }),
    defineField({ name: "heroDescriptionZh", title: "Hero Description ZH", type: "text", rows: 3, validation: rule => rule.required().max(500) }),
    defineField({ name: "heroImage", title: "Hero Image / 主视觉", type: "contentImage" }),
    defineField({ name: "primaryCtaText", title: "Primary CTA Text / 主按钮文案", type: "localizedString", validation: rule => rule.required() }),
    defineField({ name: "secondaryCtaText", title: "Secondary CTA Text / 次按钮文案", type: "localizedString", validation: rule => rule.required() }),
    defineField({ name: "seo", title: "SEO Title & Description / SEO 标题与描述", type: "seoMetadata" }),
    defineField({ name: "featureSections", title: "Feature Sections / 功能模块", type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: "feature" }] })], validation: rule => rule.required().min(1).unique() }),
  ],
  preview: { select: { title: "heroTitleEn", subtitle: "heroTitleZh", media: "heroImage" } },
});
