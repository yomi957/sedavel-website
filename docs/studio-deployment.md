# Sedavel 独立 Sanity Studio

## 共享配置

独立后台与 Next.js `/studio` 使用同一个 `sanity.config.ts`、Schema、Structure、模板和 Sanity 官方身份验证，连接同一个项目 `g117cipn` / `production`。不会复制、覆盖或迁移已有内容。

- 官网嵌入：默认 `basePath: /studio`。
- 独立构建/部署：启动脚本只在子进程设置 `SANITY_STUDIO_BASEPATH=/`，不影响 Next.js 进程。
- CLI 显式映射已有三项公开环境变量，并配置 `@/` 路径别名。不要向 Vite define 或 SANITY_STUDIO_ 变量中加入任何私密 Token。
- 生成目录 `dist/` 已加入 Git 和 ESLint 忽略；源代码仍正常检查。

## 命令

使用项目已安装、锁定的 CLI，无需重新初始化项目或安装依赖：

```sh
# 仅在没有 CLI 登录授权时执行；使用浏览器中的官方登录流程
npx --no-install sanity login

# 生成独立后台静态文件
npm run studio:build

# 部署前核对目标和域名，dry-run 不上传
npm run studio:deploy -- --url sedavel-cms --dry-run

# 首次部署：确认目标后运行
npm run studio:deploy -- --url sedavel-cms
```

`sedavel-cms` 是首选域名，实际以部署成功结果为准。不要对不属于当前团队的既有 Studio 进行覆盖部署。成功部署时 Sanity CLI 可能提示保存 appId；该 ID 是公开部署标识，不是 API Token。保存后后续更新应指向同一 Studio。

部署只上传 Studio 应用与 Schema 元数据，不向 production 写入示例文档。不要运行 dataset import、迁移、删除或初始化命令。

## 团队成员

在 Sanity Manage 选择项目 → Members → Invite，邀请同事使用自己的 Sanity 账号。无需 GitHub 权限、Node.js 或本地 Next.js。Free 当前只有 Administrator/Viewer，Viewer 不能编辑；Administrator 权限宽。需要 Editor 内容编辑角色时先确认套餐，避免把所有运营人员授予管理员。

Sanity 官方托管会处理 SPA 路由和对应 CORS。部署后核对后台域名在允许来源中，保留 localhost:3000，不使用带凭据的通配符来源。使用两个独立账号验收草稿、发布和并发编辑。

公开网站始终只读取已发布内容。发布文案不需要重新部署 Studio；修改 Schema、模板或 Studio 配置后需重新构建/部署。

## 已部署实例

- 地址：https://sedavel-cms.sanity.studio/
- 项目：`g117cipn`；数据集：`production`。
- 部署 appId：`m93mdu2m1uinkptudli3ywcg`（公开标识，已保存到 sanity.cli.ts）。
- 后续更新使用 `npm run studio:deploy`，更新同一后台。不要另行初始化项目或导入覆盖内容。

线上验证：官方部署命令成功完成，Schema 已上传。`https://sedavel-cms.sanity.studio/` 当前由 Sanity 跳转至对应的官方 Studio/认证入口，匿名认证请求返回 HTTP 200。未使用或复用个人浏览器凭据进行自动登录；团队需各自登录验收编辑、草稿和发布。原有 localhost:3000 与 localhost:3333 CORS 来源保持不变。
