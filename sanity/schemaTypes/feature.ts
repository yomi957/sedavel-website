import { defineArrayMember, defineField, defineType, getPublishedId } from "sanity";
import { apiVersion } from "@/sanity/env";

export const feature = defineType({
  name: "feature", title: "Feature / 产品功能", type: "document",
  initialValue: { displayOrder: 0, publicationStatus: "inDevelopment", showOnHomepage: true, isPublic: true },
  fields: [
    defineField({ name: "featureKey", title: "Core Feature / 核心功能标识", description: "Optional for existing content. Select the matching core feature to replace its default content on both pages. Leave empty for additional features.", type: "string", options: { list: [{ title: "Smart Multilingual Translation", value: "translation" }, { title: "Unified Messaging", value: "messaging" }, { title: "Customer Management", value: "customers" }, { title: "AI Copilot", value: "ai" }] }, validation: rule => rule.custom(async (value, context) => {
      if (!value || !context.document?._id) return true;
      const taken = await context.getClient({ apiVersion }).fetch<boolean>(`defined(*[_type == "feature" && featureKey == $key && !sanity::versionOf($id)][0]._id)`, { key: value, id: getPublishedId(context.document._id) });
      return !taken || "A document already uses this core feature key / 已有内容使用此功能标识";
    }) }),
    defineField({ name: "nameEn", title: "Feature Name EN", type: "string", validation: rule => rule.required().max(150) }),
    defineField({ name: "nameZh", title: "Feature Name ZH", type: "string", validation: rule => rule.required().max(150) }),
    defineField({ name: "descriptionEn", title: "Description EN", type: "text", rows: 4, validation: rule => rule.required().max(1500) }),
    defineField({ name: "descriptionZh", title: "Description ZH", type: "text", rows: 4, validation: rule => rule.required().max(1500) }),
    defineField({ name: "image", title: "Feature Image / 功能图片", type: "contentImage" }),
    defineField({ name: "benefitsEn", title: "Benefits EN", type: "array", of: [defineArrayMember({ type: "string", validation: rule => rule.max(200) })], validation: rule => rule.max(6) }),
    defineField({ name: "benefitsZh", title: "Benefits ZH", type: "array", of: [defineArrayMember({ type: "string", validation: rule => rule.max(200) })], validation: rule => rule.max(6) }),
    defineField({ name: "isPublic", title: "Publicly Visible / 允许公开展示", type: "boolean", description: "Turn off to hide on both pages. Unset legacy records remain visible. / 关闭后两处均隐藏，历史未设置值按显示处理。" }),
    defineField({ name: "showOnHomepage", title: "Show on Homepage / 在首页显示", type: "boolean", description: "Only affects the homepage; public features remain on /features. / 只控制首页，不影响独立功能页。" }),
    defineField({ name: "displayOrder", title: "Display Order / 展示顺序", type: "number", validation: rule => rule.required().integer().min(0) }),
    defineField({ name: "publicationStatus", title: "Feature Status / 产品功能上线状态", description: "This describes product availability. Sanity Draft/Publish controls content publication separately.", type: "string", options: { list: [{ title: "Available / 已上线", value: "available" }, { title: "Coming Soon / 即将推出", value: "comingSoon" }, { title: "In Development / 开发中", value: "inDevelopment" }, { title: "Planned (legacy) / 规划中（历史兼容）", value: "planned" }, { title: "Archived / 已归档", value: "archived" }] }, validation: rule => rule.required().custom((value, context) => context.document?.featureKey === "ai" && value === "available" ? "AI Copilot is currently Coming Soon / AI 助手当前尚未上线" : true) }),
  ],
  orderings: [{ title: "Display order", name: "displayOrderAsc", by: [{ field: "displayOrder", direction: "asc" }] }],
  preview: { select: { title: "nameEn", subtitle: "publicationStatus", media: "image" } },
});
