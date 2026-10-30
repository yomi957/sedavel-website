import { defineArrayMember, defineField, defineType } from "sanity";

export const localizedString = defineType({
  name: "localizedString", title: "English / 中文", type: "object",
  fields: [
    defineField({ name: "en", title: "English", type: "string", validation: rule => rule.required().max(200) }),
    defineField({ name: "zh", title: "中文", type: "string", validation: rule => rule.required().max(200) }),
  ],
});

export const contentImage = defineType({
  name: "contentImage", title: "Image / 图片", type: "image", options: { hotspot: true, accept: "image/png,image/jpeg,image/webp,image/avif" },
  fields: [
    defineField({ name: "altEn", title: "Alternative text EN", type: "string", validation: rule => rule.required().max(250) }),
    defineField({ name: "altZh", title: "替代文本 ZH", type: "string", validation: rule => rule.required().max(250) }),
    defineField({ name: "captionEn", title: "Caption EN", type: "string", validation: rule => rule.max(300) }),
    defineField({ name: "captionZh", title: "图片标题 ZH", type: "string", validation: rule => rule.max(300) }),
    defineField({ name: "ratio", title: "Display ratio / 展示比例", type: "string", options: { list: ["original", "wide", "square"] }, initialValue: "original" }),
    defineField({ name: "style", title: "Display style / 展示样式", type: "string", options: { list: ["plain", "rounded", "framed"] }, initialValue: "rounded" }),
  ],
});

export const portableText = defineType({
  name: "portableText", title: "Rich text / 富文本", type: "array",
  of: [
    defineArrayMember({ type: "block", styles: [{ title: "Normal", value: "normal" }, { title: "Heading 2", value: "h2" }, { title: "Heading 3", value: "h3" }, { title: "Quote", value: "blockquote" }], marks: { decorators: [{ title: "Strong", value: "strong" }, { title: "Emphasis", value: "em" }], annotations: [defineArrayMember({ name: "link", type: "object", title: "Link", fields: [defineField({ name: "href", type: "url", title: "URL", validation: rule => rule.required().uri({ scheme: ["https", "mailto"], allowRelative: true }) })] })] } }),
    defineArrayMember({ type: "contentImage" }),
  ],
});

export const seoMetadata = defineType({
  name: "seoMetadata", title: "SEO metadata", type: "object",
  fields: [
    defineField({ name: "titleEn", title: "SEO Title EN", type: "string", validation: rule => rule.max(70) }),
    defineField({ name: "titleZh", title: "SEO Title ZH", type: "string", validation: rule => rule.max(70) }),
    defineField({ name: "descriptionEn", title: "SEO Description EN", type: "text", rows: 3, validation: rule => rule.max(180) }),
    defineField({ name: "descriptionZh", title: "SEO Description ZH", type: "text", rows: 3, validation: rule => rule.max(180) }),
  ],
});
