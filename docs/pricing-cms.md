# Pricing Page 内容管理

## 本轮确认的展示基准

检查时旧页面为 Starter 200,000/$19、Growth 1,000,000/$59、Scale 5,000,000/$149，并标注月度套餐。用户已明确确认只将**网站公开展示**更新为以下五档：

| Plan | Characters | Price |
| --- | ---: | ---: |
| Free | 50,000 | $0 |
| Starter | 300,000 | $11.90 |
| Standard | 1,500,000 | $54.90 |
| Pro | 5,000,000 | $169.00 |
| Business | 15,000,000 | $459.00 |

金额、字符量、名称、顺序和 Standard 推荐状态统一由 `lib/pricing-catalog.ts` 控制，两种语言使用同一目录。CMS 没有金额、额度、货币或推荐开关字段。目录不参与支付、订阅计算、额度发放或软件用户数据库。

旧月度营销文案在 Pricing 展示中改为字符额度包和无会员说明；不承诺有效期、结转、退款、客服等级或其他未确认规则。其他页面业务逻辑不修改。

## Studio 操作

刷新 `/studio` → **Pricing Page / 价格页内容**。

- 复用 `websitePage` 模型，固定 ID `page-pricing`，初始化模板 `pricing-page`。
- Page 自动为 `pricing`。已有空值草稿可以选择正确页面；字段只在与当前单例匹配后锁定，必填和路由验证保留。
- **Hero**：填写双语标题、说明；选择受控背景预设；可上传背景或装饰图片，并填写双语 alt。不配置时保留原绿色渐变标题区域。
- **Pricing Display Content**：双语章节标签、标题、介绍、Benefits EN/ZH、推荐徽章文案、统一卡片按钮文案。
- **Plan Marketing Copy**：选择对应固定套餐，只编辑双语说明、优势、按钮文字、图片或图标。不需要为五档都创建内容；未配置的套餐保留对应语言的默认展示。
- **Page modules**：添加 FAQ、CTA Banner、Image & Text 或 Card Grid。可设置显示开关和数字排序。FAQ 问答和 CTA 标签支持双语，链接限已有公开站内页面。
- **Page SEO**：双语标题、Description，优先于原有 Pricing 页默认 SEO；全站默认分享图仍由 Site Settings 提供。

主套餐表始终保留，不受 CMS 模块开关影响。缺少 FAQ 或 CTA 模块时保留基础默认内容；要明确隐藏某类模块，请创建该模块并关闭 Visible。CTA 默认排序在 FAQ 后。

## 安全与兼容

- Features 仍是同一模型的 `page-features` 单例：既有字段、入口、查询和发布内容不覆盖。
- Pricing 专用服务端读取：`published` perspective，`useCdn:false`，`cache:no-store`，React cache 只合并单次请求；Publish 后刷新即可读取。
- 未发布、空数据、无网络或缺少翻译时按字段回退，不会空白；不将草稿序列化给普通访客。
- 金额、字符量、名称、顺序、推荐状态不进入 CMS 投影或解析，即使写入非 Schema 字段也不能替换套餐展示基准。
- 富文本在此仅用受控字符串，不执行 HTML/JS/CSS。图片沿用当前项目 Sanity CDN、裁剪与焦点校验；图标只支持预设或位图资产。
- 套餐按钮仅前往现有 `/register` 注册预览，始终说明在线支付未接入；不构成可购买状态，不修改注册认证逻辑。
- 保留原一列/桌面三列卡片布局，复用绿色 PageHero、GlassCard 和 GlassButton。没有新依赖。

## 验收建议

1. 发布双语 Hero、一个 Standard 营销说明、一个 FAQ 和页面 SEO。
2. 刷新 `/pricing`，切换中文和英文，核对 CMS 字段；价格和字符量必须始终为上述五档。
3. Standard 必须唯一推荐，其他套餐不能通过 CMS 设为推荐。
4. 保存未发布草稿后，公开页面继续显示上次发布内容。
5. 图片需要真实素材；未提供时不生成虚假产品界面。
6. 在 320px 手机宽度和桌面宽度检查卡片及按钮。

本轮不自动创建、迁移或发布任何 Sanity 文档，不提交/推送 Git，不部署。

## 本轮文件清单

- `app/(website)/pricing/page.tsx`
- `components/home-page.tsx`
- `components/page-modules.tsx`
- `components/pricing-page.module.css`
- `components/pricing-page.tsx`
- `docs/cms-phase-two.md`
- `docs/pricing-cms.md`
- `lib/i18n.ts`
- `lib/page-cms.ts`
- `lib/pricing-catalog.ts`
- `lib/pricing-cms.ts`
- `sanity.config.ts`
- `sanity/lib/public-content.ts`
- `sanity/schemaTypes/page-content.ts`
- `sanity/structure.ts`
- `tests/pricing-cms.test.mjs`
- `tests/public-content.test.mjs`
