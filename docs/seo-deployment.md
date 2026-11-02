# SEO 部署与域名配置

## 环境变量（构建和运行时保持一致）

- `SITE_URL`：正式 HTTPS origin，例如填写已确认的域名；不含路径、查询、片段、用户名或密码。生产构建与运行必须配置，缺少时明确报错，不回退 localhost。开发环境未填时仅使用 localhost。
- `SITE_INDEXING`：默认 `disabled`。测试/预发布保持 disabled；经内容与业务审核的正式网站设置 `enabled`。变量变更后重新构建部署，因为 Next headers/robots 会在构建时生成。
- 现有 `NEXT_PUBLIC_SANITY_PROJECT_ID`、`NEXT_PUBLIC_SANITY_DATASET`、`NEXT_PUBLIC_SANITY_API_VERSION` 保持原值；`SANITY_API_READ_TOKEN` 仅存服务端密钥配置。
- `SANITY_STUDIO_PREVIEW_ORIGIN` 仅用于独立 Studio 构建，仍须按现有预览文档设置。它不替代 SITE_URL。Preview 网站 SITE_URL 是其自身地址，SITE_INDEXING 必须 disabled。

不要将未确认域名写入代码或把本地测试用的 `.example` / `example.org` 地址部署为正式地址。部署平台设置变量后执行原 lint、tsc、build 和 tests 流程。

## Canonical 与 Metadata

每个实际页面独立生成唯一绝对 Canonical，统一以 SITE_URL 为 origin，去除预览/语言查询参数，不继承首页 Canonical 给不存在的文章。现有 CMS canonicalPath 字段保留，但公开输出以真实页面路径为准，避免编辑人员指向未验证或不存在的路由。

页级 Title/Description 优先，未填使用全站默认值。Open Graph 标题/描述跟随页级；图片优先级为页级 CMS 图片（Blog 封面也是页级回退）、全站 CMS 分享图、现有正式 Sedavel Logo。Logo 使用已有构建资源，无需添加第三方图片或虚构产品图。请另提供经批准的横版分享图及双语 Alt。

公开读取使用 published，Draft Mode 仍经官方验证。所有预览会话 noindex；后台和 API 不依赖 robots 进行认证。生产环境的 head Metadata 配置、文章封面 eager/high、组件拆分和 Footer 对比度保留。开发环境使用 Next 默认流式 Metadata，避免 16.4.3 的静态壳校验 Invariant；参见 [开发预览兼容说明](draft-mode-static-shell.md)。

## 索引策略与 Sitemap

初始公开索引白名单：`/`、`/features`、`/pricing`；`/blog` 仅在存在至少一篇可索引的正式文章时加入。当前仅有测试文章时列表 noindex 且不入 Sitemap。

暂不索引：`/register`（认证未开放）、`/download`（安装包未开放）、`/contact`（占位）、`/referral`（活动筹备）、`/help`（静态待核实教程）、`/solutions`（旧页面）、`/privacy` 和 `/terms`（占位）。这些真实路由仍有 Canonical，但 noindex，且不进 Sitemap。业务正式启用后另行审核更新 `lib/site-url.ts` 的白名单。

Sitemap 直接用 published perspective 查询 Blog，不调用 Draft Mode reader；不收录 drafts、非法/重复 slug、noIndex 文章或标题/slug 中明确的 test/sample/demo、测试/示例/演示内容。旧静态示例从未进入 Sitemap。过滤仅作用于 SEO，**不删除或隐藏页面内容，不等于已清理测试文章**。标题测试词检测保守，正式讨论相关词的文章需要人工审查策略。

未启用索引时 Sitemap 为空、robots Disallow /，所有响应有 X-Robots-Tag: noindex,nofollow。启用索引时 robots Allow /，屏蔽 Studio、API 和预览参数，并声明统一绝对 Sitemap URL。noindex 页不一律在 robots 中禁止抓取，以便搜索引擎读取 noindex。

## 双语边界

当前同一 URL 客户端切换 EN/中文，不存在 /en、/zh 路由。本轮不虚构 hreflang。初始服务器 Metadata 以英文为主，Blog 授权预览沿用现有 previewLocale 机制，Canonical 仍指向同一无参数 URL。语言切换可以更新浏览器文字，但不等于建立独立的中文搜索索引或分享 URL。

## 发布前实际验证

1. 检查生产站各页 raw HTML head 的 Title/Description/Canonical/OG；Canonical/OG 不能含 localhost、测试域名或预览站域名。
2. GET /robots.txt 和 /sitemap.xml 应为 200；正式 Sitemap 只能有正式且实际可访问页面，不能包含测试文章、草稿、Studio、API。
3. 验证缺失文章无 Canonical；缺失/非法文章应返回 HTTP 404。Metadata 和正文共用文章判定，依赖 next.config.ts 中生产环境阻塞 Metadata 的配置；更改流式策略后应重新验证普通 HTML 状态码。
4. 上传正式分享图，检查公开图片 URL 可被抓取；CMS 图 Publish 后刷新生效，静态素材/配置变更需部署。
5. Preview/测试环境必须配置托管平台身份验证或网络访问限制；noindex/robots 不是访问控制，代码不能代替托管权限配置。
6. 核对 HTTPS、www/非 www 单一域名重定向、DNS、真实分享抓取及 Search Console；这些必须等待真实域名与部署后验收。

## 本地验证域名

正式域名未知时，本轮仅在命令环境中使用保留示例域名验证，不写入 .env.local 或 CMS。已验证缺少 SITE_URL 的生产构建会失败、disabled 模式构建通过；enabled 模式通过隔离示例域名及单元/实际 HTML 验证。不要把测试命令中的 origin 当作正式域名。
