# Site Settings 全站公共内容管理

复用原 `siteSettings` 类型和固定文档 ID `siteSettings`。原字段不删除，旧发布内容不覆盖，没有迁移写入脚本。Studio 使用原官方身份验证；/studio 不加载前台布局或 Glass 样式。

## 后台配置

刷新 `/studio`，打开 **Site Settings / 网站设置**。按以下标签编辑：

- **Brand / 品牌**：网站名称、可选双语名称、Logo、Favicon。未上传或 Logo 加载失败时继续使用正式本地图标。建议上传方形图标并填写双语 alt。
- **Navigation / 导航**：每个条目在 Internal page 下拉框中选择已有页面；填写双语 label；Visible 控制显示；Display Order 数字小的在前，数字相同时保留默认顺序。每个页面只能选择一次，不能填写任意 URL。Global CTA Text 控制导航和首页已有的注册 CTA，注册目标固定 `/register`。
- **Language / 语言**：英文按钮、中文按钮及无障碍名称均可分别填写双语文字。建议用短标签。默认语言只在用户尚未主动切换时应用，发布更新不会覆盖已作出的语言选择。
- **Footer / 页脚**：保留原简介/标题/版权标签字段。Footer Groups 可选替换原有两组：标题双语、链接从公开页面下拉框选择、可隐藏、数组拖动排序。法律页可选择是否显示原占位声明。Footer Copyright 可填完整双语版权文字；支持纯文本 `{year}` / `{websiteName}` 占位符，不执行模板代码。
- **Contact / 联系**：公开联系说明、邮箱、双语社交名称和 HTTPS 链接；社交条目可隐藏、拖动排序。邮箱不翻译。
- **SEO**：双语默认 Title、Description；英文和中文各自的默认 Open Graph Image。

首次创建仍需填写原有必填网站名称、默认语言、双语默认 SEO 标题和描述。新单例有明确的初始化模板；已有文档不会自动回填或被覆盖，新增字段均有运行时回退。

## 兼容与显示规则

- CMS 文档未发布、网络失败或缺少某字段：继续使用原有默认值。
- 旧导航仅有 label 时，保留原八项的默认顺序，不会因更新模型自动重排。
- 未配置的导航项保留默认值。**删除一行不是隐藏**；隐藏请将 Visible 设为 false。可以将所有八个条目都配置后统一管理。
- Footer Groups 留空使用原两组；明确关闭两个分组的 Visible 才会隐藏它们。Header 的隐藏开关不自动删除 Footer 链接，两者独立。
- 当前网站、Pricing 价格、注册禁用状态、下载状态和实际页面路径不变。

## 发布与刷新

只读取 published perspective，原服务端 client 的 useCdn=false、cache=no-store 及 request-time connection() 保留。Publish 后**刷新页面**即可读取新内容，不需提交代码或重新部署。草稿不会公开；没有启用网站草稿预览。

Logo 直接使用官方 Sanity 图片组件/CDN。Favicon 在页面加载后从 CMS 更新浏览器的图标链接，保留 `app/icon.svg` 作初始/无 CMS 回退；**CMS 换 Favicon 不需重新部署**，浏览器标签图标缓存可能需要强制刷新。如果直接修改仓库内的静态 icon 文件，则仍需要正常构建部署。

## SEO 优先级与范围

1. 已有页面级 SEO（首页 Home Page、Features Page 或内页既有 Metadata）。
2. 全站对应语言默认 SEO。
3. 原静态默认 SEO。

Home 和 Features 的可编辑字段按每个字段执行优先级，例如页面只填 Title，则 Description 可使用全站默认。其他已有内页的明确页面标题/描述继续保留，不被全局配置覆盖。

服务端保持当前网站的英文 URL/默认渲染机制，提供可被爬虫读取的英文 Metadata 和默认分享图；首页/Features 的同页语言切换同步双语 SEO，默认分享图也随语言切换。没有在本轮新增 `/en`、`/zh` 路由、hreflang 或承诺两个独立可索引语言页面。

默认分享图不会覆盖页面自有分享图。博客详情显式继承父级默认图片，同时保留文章自己的标题、描述、类型和发布时间，避免 Next.js 嵌套 Metadata 覆盖导致默认图片丢失。

## 链接与安全

- 导航和 Footer 页面由代码中的 `publicNavigation` / `footerPages` 白名单解析，仍用 Next.js Link。
- URL、排序、开关、媒体资产在服务端规范化；无效/重复导航项被忽略，不会生成任意路由。
- 外链仅允许现有批准社交域名（LinkedIn、X/Twitter、Facebook、Instagram、YouTube、GitHub）的 HTTPS URL，无凭据或追踪查询参数。需要新增平台时修改受控白名单，不在 CMS 开放脚本协议。
- 联系邮箱仅生成普通 mailto 链接，不允许额外邮件头。
- 图片限当前 Sanity 项目/dataset 的位图资产，图标不注入 SVG/HTML/JS，前台不接收 API Token 或服务器设置。

## 主要文件

- 模型/后台：`sanity/schemaTypes/site-settings.ts`、`sanity.config.ts`、`sanity/structure.ts`
- 数据与路由：`lib/site-settings-cms.ts`、`lib/site-navigation.ts`、`sanity/lib/public-content.ts`
- 公共组件：`site-header.tsx`、`site-footer.tsx`、`logo.tsx`、`site-settings-provider.tsx`、`default-share-image.tsx`
- SEO：网站 layout、Home/Features 的服务端 Metadata 和既有客户端 SEO 解析；博客详情默认图片继承。
- 测试：`tests/public-content.test.mjs`。

参考：[Sanity 初始化模板](https://www.sanity.io/docs/studio/initial-value-templates)、[数组](https://www.sanity.io/docs/studio/array-type)、[Next.js Metadata 合并规则](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)。
