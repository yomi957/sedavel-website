# CMS 第二阶段：增量映射与第一批闭环

本批：公共 Site Settings + `/features`。不迁移其他页面，不写入、覆盖或删除 Sanity 数据；无 Git 提交/推送或部署。

## 修改前的映射和未接入字段

| 页面/区域 | 已有模型及数据 | 原来的前台来源 | 本批结果 |
| --- | --- | --- | --- |
| Home Hero | `homePage.heroTitleEn/Zh`, `heroDescriptionEn/Zh`, `heroImage`, `seo` | 已发布 CMS + `home-content.ts` 回退 | 保留 |
| 首页功能、功能页功能 | `feature.nameEn/Zh`, `descriptionEn/Zh`, `benefitsEn/Zh`, `image`, `displayOrder`, `publicationStatus`, `isPublic`, `showOnHomepage` | 已发布 CMS + 默认四大功能 | 复用同一条记录；图片增加裁剪、焦点、标题和展示预设支持 |
| Home 其他内容 | 价值、场景、FAQ、定价概述、底部 CTA | `lib/home-content.ts` | 本批不迁移 |
| 全站设置 | `siteSettings.websiteName`, `contactEmail`, `socialLinks`, `seoDefaultTitle/Description`, `defaultLanguage` | 原来尚未读取，导航/页脚来自 `lib/i18n.ts` | 接入已发布设置；保留现有字段名 |
| Features 页面壳 | 原来没有页面文档 | `features-page.tsx`, `page-hero.tsx`, `feature-showcase.tsx` | 新增 `websitePage`，固定 ID `page-features`，`pageKey=features` |
| Pricing | 套餐表、价格、字符量、说明 | `lib/i18n.ts`、`home-page.tsx` | 不迁移、不修改价格和购买逻辑 |
| Download | 标题、介绍、平台状态、按钮 | 静态页面和 `home-page.tsx` | 不迁移，不改下载逻辑 |
| Referral、Contact、Register | 页面正文、FAQ、表单状态 | `resource-pages.tsx` / `home-page.tsx` / `register-page.tsx` | 不迁移，表单仍禁用 |
| Blog | `blogPost` 含双语正文、slug、分类、时间及 SEO | 前台仍使用 `lib/resources.ts` 的示例文章 | 下一批迁移；不删除旧文章 |
| Help | `helpArticle` 含双语正文、分类、排序及 SEO | 前台仍使用本地文章和搜索 | 下一批迁移；不删除旧指南 |

## 重复字段的归属

- `homePage.featureSections` 是旧引用字段，仍保留；目前首页选择权仍属于 `Feature.isPublic/showOnHomepage/displayOrder`，不偷偷改变已发布选择规则。
- Feature 的名称、介绍、优势、状态和图片只在 Feature 编辑。页面模块只存引用，先经过公开可见性过滤，不会通过页面引用公开草稿/隐藏/归档功能。
- `websitePage.hero` 是唯一主 Hero。`heroSection` 作为复用类型已注册，不放入 Features 的正文模块数组，避免多个 H1。
- 页面 SEO 优先于全局默认 SEO；原有首页 Hero SEO 不变。现有语言机制是同一 URL 客户端切换：服务端 SEO 使用英文，Features 切换后同步对应双语 title/description；不是独立的中英文 SEO URL。

## 新增字段与接入范围

### Site Settings

- Logo / Favicon：复用官方媒体资产，保留正式本地图标作默认。
- Navigation Items：可编辑八个既有导航的双语文案、排序和显示开关；路由仍由代码白名单控制，不能指向 Studio 或任意 URL。详见 [Site Settings 指南](site-settings-cms.md)。
- Footer Content：简介、产品/公司分组、联系/隐私/条款标签、占位声明和版权文字。
- Contact Information / Contact Email / Social Links：公开联系信息，社交链接限批准平台 HTTPS 域名。
- Global CTA Text：导航及首页注册按钮文案，链接固定 `/register`。
- Default SEO / Default Language：原字段保留并读取。默认语言只在用户还未主动切换时应用，不覆盖用户选择。
- CMS favicon 在前台挂载后优先于本地默认 icon；不删除 `app/icon.svg`，Studio 不受影响。

### Features Page

在 Studio → **Features Page / 功能页内容** 编辑固定文档 `page-features`：

- Hero：双语标题/说明、brand/deep/pale 预设、背景图片、装饰图片、装饰开关、两个站内 CTA。
- Modules：Feature Section、Image & Text、Card Grid、FAQ、CTA Banner、Pricing Preview；每项有显式排序和显示开关。
- Feature Section：可选引用；空引用表示全部允许公开展示的功能。缺少整个模块时仍保留现有功能展示；明确关闭模块时尊重开关。
- Display Labels：暂无功能提示及图片占位文案。
- SEO：双语标题和描述。

`websitePage` 在本批作为 Features 单例使用，固定 ID `page-features` 和 `pageKey=features`；未来扩展其他页面时另行引入对应入口/模型，不通过此字段切换页面。Home 继续使用已有 Home Page，其他七个内页尚未连接通用页面文档。

### 媒体与安全

- `contentImage` 仅新增 caption EN/ZH、ratio（original/wide/square）、style（plain/rounded/framed），旧 alt 和资产字段不变。
- 新上传接受 PNG/JPEG/WebP/AVIF，不注入自定义 SVG/HTML/JS。官方 Sanity Image 组件直接使用 CDN，保留之前的兼容方案，不放开私有 IP。
- 图像读取校验项目、dataset、主机和尺寸；裁剪转换为 Sanity CDN rect，焦点用于 CSS object-position。页面模板和布局仍由代码控制。
- CTA 限已有站内路径，社交外链限批准域名，无凭据、查询参数、协议相对地址或脚本协议。
- 不存储秘密、不接软件用户数据库，不向浏览器传 API Token。

## 发布、刷新与回退

`public-content.ts` 使用原 publishedClient，`perspective: published` + `useCdn:false` + `cache:no-store` + `connection()`。React cache 仅合并同一请求的重复读取，无跨请求内容缓存。

管理员保存草稿 → Studio Publish → 刷新前台，读取最新已发布内容。网络失败、无文档或缺少某语言字段，继续使用对应语言的原静态默认内容，不使用另一语言填充。没有写入脚本或自动迁移。

草稿仅在 Studio 编辑表单内可见。本批**未开启网站草稿预览或实时预览**，后续在权限和页面接入验证后再实现，不能把当前公开网站当作草稿预览。

## 手工验收

1. `/studio` → Features Page：填写双语 Hero；添加 Feature Section，可编辑章节标题、选择原 Feature 引用；添加 FAQ 或 CTA。Publish。
2. 刷新 `/features`：核对双语文案、模块顺序/开关、图片、按钮及浏览器 title/description。
3. Site Settings：首次创建需填写原有必填项 Website Name、双语 SEO Default Title/Description 和 Default Language，再添加一项导航文案（选择 key 并填写双语 label）后 Publish，核对导航和 Footer 对应标签。不要一次性替换所有品牌资产。
4. 修改 Hero 后只保存草稿，刷新公开网站应仍是上次已发布内容；Publish 后再刷新才更新。
5. 图片在 Studio 上传真实素材，填写双语 alt，可设置 crop/hotspot/比例/标题。无图时保持标明的占位区域，不虚构产品界面。
6. 其他页面及后台账号权限保持原样。

## 后续批次

1. 确认本批真实发布闭环后，再逐页接入其他内页的展示文案；Pricing 和下载配置继续由代码保护。
2. 单独迁移 Blog / Help，保留静态文章回退、slug、SEO 和搜索行为。
3. 完善全站图片/图标使用与双语字段检查。
4. 最后接入受 Sanity 官方身份验证保护的草稿预览，不开放公开草稿查询。

官方参考：[Sanity Next.js 查询](https://www.sanity.io/docs/nextjs/query-content-nextjs)、[发布透视](https://www.sanity.io/docs/apis-and-sdks/js-client-querying)、[URL 验证](https://www.sanity.io/docs/studio/url-type)、[媒体展示](https://www.sanity.io/docs/apis-and-sdks/presenting-images)。

## Features 单例空值修复

- 专用 `features-page` 初始化模板绑定单例入口，仍从全局新建菜单隐藏，禁止复制。
- 新文档的文档级、字段级默认值都是 `features`。不会替换已有草稿或发布内容。
- `pageKey` 仍必填且只能为 `features`。已有空值草稿暂时可选唯一合法值，保存后自动只读；初始化默认值不会回填已有文档。
- 预览标题固定为 Features Page / 功能页内容，不依赖可能为空的字段。
- 刷新 Studio，重新打开原文档即可；若已有空草稿仍空，只需选择一次 Features，不要删除/重建文档，Hero/模块/SEO 原数据保留。

后续 Pricing 页面已复用 websitePage 接通，新增固定 `page-pricing` 单例；首批 Features 数据不迁移。见 [Pricing 管理指南](pricing-cms.md)。
