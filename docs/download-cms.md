# Download Page 内容管理

## 范围与单例

复用已有 `websitePage` 模型，新增固定 `page-download` 单例及 `download-page` 初始化模板。Features / Pricing 的 ID、字段、内容和查询保留。后台入口是 **Download Page / 下载页内容**。

Page 自动填 `download` 并锁定；历史空值或错值可在此单例补选正确项，必填与 ID 匹配校验不删除。新文档不覆盖任何已发布文档。

## 可以编辑的内容

- Hero：双语标题和说明、受控的 brand / deep / pale 背景、背景/装饰图片与双语 alt、装饰开关、站内 CTA。
- Download Display Content：双语章节标题、介绍。
- Platform Cards：选择 macOS 或 Windows，编辑双语名称、介绍、禁用按钮文字及状态说明；选择预设图标或上传位图图标；上传平台展示图片并控制显示。
- Technical field labels：版本、系统要求、架构、大小、发布日期的双语标签。
- Release details：经核实的版本号、大小、日期、双语系统要求与架构说明。默认均为空。
- Installation：章节开关、双语标题/介绍、步骤。步骤可指定 macOS / Windows / all，编辑双语文字与图片、图片开关和步骤显示开关；按数组顺序显示。
- Modules：FAQ、底部 CTA、可选图文和卡片模块，复用现有模块排序与显示开关。
- SEO：页面顶层双语 title/description；Download 内部的 Share Image EN/ZH 管理双语页面分享图。

## 下载与技术资料安全边界

当前没有已核实的安装包地址。macOS 和 Windows 按钮始终是原生 **disabled button**，没有 href、download 属性或下载处理函数。页面明确显示 Coming Soon。

CMS **没有安装包 URL 或 file 字段**，不支持上传/分发可执行文件。即使 API 数据含 downloadUrl、status=available、file 等未知字段，读取层也不投影、不保留、不使用。仅图片资产可展示，并经过已有当前项目 Sanity 图片 CDN 与位图格式校验。

实际可下载状态由 `lib/download-platforms.ts` 的代码边界控制，目前两个平台都固定为 comingSoon。未来需要真实官方发布地址时，必须另行核实官方来源并做代码审查；本轮没有伪造示例地址或开放编辑人员填写地址。

版本、最低系统、架构、大小、日期目前默认 **Pending confirmation / 待确认**。仅在有官方已核实资料时，管理员才可开启对应平台的 **Technical details verified / 技术资料已核实**。这是人工资料确认，不代表网站自动验证了安装包或真实运行环境。

未开启确认时，服务端直接剔除这些技术值，不只是前端隐藏；开启后仍缺少的字段继续显示待确认。确认技术文案不会开放下载按钮。不要为完成表单而填写猜测版本、虚构大小或兼容范围。

## 回退、语言与 SEO

没有发布文档、网络失败或字段为空时，保留现有绿色 Hero、原下载 CTA 介绍、两个即将开放的平台、默认 FAQ 和底部 CTA；不空白。

字段按同一语言回退，不用英文内容填充缺失中文。底部 CTA 使用现有注册预览和帮助中心路径，不创建账户或下载动作。FAQ / CTA 缺失时显示默认内容；要隐藏某类模块，请显式创建后关闭 Visible。

只使用原 published client，`published` perspective、`useCdn:false`、`cache:no-store` 和 `connection()`。发布后刷新可读最新内容，无需提交或重新部署；没有开放草稿预览。

Download 页面 SEO 优先于本页原静态 SEO；页面分享图优先于同语言 Site Settings 默认图。服务端沿用当前英文默认渲染，客户端同页切换可同步双语 SEO 与分享图；未新增语言路由或独立双语索引页面。

## 后台操作

1. 刷新 Studio，打开 Download Page。不要删除或重建已有文档。
2. 编辑 Hero、macOS/Windows 平台文案；图片必须选择真实图片资产并填写双语 alt，不能只填替代文本而未选图片。
3. 缺少官方版本资料时，让确认开关保持关闭，不填虚构信息。
4. 按需填写真实安装教程、FAQ、CTA、SEO 及分享图，Publish。
5. 刷新 `/download`，核对双语内容；两个下载按钮仍应禁用。

## 本轮主要文件

- `sanity/schemaTypes/page-content.ts`、`sanity/structure.ts`、`sanity.config.ts`
- `sanity/lib/public-content.ts`
- 新增 `lib/download-platforms.ts`、`lib/download-cms.ts`
- 新增 `components/download-page.tsx`、`components/download-page.module.css`
- `app/(website)/download/page.tsx`
- 新增 `tests/download-cms.test.mjs`，调整已有 Schema 测试以覆盖第三个页面单例

未修改 Pricing 目录、注册认证、导航或其他页面业务逻辑；无新依赖，不提交 Git、不推送、不部署。
