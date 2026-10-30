# 推广返现 / Referral Rewards CMS

## 模型与入口

刷新 `/studio`，打开 **推广返现 / Referral Rewards**。沿用现有 `websitePage` 类型，固定文档 ID `page-referral`、`pageKey: referral`、路由 `/referral`。不创建重复文档，不迁移或覆盖其他已发布内容。

- **Page Hero**：双语标题/介绍、受控背景预设、背景图和装饰图、显示开关、双语按钮。默认绿色渐变与 SEDAVEL 背景字。
- **Referral Rewards**：活动标签、Program Status、Cashback Percentage、双语奖励说明、规则确认开关和七项双语规则。
- **Referral Sections**：reward（奖励）、steps（流程）、benefits（优势）、terms（规则）；每种最多一次。支持双语标题/介绍、顺序、显示开关、图片。流程/优势卡片支持双语、预设图标或位图资产、图片与显示开关，最多三项。数组顺序决定卡片顺序。
- **Page modules**：复用 FAQ、CTA、图文等模块。FAQ、CTA 留空使用默认文案；明确关闭模块后不会被默认内容恢复。与 Referral Sections 共用 Display Order（默认 100–600），数字小的先展示。
- **Page SEO**：双语 Title / Description。页面级优先；未填写使用推广返现页面专属默认值。英文服务端元数据，浏览器语言切换同步标题和描述，沿用网站当前机制。
- 图片使用现有 Sanity 图片资产、双语 Alt、裁剪/焦点与受控样式，不能上传可执行文件或注入 SVG/HTML/JS/CSS。

## 导航名称必须手动更新

代码默认导航文案为 **推广返现 / Referral Rewards**，路由、顺序、显示开关和激活逻辑不变。已发布 Site Settings 的自定义文案继续优先。

在 Site Settings → Navigation Items，找到现有 **key = referral** 条目，将 Label EN 改为 `Referral Rewards`，Label ZH 改为 `推广返现`，再 Publish。保留原条目的 key、顺序和显示开关；不要新增条目。若 Footer 自定义分组也使用旧名称，修改其中对应 `/referral` 的 Label；未自定义时自动使用新默认名称。

## 状态和安全边界

- Coming Soon（默认）：筹备中，不能领取返现。
- Active：仅展示活动开放信息；本网站尚未接入真实推广系统，仍无推广参与/领取入口。
- Paused：明确活动暂停，无参与/领取入口。
- Ended：明确活动结束，无参与/领取入口。

比例默认 10%，仅为拟定展示，范围 0–100%，修改比例不能激活活动。`rulesConfirmed` 默认 false；请仅在 Sedavel 团队审核正式规则后开启。未填写的有效订单定义、归因期限、结算周期、最低提现金额、发放方式、退款/拒付规则、活动条款始终显示待确认。不提供任何虚构订单、邀请人数、收益或余额。

没有可配置的推广地址、邀请码、钱包或支付接口。真实推广系统接入需要后续独立开发与审核，不会由 CMS 中的状态或开关直接启用。CTA `/register`、`/features` 只访问既有页面，不模拟注册或返现成功。

## 发布与验证

只读取 published perspective，`useCdn: false` / `cache: no-store`，每次页面请求读取；Publish 后刷新即可看到更新，无需部署。草稿不会展示给公开访客。CMS 无内容、网络失败或单个语言缺失时使用同语言静态默认值。

真实发布建议：填写双语 Hero、活动状态（首次保持 Coming Soon）、奖励说明、一个流程或优势模块、一条 FAQ、CTA、SEO；Publish 后在 `/referral` 切换语言检查。无需提供任何 Token 或密码。

## 本轮文件范围

新增：`lib/referral-cms.ts`、`components/referral-page.tsx`、`components/referral-page.module.css`、`tests/referral-cms.test.mjs`、本说明。

修改：`app/(website)/referral/page.tsx`（读取与元数据）、`lib/i18n.ts`（只改本轮推广导航默认名）、`components/resource-pages.tsx`（原 Referral 导出复用新组件，其他页面保留）、`components/page-hero.tsx`（可选双语活动标签，其他页面默认不变）、`sanity/schemaTypes/page-content.ts`、`sanity/structure.ts`、`sanity.config.ts`、`sanity/lib/public-content.ts`、`tests/public-content.test.mjs`。

验证：ESLint、TypeScript、Sanity Schema 提取、生产构建及 51 项测试通过。Chrome 检查 320/390/820/1280/1440px、双语切换、移动菜单、导航激活、FAQ 和 CTA；隔离 CMS 测试验证四种状态、发布数据响应刷新、图片、模块排序/隐藏、草稿隔离和空内容回退。Safari、Edge、真实手机尚未实机验证。真实推广页面首次发布验证需在后台发布后完成；代码不会自动发布 CMS 内容。
