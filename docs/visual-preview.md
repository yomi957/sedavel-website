# Visual Editing · Home Hero 基础阶段

> 当前扩展范围见 [Download / Referral / Site Settings 预览](download-referral-settings-preview.md)；下面保留基础阶段的实施与验收记录。

## 范围

本轮仅首页 Hero 的中英文标题、介绍和产品图片支持草稿及点击编辑。Structure 编辑器保留。Presentation 的页面选择器可浏览所有已有路由；Features/Pricing/Download/Referral 暂时仍读已发布内容，Help/Blog/Contact/Register 的主体仍为现有静态内容。公共导航/Footer 仍读已发布 Site Settings，不映射草稿。

正常网站继续使用原有 published 查询、静态回退与语言机制。只有通过 Sanity 官方验证启用 Draft Mode 的会话，才走独立 Hero 草稿分支。SEO 仍保持已发布内容，预览会话 noindex/nofollow。

## 本地设置

1. 在 Sanity Manage 当前项目 API → Tokens 创建 Viewer 只读 Token。
2. 直接在本机 `.env.local` 添加 `SANITY_API_READ_TOKEN=...`，不要在聊天或 Git 中传递 Token。不得使用 NEXT_PUBLIC_ 或 SANITY_STUDIO_ 前缀存储 Token。
3. 使用本地 `http://localhost:3000/studio` 登录，打开 Presentation / 可视化预览。
4. 页面选择 Home，语言选 EN/中文；工具自带桌面/移动视口切换。
5. 编辑 Home Page 的双语 Hero 字段，保存草稿，不需要发布。Presentation 收到官方 mutation 消息后约 300ms 合并刷新服务端数据，实际延迟取决于 Sanity 保存及网络。
6. 开启 Edit 点击 Hero 标题/介绍/图片可定位对应字段。图片为空时可点击产品占位容器定位 Hero Image。
7. 点击预览中的 Exit / 退出，或直接访问 `/api/draft-mode/disable`，回到 published 展示。

未配置 Token 时，启用入口安全关闭；带有有效格式但未配置凭据的请求返回 503。普通无授权请求返回 401，不设置草稿 cookie。

## 安全与实时机制

- `defineEnableDraftMode` 完成 Sanity 官方短期 secret 验证，不使用公开密码开关；Presentation 分享访问关闭。
- 启用入口限制前台来源、Studio Origin/Referer 和站内跳转白名单。不会跳转任意站外 URL、API 或 Studio 路由。
- 采用 next-sanity Live Content (`defineLive` / `SanityLive`)，显式 drafts/published perspective 与 Next.js Cache Components 边界。
- `browserToken: false`，服务端 Viewer Token 不序列化到客户端。Presentation mutation 通过官方 VisualEditing 通信触发服务端刷新；不自行轮询或注入草稿。单独打开预览标签时不承诺未发布草稿自动刷新，可手动刷新。
- 使用官方 createDataAttribute 的显式字段映射；文案和 URL 保持无 stega，不将不可见编码带入 SEO、图片 URL 或比较逻辑。
- 普通网站不挂载预览控件或 Live 订阅。预览 iframe 仅允许自身、本地 Studio 和明确的 Sanity 官方域名，无任意 CORS 来源。
- 退出清理当前顶层或分区 iframe 的预览 cookies，不触碰 Sanity 登录状态。
- Presentation 自身会按官方机制管理短期预览授权文档；不会迁移、覆盖或删除业务内容，也不更改现有 Schema。

## 在线 Studio 与未来 Preview 环境

已部署的独立 Studio 地址：`https://sedavel-cms.sanity.studio/`，项目 `g117cipn` / `production`。

本轮禁止部署，所以线上 Studio 不会自动获得新 Presentation 配置。独立构建没有 `SANITY_STUDIO_PREVIEW_ORIGIN` 时不启用 Presentation，防止把某位成员的 localhost 当成团队预览服务器。

第三阶段再执行：

1. 部署独立 Next.js 预览站 `https://preview.sedavel.com`，设置相同公开 Project ID / Dataset，以及仅服务端 Viewer Token。
2. 为预览站配置 HTTPS、团队访问控制、全站 noindex，确保部署保护允许授权的 Studio iframe 与 Draft Mode 握手。
3. 在 Sanity API CORS 中添加准确的预览站 Origin 并允许凭据；保留 localhost 开发项，不开启通配符。
4. Studio 构建环境设置 `SANITY_STUDIO_PREVIEW_ORIGIN=https://preview.sedavel.com` 后，另行授权部署 Studio。
5. 使用两位成员各自账号验收认证、草稿、发布、移动视口及浏览器第三方/分区 Cookie 行为。不要将本机 localhost 提供给团队作为正式预览地址。

## 验证边界

自动化可在隔离本地 Sanity 响应中验证授权拒绝、合法握手、双语草稿、字段映射、刷新、退出和匿名隔离，不写入真实 CMS。真实 Presentation 编辑/点击定位/未发布更新，需配置 Token、在真实已登录 Studio 中验收；未完成时必须明确说明。不得声称本轮支持其他页面草稿。

### 本轮验证记录

- ESLint、TypeScript、生产构建、独立 Studio 构建及 59 项测试通过。
- Schema 提取与本轮前的快照完全一致。
- Chrome 隔离响应测试通过：无效/缺失 secret 拒绝且不设置 cookie；官方合法握手设置 HttpOnly cookie；双语 Hero 草稿及标题/介绍/图片字段映射；匿名 published 隔离；草稿刷新；退出恢复 published；320–1440px 无横向溢出。
- 隔离测试没有写入真实 Sanity。真实浏览器已通过 Sanity 官方授权握手读取 drafts.homePage，并验证中英文标题/介绍、图片、字段映射、刷新及退出。Presentation 内点击后右侧编辑器定位由团队手动验收，自动化浏览器未完整复现该 Studio 登录态。
- 真实 Sanity API 已只读连通；独立 Studio 入口返回官方 302 跳转。未重新部署。
- 已确认 SANITY_API_READ_TOKEN 可用，.env.local 被 Git 忽略。公开构建及真实预览页面均未包含凭据，检查过程未输出其值。

### 本轮文件

新增：`lib/preview-policy.ts`、`sanity/presentation/config.ts`、`sanity/presentation/navigator.tsx`、`sanity/lib/preview-client.ts`、`sanity/lib/live.ts`、`sanity/lib/home-preview.ts`、`app/api/draft-mode/enable/route.ts`、`app/api/draft-mode/disable/route.ts`、`components/home-preview-runtime.tsx`、`components/preview-status.tsx`、`components/preview-controls.tsx`、`tests/visual-preview.test.mjs`、本说明。

修改：`sanity.config.ts`、`app/(website)/page.tsx`、`app/(website)/layout.tsx`、`components/home-landing.tsx`、`next.config.ts`、`.env.example`；现有测试的 Studio 配置 mock 增加 Presentation 模块占位。

未修改 Schema、套餐金额、注册认证、下载逻辑或已发布内容；未提交、推送或部署。

### 真实环境验证补充

- 已使用既有本地 Presentation 短期授权完成官方握手；无授权、无效授权均返回 401 且不设置 cookie。
- 真实 Home Hero 中英文文案与图片、语言字段映射、noindex、320–1440px 布局均通过 Chrome 验证。
- 退出后恢复 published，预览控件和编辑映射消失；验证前后已发布 Hero 未改变。
- 当前 drafts.homePage 与已发布文档的业务字段一致，只有元数据不同。因此真实“不同文案”的即时更新尚未形成差异对照；不同草稿内容的隔离、刷新已由隔离响应测试覆盖。
- 没有创建、修改、删除或发布任何真实业务内容；未提交、推送、部署。

## Features / Pricing 后续阶段

Features 和 Pricing 已扩展双语草稿读取与可视化字段映射；其他页面暂不扩展。真实验证与隔离测试的区别、待人工执行步骤及文件清单见 [features-pricing-preview.md](./features-pricing-preview.md)。本文件前文第一阶段记录保留为历史范围，不代表后续页面已完成真实草稿差异验收。
