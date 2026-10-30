# Download / Referral Rewards / Site Settings 可视化预览

## 已接入范围

复用已有官方 Draft Mode 启用/关闭路由、server-only Viewer Client、`defineLive` 和 VisualEditing。没有新增认证系统、Schema、Dataset 或浏览器 Token。

| 页面/内容 | 草稿及双语支持 | 可点击字段 |
| --- | --- | --- |
| Home Hero | 保留 | 标题、介绍、产品图片 |
| Features / Pricing | 保留 | 原有 Hero、功能/营销文案、模块、图片、FAQ、CTA；价格与额度不映射 |
| Download | 新增 | Hero、平台名/介绍/图片/图标、状态说明、安装步骤及图片、FAQ、CTA |
| Referral Rewards | 新增 | Hero、奖励说明/比例/状态、流程、优势、规则、图片、FAQ、CTA |
| Site Settings | 新增，作用于全部公开页面 | 导航名称、语言标签、Logo/网站名、全局 CTA、Footer 介绍/分组/链接/版权、联系方式及社交标签 |

Help / Blog / Contact / Register 只具有公共 Site Settings 的草稿效果，主体静态内容没有虚构的预览映射。Studio 根布局与前台预览组件相互隔离。

Download 的 SEO 在授权会话读取草稿；普通会话继续读取 published。SEO 在 head 中展示，不支持点击文字定位，请在 Studio 编辑 SEO 字段。其他页保留既有 SEO 策略；所有预览会话 noindex/nofollow。默认 SEO/Favicon 等已加载的设置随授权草稿刷新，但不为不可见 head 节点生成点击区域。

仅实际 CMS 数组 `_key` 生成定位路径，过滤或排序后仍定位原条目。静态默认文案、默认 FAQ/CTA 不产生虚假的编辑入口。下载技术信息中的待确认值、固定状态提示及无业务数据的入口不映射为可编辑功能。

## 安全和更新

- 查询前检查合法 Draft Mode，普通请求保持 published、原静态回退和原缓存策略。
- 草稿分支等待真实请求再调用 Live 缓存查询，避免实验性预取阶段出现缓存 warming miss 并回退。
- 一个全站预览 Runtime 负责 VisualEditing 与 Live，页面与共享导航不重复挂载覆盖层。官方 Presentation mutation 消息约 300ms 合并触发刷新，实际延迟取决于保存和网络。独立预览标签可手动刷新。
- `browserToken: false`；Token 仅供服务器使用。不写入 Sanity 业务数据，不迁移或发布内容。
- Download 不接收安装包地址，按钮保持 Coming Soon/disabled。未核实版本与系统信息不会展示为已确认。
- Referral 所有状态均不启用真实推广入口、返现或结算。活动状态与比例只控制展示。
- 退出仍使用既有 `/api/draft-mode/disable`，不退出 Sanity 账号。

## 本轮验证记录

### 自动化与隔离浏览器

- ESLint、TypeScript、生产构建通过；自动化测试 70 项通过。
- 本机 Chrome + 隔离响应：双语不同草稿、图片加载、准确字段路径、隐藏/重排数组键、FAQ 展开、CTA/联系方式安全、页面/设置刷新、匿名隔离、空数据回退、退出均通过。
- 320/390/820/1440px 无横向溢出；Home/Features/Pricing 原有预览仍能显示。公共设置在所有九个前台页面均显示草稿。
- Download 固定禁用，注入的假安装包地址和未核实技术信息被丢弃；Referral Active/Paused/Ended 均无参与能力。以上都是临时隔离数据，不是对真实 Sanity 的编辑。
- 最新生产浏览器复测不再出现已修复的预取缓存 warming miss。

### 真实环境只读验证

- 真实 Sanity 官方握手、Download 双语 Hero 与共享设置字段映射、Referral 无文档时的静态回退、noindex、Token 未序列化、320–1440px 布局及退出均通过。
- 检查时 Features/Pricing/Download 和 Site Settings 没有未发布草稿；Referral 既无已发布文档也无草稿。Home 先前草稿业务字段与 published 相同。**不能将这些检查称为真实不同草稿对照已通过。**
- 验证前后 Features/Pricing/Download/Referral 与 Site Settings 的 published `_rev` 保持不变。
- 自动化核对了 `data-sanity` 文档 ID/字段路径，尚未完整复现已登录 Presentation 内点击后右侧编辑器定位；该项仍需人工验收。Safari/Edge/真实手机及多人浏览器会话未测试。

## 人工验收步骤（不要 Publish）

1. 本地 `http://localhost:3000/studio` 登录 → Presentation。Home、Features、Pricing 仍需保留原有真实差异及点击验收待办，详见原说明。
2. Download：将双语 Hero 和一条平台介绍改为明显不同的文字，保存草稿；可替换展示图片、修改安装步骤/FAQ/CTA。确认两个下载按钮仍禁用。
3. Referral Rewards：打开固定 `page-referral` 文档（没有内容时先保存草稿即可），填写双语 Hero/流程/FAQ，保持 Coming Soon。不得创建推广链接或收益数据。
4. Site Settings：修改现有导航条目的双语名称或 Footer 介绍，不新建重复导航，保存草稿。
5. 分别选 EN/中文，开启 Edit，点击标题、图片、流程/步骤、FAQ、导航与 Footer，逐一核对右侧字段。继续输入并等待保存，确认预览更新。
6. 另一无痕窗口访问相同路由，应仅显示 published/静态回退；退出预览后当前窗口也恢复正式内容。
7. 请记录通过的页面与字段，以及失败时具体点到哪里；不要仅以构建或模拟测试替代真实点击验收。

线上 Studio 尚未部署本轮更新，团队 Preview 环境也未在本轮部署。未来仍需安全部署独立预览站、设置准确 Origin/CORS 和服务端 Token，再另行部署 Studio。不要把 localhost 当作团队正式预览地址。
