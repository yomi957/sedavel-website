# Draft Mode 退出后的 Static Shell Invariant

日期：2026-11-02。Next.js 16.4.3，App Router，Cache Components / Partial Prefetching，开发 Turbopack、生产 Webpack。

## 根因与稳定复现

这是当前 Next 开发静态壳校验与全 UA 阻塞 Metadata 的兼容问题，不是只有 Cookie 退出时才发生。原配置 `htmlLimitedBots: /.*/` 在所有环境强制等待异步 Metadata；公开页面的 Metadata 又需要实时 CMS / Draft 状态。开发校验在这个组合下得到空静态壳，却没有记录可以解释它的动态错误，于是抛框架 Invariant。

- 原有真实开发日志在 Home 与 Pricing 都有错误。没有预览 Cookie 的普通首页访问、重启后的独立同版本实例也稳定复现。
- HTTP 可能仍为 200，因为错误来自后台开发校验，不等于当前请求的动态内容完全不能渲染。不能仅依据状态码或页面可见判断修复。
- 临时源码副本仅取消全 UA Metadata 阻塞、保持全部 CMS/组件/Suspense/Cache Components 原样，错误消失。
- 临时运行时诊断记录：`prelude=1 (Empty)`、`hasAllowedDynamic=true`、`hasDynamicMetadata=false`、`hasSuspenseAboveBody=false`、`dynamicErrors=0`。这些是框架内部跟踪状态，不能将 hasDynamicMetadata=false 误读成业务 Metadata 完全静态。已有合法动态边界，却走到无法解释空壳的分支，属于框架校验边界情况。

### 完整服务端调用链

默认控制台折叠为 `at ignore-listed frames`。为捕获完整栈，只在隔离依赖副本做了诊断；原项目依赖没有修改，诊断后临时运行时也逐字节恢复。保留调用链如下（隔离目录前缀归一化，行列来自当次诊断构建）：

```text
InvariantError: Invariant: Route "/" did not produce a static shell and Next.js was unable to determine a reason. This is a bug in Next.js.
    at getStaticShellDisallowedDynamicReasons (<isolated-app>/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js:318:5237)
    at validateStaticShellAtStage (<isolated-app>/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js:324:49243)
    at async validateStaticShell (<isolated-app>/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js:324:40401)
    at async runValidationInDev (<isolated-app>/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js:324:38612)
    at async Module.runDevValidation (<isolated-app>/node_modules/next/dist/compiled/next-server/dev-validation-worker-turbo.runtime.dev.js:27:25812)
```

没有在源码中打补丁到 Next 内部，也没有删除缓存来当作最终修复。

## 最小兼容修复

`next.config.ts` 仅在 `NODE_ENV === "production"` 使用 `htmlLimitedBots: /.*/`；开发使用 undefined，即 Next 默认 Metadata 流式/机器人处理策略。

- 保留 Cache Components、Partial Prefetching、全部校验、Studio、Presentation、Visual Editing 和 Live Content。
- 不添加 `instant=false`、不加全站动态开关、不把页面改为客户端渲染，也不新增包或升级 Next。
- 生产配置与修复前等效，仍等待 head Metadata，保留生产 HTML Canonical/OG 和 Blog 提前 notFound 的 404 策略。
- 没有修改退出 Route Handler。真实浏览器已确认 Exit 清除 bypass Cookie，返回后不再展示预览状态。
- 检查的动态读取位于既有 Suspense 下；Cookie/headers 没有被塞入公共缓存。服务端数据等待均正常完成，预览 mutation 计时器已有清理和 Promise resolve；没有证据需要改这些逻辑。

官方参考（以项目安装版同名文档核对过 API）：

- https://nextjs.org/docs/messages/blocking-route
- https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- https://nextjs.org/docs/app/api-reference/functions/draft-mode

以上文档支持动态读取的 Suspense 边界和 Metadata 流式策略；开发环境条件分支是基于本次 A/B 复现得出的兼容方案，不是声称官方已经发布本问题的补丁。

## 验证记录

### 真实浏览器与真实项目授权

使用独立 Chrome 配置，不复用用户个人浏览器资料；仅通过已存在的本地 Presentation 短期授权握手，没有创建或修改 CMS 业务内容。没有输出 API Token 或授权 secret。

- 修复前：真实服务器已有同类错误，本轮普通/退出/刷新流程继续新增记录；独立实例重启同样复现。
- 修复后：官方授权进入 Home、真实 Exit 按钮、回首页、普通刷新、ignoreCache 硬刷新、新标签、独立无痕 context、EN/中文切换均通过；对应重启后的真实开发日志 Invariant=0。
- Pricing 正常，Standard 仍为 $54.90；普通页面不包含草稿控件或读取 Token。
- 此次没有修改真实 Hero 文案；真实会话测试证明授权、界面与退出，**不声称新做了不同业务文案的真人草稿差异验收**。

### 自动化隔离数据

保留现有官方授权实现，仅在测试进程拦截 Sanity 响应，提供不同的 Published Home / Draft Home。

- 匿名 published、无效授权 401、正式 helper 合法握手、授权 draft、同时匿名仍 published、Exit Cookie 到期、连续三次返回/刷新、Pricing 均通过。
- 恢复临时依赖原样后，独立开发服务第一次启动及再次重启都通过；日志无静态壳 Invariant。
- 生产构建 HTTP 回归通过同样流程；Home/Pricing 的 Description 在 head，缺失 Blog 返回 404。
- 单元回归增加开发/生产 Metadata 策略、Cache Components 保留和退出 Cookie 清理属性；全部 91 项测试通过。
- ESLint、TypeScript、生产构建通过。构建使用临时保留示例 SITE_URL、SITE_INDEXING=disabled，不把测试域名写进 .env.local。

## 限制与后续

- 开发恢复 Next 默认流式 Metadata，因此不要用 next dev 的初始 head 或缺失页面传输状态替代正式 SEO/404 验收；必须用生产构建验证。生产策略没有改变。
- 本轮未部署线上预览站，未复测 Safari/Edge/真机、第三方 iframe Cookie 限制或多人正式环境。
- 无需为了使用当前修复先升级 Next.js；没有确认更高版本是否修复此具体问题。未来升级后应复跑本流程，再决定是否移除兼容分支。
- 本轮未提交、推送、部署，也未重做桌面 ZIP；已有 ZIP 是旧快照，不会自动包含此修复。

## 人工回归步骤

1. 启动本地 npm run dev，匿名首页正常。
2. /studio 登录 → Presentation → Home，授权预览；可保存明显不同草稿但不要 Publish。
3. 通过 EN/中文按钮切换；点击 Exit，确认回首页且无预览状态。
4. 普通刷新、硬刷新、同会话新标签、无痕访问；检查服务端日志，而非仅浏览器外观。
5. 重启开发服务重复 1–4；访问 /pricing 核对状态与原价格。
6. 配置测试 SITE_URL 后生产 build/start，再验授权/退出、published 隔离、head Metadata、缺失 Blog HTTP 404。
