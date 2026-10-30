import { defineArrayMember, defineField, defineType, getPublishedId } from "sanity";
import { object, safeHref } from "@/lib/cms-content";
import { dictionaries } from "@/lib/i18n";
import { footerPages, publicNavigation } from "@/lib/site-navigation";
const localized = (name: string, title: string) => defineField({ name, title, type: "localizedString" });
const navOptions = publicNavigation.map(p => ({ title: `${dictionaries.en.nav[p.key]} / ${dictionaries.zh.nav[p.key]} (${p.href})`, value: p.key }));
export const siteSettingsInitialValue = {
  websiteName: "Sedavel", defaultLanguage: "en",
  navigationItems: publicNavigation.map((p, i) => ({ _type: "navigationItem", key: p.key, visible: true, displayOrder: i * 10, label: { _type: "localizedString", en: dictionaries.en.nav[p.key], zh: dictionaries.zh.nav[p.key] } })),
  languageLabels: { english: { en: "EN", zh: "EN" }, chinese: { en: "中文", zh: "中文" }, label: { en: "Language", zh: "语言" } },
};
export const siteSettings = defineType({
  name: "siteSettings", title: "Site Settings / 网站设置", type: "document",
  initialValue: siteSettingsInitialValue,
  groups: [{ name: "brand", title: "Brand / 品牌", default: true }, { name: "navigation", title: "Navigation / 导航" }, { name: "footer", title: "Footer / 页脚" }, { name: "contact", title: "Contact / 联系" }, { name: "seo", title: "SEO" }, { name: "language", title: "Language / 语言" }],
  validation: r => r.custom(v => !v?._id || getPublishedId(v._id) === "siteSettings" || "Use the Site Settings singleton / 请使用网站设置单例入口"),
  fields: [
    defineField({ name: "websiteName", title: "Website Name / 网站名称", group: "brand", type: "string", validation: r => r.required().max(100) }),
    defineField({ ...localized("websiteNameLocalized", "Website Name EN/ZH / 双语网站名称（可选）"), group: "brand" }),
    defineField({ name: "logo", title: "Logo / 网站标志", group: "brand", type: "contentImage", description: "Square icon recommended; empty or unavailable falls back to the official Sedavel icon. / 建议方形图标，未配置或加载失败时使用正式图标。" }),
    defineField({ name: "favicon", title: "Favicon / 网站图标", group: "brand", type: "contentImage", description: "Publish then refresh; no rebuild required. The local static icon remains the fallback. / 发布后刷新即可，无需重新部署，本地图标继续作为默认值。" }),
    defineField({ name: "navigationItems", title: "Navigation Items / 导航项", group: "navigation", description: "Choose existing pages. Smaller Display Order comes first; unconfigured pages keep their defaults. Hide with the switch, not by deleting a row. / 数字越小越靠前；未配置项保留默认。隐藏请关闭开关，不要删除条目。", type: "array", of: [defineArrayMember({ name: "navigationItem", type: "object", fields: [
      defineField({ name: "key", title: "Internal page / 对应站内页面", type: "string", options: { list: navOptions }, validation: r => r.required().custom(v => !v || publicNavigation.some(p => p.key === v) || "Select an existing public page / 请选择已有公开页面") }),
      localized("label", "Label EN/ZH / 双语名称（留空使用默认）"),
      defineField({ name: "visible", title: "Visible / 显示", type: "boolean", initialValue: true }),
      defineField({ name: "displayOrder", title: "Display Order / 顺序（小到大）", type: "number", validation: r => r.integer().min(0) }),
    ], preview: { select: { key: "key", label: "label.en", visible: "visible", order: "displayOrder" }, prepare: ({ key, label, visible, order }) => ({ title: label || navOptions.find(p => p.value === key)?.title || "Select a page / 选择页面", subtitle: `${visible === false ? "Hidden / 隐藏" : "Visible / 显示"} · ${order ?? "Default order / 默认顺序"}` }) } })], validation: r => r.max(8).custom(v => !v || new Set(v.map(x => object(x).key)).size === v.length || "Duplicate page / 同一页面不可重复") }),
    defineField({ ...localized("globalCtaText", "Global CTA Text / 全局免费开始文案"), group: "navigation", description: "Registration link remains /register. / 注册链接固定为 /register。" }),
    defineField({ name: "languageLabels", title: "Language Control / 语言切换文字", group: "language", type: "object", fields: [localized("english", "English button EN/ZH / 英文按钮"), localized("chinese", "Chinese button EN/ZH / 中文按钮"), localized("label", "Accessible label / 无障碍名称")] }),
    defineField({ name: "defaultLanguage", title: "Default Language / 默认语言", group: "language", type: "string", initialValue: "en", options: { list: [{ title: "English", value: "en" }, { title: "中文", value: "zh" }] }, validation: r => r.required() }),
    defineField({ name: "footerContent", title: "Footer Content / 页脚文案", group: "footer", type: "object", fields: ["blurb", "product", "company", "contact", "privacy", "terms", "placeholderLegal", "rights"].map(name => localized(name, name)) }),
    defineField({ ...localized("footerCopyright", "Copyright EN/ZH / 完整版权文案（可选）"), group: "footer", description: "Optional plain-text placeholders: {year}, {websiteName}. Empty retains current copyright. / 可使用纯文本占位符 {year}、{websiteName}，留空沿用原文案。" }),
    defineField({ name: "footerGroups", title: "Footer Groups / 导航分组", group: "footer", description: "Optional replacement for the two existing groups; array order controls order. Empty retains default groups. / 可替换现有两组，拖动数组调整顺序，留空沿用默认。", type: "array", of: [defineArrayMember({ name: "footerGroup", type: "object", fields: [
      localized("title", "Group title / 分组标题"), defineField({ name: "visible", title: "Visible / 显示", type: "boolean", initialValue: true }),
      defineField({ name: "links", title: "Links / 页面入口", type: "array", of: [defineArrayMember({ name: "footerLink", type: "object", fields: [defineField({ name: "page", title: "Internal page / 对应页面", type: "string", options: { list: footerPages.map(p => ({ title: `${p.key} (${p.href})`, value: p.key })) }, validation: r => r.required().custom(v => !v || footerPages.some(p => p.key === v) || "Choose an existing page") }), localized("label", "Label / 双语名称（可选）"), defineField({ name: "visible", title: "Visible / 显示", type: "boolean", initialValue: true }), defineField({ name: "showLegalNotice", title: "Show legal placeholder notice / 显示法律页占位声明", type: "boolean", initialValue: true })], preview: { select: { title: "page" } } })], validation: r => r.max(16).custom(v => !v || new Set(v.map(x => object(x).page)).size === v.length || "Duplicate link / 同一分组内页面不可重复") }),
    ], preview: { select: { title: "title.en" }, prepare: ({ title }) => ({ title: title || "Footer group / 页脚分组" }) } })], validation: r => r.max(2) }),
    defineField({ ...localized("contactInformation", "Public Contact Information / 公开联系信息"), group: "contact" }),
    defineField({ name: "contactEmail", title: "Contact Email / 联系邮箱", group: "contact", type: "string", validation: r => r.email().custom(v => !v || !!safeHref(`mailto:${v}`, true) || "Use a simple email address without headers / 请填写不含参数的邮箱") }),
    defineField({ name: "socialLinks", title: "Social Links / 社交链接", group: "contact", type: "array", of: [defineArrayMember({ name: "socialLink", title: "Social link", type: "object", fields: [defineField({ ...localized("label", "Label / 双语名称"), validation: r => r.required() }), defineField({ name: "url", title: "HTTPS URL", type: "url", validation: r => r.required().uri({ scheme: ["https"] }).custom(v => !v || !!safeHref(v, true) || "Use an approved social platform HTTPS URL without credentials or tracking queries / 仅支持批准的社交平台 HTTPS 链接") }), defineField({ name: "visible", title: "Visible / 显示", type: "boolean", initialValue: true })], preview: { select: { title: "label.en", subtitle: "url" } } })], validation: r => r.max(12) }),
    defineField({ ...localized("seoDefaultTitle", "Default SEO Title / 默认标题"), group: "seo", validation: r => r.required() }),
    defineField({ ...localized("seoDefaultDescription", "Default SEO Description / 默认描述"), group: "seo", validation: r => r.required() }),
    defineField({ name: "seoDefaultImageEn", title: "Open Graph Image EN / 英文默认分享图", group: "seo", type: "contentImage" }),
    defineField({ name: "seoDefaultImageZh", title: "Open Graph Image ZH / 中文默认分享图", group: "seo", type: "contentImage" }),
  ],
  preview: { prepare: () => ({ title: "Site Settings / 网站设置", subtitle: "Global public content / 全站公共内容" }) },
});
