# 重构交接文档 — adminApp 可替换 Package 架构

> 给新对话窗口：读完本文件即可继续。先读权威文档与计划，再按"下一步"行动。

## 一句话目标
让 adminApp 成为通用内核，**替换 `src/package/` 即可切换项目**、替换 `src/package/ui/` 即可换皮肤。core/shared 不含项目专属内容。

## 权威文档（必读）
- 设计：`docs/superpowers/specs/2026-06-20-project-package-architecture-design.md`
- 总路线图（5 阶段，含 P2 拆为 2a/2b/2c）：`docs/superpowers/plans/2026-06-21-project-package-refactor-roadmap.md`
- 进度账本（每个 Task 的 commit）：`.superpowers/sdd/progress.md`

## 当前进度
- 分支 `deepseek-refactor`，主分支 `main`。
- **Phase 1 完成**（契约与稳定装配点）：`src/core/{contracts,app,routing}`、`src/shared/i18n`、`createAdminApp`、依赖边界测试。计划：`.../plans/2026-06-21-phase-1-contracts-and-assembly.md`。
- **Phase 2a 完成**（app 从 package 启动）：`src/package/{identity,routes,ui/{shell,screens,index.ts},index.ts}`；`main.tsx` 现为 `createAdminApp(projectPackage).mount()`；`App.tsx` 已删。计划：`.../plans/2026-06-21-phase-2a-boot-from-package.md`。
- 门禁状态：`npx vitest run` 全量 **363/363 绿**；`npx tsc -b` 绿；`npm run build` 绿；`npm run dev` 干净启动。
- 最新 commit：`10a5847`。

## 架构现状（关键事实）
- 三层 `core / shared / package`，依赖方向：`core`→只引 `@/core`、`@/shared`、npm；`package`→引 `@/core`公开入口+`@/shared`+npm（**迁移期临时**还引 `@/features|@/admin|@/app|@/config`，P5 删）。
- `core/contracts` 是契约唯一 barrel：ProjectPackage/ProjectIdentity/AdminRouteDefinition/EntityDefinition/EntityAdapter/CoreBlock/BlockDefinition/PageBuilderDefinition/AdminShell*/AdminMenu*/ProjectUiDefinition。
- `core` 据 `routes`+`menuGroups` 构建菜单（`core/routing/buildAdminMenu.ts`），经 `core/app/ShellHost.tsx` 注入 `package` 的 `AdminLayout`。
- `package/ui/screens` 当前是**薄包装器**，委托给现有 `@/features/*`、`@/admin/*`（垂直切片策略，2c 再换真身）。
- `ProjectPackage.entities` 暂为 `[]`，`pageBuilder` 暂省，`blockViews/blockEditors` 为 `{}`。
- 边界测试只约束 `core` 与 `shared/i18n`（`src/test/architecture/dependency-boundaries.test.ts`，扫描跳过 `*.test.*`）；`shared/media`、`shared/forms/controls` 仍有 `@/ui`/`@/types` 遗留依赖，留待 P4/P5。

## 下一步
1. **先人工浏览器验证 2a**：`npm run dev` → http://localhost:3000，确认品牌/菜单/路由/语言切换正常、各页面等价于重构前。
2. 验证无误后 **编写 Phase 2b 计划**（UI 基础层迁移）：
   - `src/ui/{primitives,forms,media,navigation}` → `package/ui/{primitives,forms,media}`；`src/lib/utils`(cn) → `shared/utils`；旧路径留兼容 re-export。
   - 注意 `AdminLayout` 依赖 `@/features/build` 的 `BuildTrigger`，迁出策略要一并考虑。
3. 之后 **Phase 2c**：薄包装器→`package/ui/screens` 真身 + `package/{types,entities,adapters}`；包装器透传 `routeId`（`createElement(Component,{routeId})`）。
4. 再 **P3**（Blocks/Editors）→ **P4**（提取 core 通用 CRUD/PageBuilder）→ **P5**（删旧路径+替换验证）。

## 工作方式（重要）
- 用 `superpowers:writing-plans` 写计划、`superpowers:subagent-driven-development` 执行（每 Task：implementer→review→fix）。
- skill 脚本目录：`C:/Users/78203/.claude/plugins/cache/claude-plugins-official/superpowers/6.0.3/skills/subagent-driven-development/scripts/`（`task-brief PLAN N`、`review-package BASE HEAD`）。
- subagent 用 **haiku** 可靠（本会话 sonnet/opus 间歇性 500）；implementer 转录任务用 haiku，终审同。
- 每 Task 后跑 `npx vitest run` + `npx tsc -b`；改 `core` 契约可能牵连消费端，注意"红色构建"耦合（2a 的 T1/T2 即如此，需合并为一个绿色检查点）。
- 命令：`npx vitest run [path]`、`npx tsc -b`、`npm run build`。Windows + git bash，路径别名 `@/*`→`src/*`，`verbatimModuleSyntax:true`（仅类型用 `import type`）。

## 已知坑
- `git add -A` 会误提交 `.claude/`、`CLAUDE.md`、`docs/claudeChat.md` 等未跟踪文件——提交时**只 add 目标文件**。
- JSX 文件必须 `.tsx`（曾把含 JSX 的文件误命名 `.ts`）。
- 模型问答：当前为 **Claude Opus 4.8**（claude-opus-4-8）。
