import { defineField, defineType } from "sanity";
export const blogCategory = defineType({
  name: "blogCategory", title: "Blog Category / 博客分类", type: "document",
  fields: [
    defineField({ name: "title", title: "Name / 名称", type: "localizedString", validation: r => r.required() }),
    defineField({ name: "displayOrder", title: "Display order / 排序", type: "number", initialValue: 0, validation: r => r.integer().min(0) }),
  ],
  preview: { select: { title: "title.en", subtitle: "title.zh" } },
});
