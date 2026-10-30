# Features / Pricing 可视化预览阶段

> 后续扩展已由用户另行授权实施，当前状态见 [Download / Referral / Site Settings 预览](download-referral-settings-preview.md)。本文保留当时的验证边界，不代表后续能力未接入。

## 当前支持

继续复用已有 `/api/draft-mode/enable`、`/api/draft-mode/disable`、Sanity 官方 secret 验证、server-only Preview Client 和 `defineLive`。不创建新的授权系统、数据集或内容模型，不把 Token 传给浏览器。只有合法 Draft Mode 请求使用草稿查询。

- Home Hero：保留现有支持。
- Features：Features Page Hero、模块及独立 Feature 文档读取 drafts；中英文功能名、介绍、优势列表、状态、图片/占位容器、模块标题、FAQ 和 CTA 有对应字段映射。静态默认 Feature 不伪装为可编辑 CMS 记录。
- Pricing：Hero、营销标题/介绍、套餐营销说明、优势、按钮文字、图片/图标、FAQ 和 CTA 支持 drafts 与字段映射。卡片使用真实 `_key` 定位，模块用 `_key` 保持排序后路径准确。
- 金额、字符数量、套餐名、五档顺序和 Standard 推荐状态继续固定在代码中；金额没有点击编辑入口。没有接入支付或改变注册逻辑。
- 公共访问仍使用原 published 查询与静态回退。预览 SEO 仍采用 published 字段，预览 noindex。
- Download、Referral、Site Settings 尚未扩展草稿读取或点击编辑。Help、Blog、Contact、Register 保留原状态。未部署线上 Studio 或 Preview 网站。

`PagePreviewRuntime` 复用原有 VisualEditing mutation 刷新及无 browserToken 的 Live Content 组件。默认回退内容保留；只有实际 CMS 字段有编辑映射。发布内容和草稿在服务端分开获取。

## 必须人工验收的真实步骤

### Home Hero

1. 打开本地 `/studio` → Presentation → Home。
2. 修改双语 Hero 为明显不同的文案，等待 Studio 显示已保存草稿，**不要 Publish**。
3. 预览应显示草稿；另一无痕窗口的 `/` 仍显示已发布内容。
4. 开启 Edit，点击标题、介绍、图片，确认右侧分别定位到 `heroTitleEn/Zh`、`heroDescriptionEn/Zh`、`heroImage`。
5. 继续输入，确认保存后预览更新；退出预览后应恢复正式内容。

### Features

1. Presentation 选 Features。修改 Features Page 双语 Hero 并保存草稿。
2. 修改一条已有 Feature 的双语名称/介绍，不发布；确认预览反映草稿。
3. 点击 Hero、功能文字和图片，核对右侧分别打开 `page-features` 或该 Feature 文档的准确字段。
4. 如需 FAQ/CTA 对照，在 Features Page 中添加对应 CMS 模块；默认静态回退内容不会产生虚假编辑入口。
5. 在无痕 `/features` 确认没有草稿内容，退出后恢复 published。

### Pricing

1. 修改 Pricing Page 双语 Hero、一个 Standard 营销说明或 FAQ，保存草稿但不发布。
2. 点击对应文案，确认定位到 `page-pricing` 的 Hero、带 `_key` 的营销卡片或模块字段。
3. 核对五档价格与额度不变：Free 50,000/$0；Starter 300,000/$11.90；Standard 1,500,000/$54.90；Pro 5,000,000/$169.00；Business 15,000,000/$459.00。
4. 金额不应有编辑覆盖层。无痕 `/pricing` 不显示草稿；退出预览恢复正式内容。

如果编辑后 API 中未出现 `drafts.page-features` 或 `drafts.page-pricing`，检查是否编辑了正确项目/数据集/单例、是否实际修改字段、是否保存完成，以及当前登录角色能否编辑。不要通过修改已发布内容或降低授权规则来完成测试。

## 本轮验证记录

- ESLint、TypeScript、生产构建及 63 项测试通过；Schema 导出与之前完全一致。
- **隔离 Chrome 测试通过**：两页双语不同草稿、独立 Feature、FAQ、字段路径、套餐营销 `_key`、金额保护、私有功能排除、SEO、刷新、匿名隔离、空预览数据回退、退出，以及 320–1440px 布局。这些响应仅在临时本地进程中模拟，未写入 Sanity。
- **真实 CMS + Chrome 验证通过**：既有 Sanity 授权握手、两页实际 CMS 内容、中英文 Hero 映射、功能记录、noindex、凭据不序列化、320/390/1440px 布局、退出恢复、已发布文档 `_rev` 不变。
- **真实差异对照尚未通过**：最终只读检查没有 `drafts.page-features`、`drafts.page-pricing` 或 Feature 草稿；Home 的草稿与已发布业务字段相同。真实浏览器读取的是 drafts perspective 中的已发布回退，不能将其描述为不同文案的真实草稿更新。
- **Presentation 内点击定位尚需人工确认具体字段**：自动化验证了 `data-sanity` 的文档 ID 和字段路径，没有完整复现已登录 Studio 内的点选与右侧编辑器联动。
- 因上述真实验收仍待完成，本轮不继续 Download / Referral / Site Settings 阶段。

## 文件

新增：`components/cms-edit-context.tsx`、`components/page-preview-runtime.tsx`、`sanity/lib/page-preview.ts`、`tests/page-preview.test.mjs`、本说明。

修改：Features/Pricing 路由及页面组件、`components/page-hero.tsx`、`components/feature-showcase.tsx`、`components/page-modules.tsx`、`components/home-page.tsx`（仅 Pricing/通用标题的编辑属性）、`lib/pricing-cms.ts`（保留营销卡片 `_key`）、`sanity/lib/public-content.ts`（查询该 `_key`）、Presentation 配置/导航和预览提示、现有预览测试。

未修改现有 CSS、价格目录、Schema、下载、注册或已发布 CMS 内容；未提交、推送或部署。
