# 可替换项目 Package 重构 — 总路线图

> **文档地位**：本文件是整库重构的**总纲与阶段索引**，不含 bite-sized 步骤。每个阶段有独立的详细实施计划（detailed plan），在前一阶段完成并验收后才编写——因为后续阶段的具体步骤依赖前一阶段建立的契约。
>
> 权威设计：[`../specs/2026-06-20-project-package-architecture-design.md`](../specs/2026-06-20-project-package-architecture-design.md)
> 原始需求：[`../../需求描述.md`](../../需求描述.md)

**总目标（唯一验收红线）**：替换 `src/package/` 即可把 adminApp 变成另一个项目的后台；替换 `src/package/ui/` 即可在同一项目内整体更换视觉实现。不修改 `core`、`shared`、`main.tsx` 或 `package.json`。

---

## 0. 当前代码现状（重构起点）

勘察结论——当前是 feature-sliced 架构，与目标 `core/shared/package` 差距很大：

| 现状目录 | 内容 | 目标归属 |
|---|---|---|
| `src/App.tsx` | 硬编码全部路由与编辑器导入 | 拆为 `core/routing` 引擎 + `package/routes` 声明 |
| `src/main.tsx` | `createRoot → QueryProvider → App` | `createAdminApp(projectPackage).mount()` |
| `src/features/<domain>/{api,model,ui}` | 11 个业务域（products/blogs/pages/page-builder/...），含 API+model+UI | 通用部分→`core/entities`；项目类型/Adapter→`package/entities`+`package/adapters`；UI→`package/ui/screens` |
| `src/components/blocks/*.tsx` | 21 个前端展示组件 | `package/ui/blocks` |
| `src/ui/themes/default/page-builder/property-editors/*` | 22 个属性编辑器 | `package/ui/editors` |
| `src/ui/primitives` `src/ui/forms` `src/ui/media` | shadcn 基础组件、双语输入、媒体控件 | `package/ui/{primitives,forms,media}` |
| `src/types/*` | `Translation` 与 `Product/Blog/BlockType/CustomPage` 等混在一起 | `Translation`→`shared`；业务类型→`package/types`；通用泛型→`core/contracts` |
| `src/config/componentRegistry.ts` `src/config/blocksContentPreview` | Block 元数据、预览假数据 | `package/blocks` |
| `src/context/LanguageContext.tsx` | 唯一应用级 Context | 保留，移入 `core/app`（契约不变） |
| `src/app/{providers,adapters,queryClient}` | Provider 装配、page-builder 装配、Query 配置 | `core/app` + `package/page-builder` |
| `src/shared/{api,forms,media}` | API client、双语控件、上传 | 大部分留 `shared`；带业务语义的部分移出 |
| `src/test` | Vitest + Testing Library + MSW | 保留，扩充 fixture/边界测试 |

**已有的好基础**：`src/features/page-builder/model/`（reducer / blockCommands / blockCatalog / usePageBuilderController）结构清晰，是 `core/page-builder` 提取的起点。

---

## 1. 目标目录（来自设计 §4）

```text
src/
├─ core/      app/ contracts/ entities/ page-builder/ routing/ shell/
├─ shared/    api/ forms/ media/ utils/ i18n/
├─ package/   index.ts identity/ types/ routes/ entities/ blocks/
│             page-builder/ adapters/ ui/{index.ts,primitives,forms,media,
│                                          feedback,shell,screens,editors,blocks}
└─ main.tsx
```

依赖方向（硬性规则，设计 §5）：

```text
main ──→ core, package
package ──→ core/contracts, shared
core ──→ core/contracts, shared
shared ──→ 第三方依赖
```

- `core` 不得导入 `package`；`shared` 不得导入 `core`/`package`。
- `package` 只能导入 `core` 公开入口与 `shared`。
- `core` 中禁止出现项目名、具体实体名（Product/Blog）、具体 BlockType。
- `package` 不得新增 `package.json` 依赖。
- 除 `package/ui` 外，任何目录不得定义 React 视觉组件。
- routes / entities / page-builder 只通过稳定 id（screenId/previewId/editorId）引用 UI。

---

## 2. 阶段总览

每个阶段都必须独立产出**可启动、可测试**的软件（`pnpm/npm test`、`npm run build` 通过，应用可运行）。

| 阶段 | 名称 | 交付物 | 详细计划 |
|---|---|---|---|
| **P1** | 契约与稳定装配点 | `core/contracts`、`defineProjectPackage`/`defineProjectUi`、`createAdminApp` 路由引擎、边界/完整性测试（用 fixture 包验证，**不动现有 App**） | [`2026-06-21-phase-1-contracts-and-assembly.md`](2026-06-21-phase-1-contracts-and-assembly.md) ✅ 已编写 |
| **P2** | 建立 Kellogg package（业务 screen 已完成） | 品牌/菜单/路由/实体类型/DTO Adapter 迁入 `package`；Shell+基础组件+全部业务页面迁入 `package/ui`；`package/ui/index.ts` 与 `ProjectUiDefinition`；`main.tsx` 切换到真实包 | 2a、2b 已完成；2c 业务 screen 已完成（含 dashboard）。仅 `components` 与 `page-builder` 包装器留待 P3 随 Blocks/Editors 整体迁移 |
| **P3** | 迁移 Blocks 与 Editors ✅ | Block/Page 类型、业务 registry、稳定 preview/editor id、PageBuilderDefinition 与 legacy UI adapter 已接入；Blocks/Editors 组件文件已迁入 `package/ui` | 已完成 |
| **P4** | 提取通用内核（进行中） | 从 features 提取 Query/Mutation/CRUD 编排到 `core/entities`；提取 Page Builder 会话/命令/历史/保存到 `core/page-builder`；提取路由/Shell/Entity Controller；清除 core 中所有项目类型 | 已开始：Block 通用命令已迁入 `core/page-builder` |
| **P5** | 删旧路径 + 替换验证 | 删除已迁移的 `features`/`ui/themes/default`/`components/blocks`/`types` 旧路径与兼容导出；ESLint+架构测试落地；**最小替换包**与 **UI-only 替换包**双重验证 | 待 P4 完成后编写 |

---

## 3. 各阶段范围、关键文件与验收

### P1 — 契约与稳定装配点 ✅（详见独立计划）

**做什么**：纯新增。建立 `core/contracts` 全部 TypeScript 契约、`defineProjectPackage`/`defineProjectUi` 验证函数、`createAdminApp` 路由装配引擎，并用 **test fixture 包**驱动；新增 core/shared 依赖边界测试与 package 完整性测试。**现有 `App.tsx`/`main.tsx` 保持不变并继续运行。**

**唯一对既有代码的改动**：把 `Translation`/`Language` 的规范定义移到 `src/shared/i18n/translation.ts`，`src/types/common.ts` 改为 re-export（小、安全、有测试覆盖）。

**验收**：
- `core/contracts` 导出设计 §6–§13 的全部契约类型。
- `defineProjectPackage` 对 route id/path、entity key、block type 重复，以及 screenId/previewId/editorId 缺失，能在开发期抛出聚合错误（有测试覆盖）。
- `createAdminApp` 能用 fixture 包在 MemoryRouter 下渲染出菜单与 screen（有测试覆盖）。
- 依赖边界测试：`core` 不导入 `@/features|@/components|@/ui|@/app|@/types`；`shared` 不导入 `core|package|features`。
- `npm test`、`npm run build` 全绿；应用照常启动。

### P2 — 建立 Kellogg package（体量过大，再拆为 2a/2b/2c 子计划）

**做什么**：把"项目专属"内容搬进 `package`，并让 `main.tsx` 通过 `createAdminApp(kelloggPackage)` 启动。

勘察实证：P2 触及 shell、全部 UI 层、路由、13 个业务域屏幕、实体定义与 DTO Adapter，且 features 间有跨域耦合（pages/categories/navigation 被多处引用）。单一 bite-sized 计划过大，故与顶层"路线图+逐阶段细化"同构地再拆为三个子计划，每个独立产出可运行软件：

**已确认的两项策略决定（2026-06-21）：**
1. **垂直切片 + 包装器**：2a 先建真实 Shell + identity + 路由，让 `main.tsx` 尽早切到 `createAdminApp(projectPackage)`；`package/ui/screens` 暂为"薄包装器"委托给现有 feature 组件，使 app 立刻跑在 package 上、所有路由可用、最早验证整条契约链。迁移期允许 `package → features` 临时兼容导入（P5 删除）。后续 2c 再把屏幕真身搬入 package。（替代方案"水平分层迁移"已否决——风险集中在最后切换点，且很久看不到 package 真正驱动 app。）
2. **core 据 routes 构建菜单**：扩展 P1 的 `AdminShellDefinition`，Layout 接收 core 从 `routes`（`menu.group/order`）+ 包级 `menuGroups`（分组标题/图标）构建的菜单模型、identity 与当前语言；Shell 用稳定 id 渲染菜单，不硬编码路由。

| 子计划 | 范围 | 详细计划 |
|---|---|---|
| **2a** | 包脚手架 + identity + 真实 Shell（从 Dashboard 移植菜单/品牌/语言切换）+ `package/routes` + `package/ui/screens` 薄包装器 + 扩展 shell 契约 + `main.tsx` 切换。**结果：app 从 package 启动，全部现有路由经 package shell 渲染。** | [`2026-06-21-phase-2a-boot-from-package.md`](2026-06-21-phase-2a-boot-from-package.md) ✅ 已编写 |
| **2b** | UI 基础层 `src/ui/{primitives,forms,media,navigation}` → `package/ui/{primitives,forms,media}` + `src/lib/utils`(cn) → `shared/utils`；旧路径兼容 re-export。 | 待 2a 完成后编写 |
| **2c** | 每个业务域：薄包装器 → `package/ui/screens` 真身；建立 `package/types`、`package/entities`(EntityDefinition)、`package/adapters`(EntityAdapter)；处理配置型单例（company/header/footer）与特殊业务（inquiries/build）。**业务 screen 已完成：reviews、blog-categories、blogs、categories、products、media UI、company-info、navigation、footer、pages UI/index、inquiries、dashboard。media 属技术能力，不建立伪业务 EntityDefinition；company-info、navigation 与 footer 以仅更新的配置单例接入；询盘设置作为 pages 特殊 screen，不建立伪实体。`components` 与 `page-builder` 属 P3 Blocks/Editors 整体迁移范围，不在 P2 拆半搬运。** | [`2026-06-22-phase-2c-1-reviews-pilot.md`](2026-06-22-phase-2c-1-reviews-pilot.md) |

**P2 整体验收**：`main.tsx` 仅 `createAdminApp(projectPackage).mount()`；菜单/路由/实体页面均由 package 驱动；所有 React 视觉组件位于 `package/ui`；`npm test`/`build` 通过；应用功能等价于重构前。

**P2 暂缓项**（明确不在 P2 做）：真实 `pageBuilder` 定义与 `blockViews`/`blockEditors`（P3）；通用 Query/Mutation/CRUD 提取到 core（P4）；删除旧 `features`/`ui`/`admin`/`config` 路径与兼容层（P5）。2a 的 `ProjectPackage.entities` 暂为空、`pageBuilder` 暂省略；page-builder 路由经薄包装器委托给现有实现。

### P3 — 迁移 Blocks 与 Editors

**做什么**：拆分 Block 的"数据/元数据"与"视觉"，全部视觉集中到 `package/ui`。

**执行结果（2026-06-23）**：自动化重构先完成非 UI 基础，随后由项目维护者将
`src/components/blocks` 与 `src/ui/themes/default/page-builder/property-editors` 中的组件文件
迁入 `package/ui`。本阶段已经完成：

- 将 Block/Page 数据类型迁入 `package/types` 或 `package/blocks/types`。
- 将默认数据、分类、singleton 等业务元数据迁入 `package/blocks`。
- 建立稳定的 preview/editor id registry 与 `PageBuilderDefinition`。
- 建立 UI 适配入口并连接迁移后的 Blocks/Editors。
- 删除旧 Blocks/Editors 文件路径。

**关键迁移映射**：
- `src/components/blocks/*.tsx`（21 个）→ `package/ui/blocks/blocks/*.tsx`。
- `src/types/blocks.ts` 的 `BlockType`/Content + `src/features/page-builder/model/blockCatalog.ts` 默认值/元数据 → `package/blocks/types/*` + `package/blocks/registry.ts`（无 React）。
- `src/ui/themes/default/page-builder/property-editors/*`（22 个）→ `package/ui/editors/page-builder/property-editors/*`。
- `package/ui/blocks/registry.ts`（type↔previewId）、`package/ui/editors/registry.ts`（type↔editorId）、`package/ui/blocks/renderer.tsx`（按 type 渲染 Preview）。
- `src/app/adapters/page-builder` + `src/config/blocksContentPreview` → `package/page-builder/{definition,resources,adapters}.ts`，组装 `PageBuilderDefinition`。

**验收**：每个 Block 有稳定且一致的 preview/editor id；`package/blocks` 无 React；
Page Builder 可继续正常增删改排序、撤销重做、实时预览；Blocks 与 Editors 的视觉文件均位于
`package/ui`，旧视觉路径已删除。

### P4 — 提取通用内核

**做什么**：把散在 features 的通用业务逻辑提到 `core`，并清空 core 的项目依赖。

**关键提取**：
- `core/entities`：列表/详情/分页查询、搜索排序筛选状态、增改删 Mutation、Query Key/缓存失效/乐观更新、表单草稿/保存状态/错误重试、列表页与编辑页通用 Controller（泛型，消费 `EntityDefinition`+`EntityAdapter`）。
- `core/page-builder`：从 `features/page-builder/model`（reducer/blockCommands/usePageBuilderController）提取编辑会话、命令、历史、草稿、保存流程，只认 `CoreBlock`。
- `core/routing` + `core/shell` + `core/app`：路由生命周期、鉴权、错误边界、Provider 装配、`LanguageContext`。
- 删除 core 中所有具体实体/BlockType 依赖。

**验收**：core 用伪 ProjectPackage 测试（不导入 Kellogg package）；Entity Controller 覆盖查询/分页/Mutation/失效；Page Builder 覆盖命令/历史/草稿/保存；package 不再实现通用请求与缓存流程。

### P5 — 删旧路径 + 替换验证

**做什么**：删除旧目录与兼容导出，落地架构守卫，完成两种替换测试。

**关键动作**：
- 删除已迁移的 `src/features`、`src/ui/themes/default`、`src/components/blocks`、`src/types`（业务部分）、`src/config`、`src/admin`、`src/app/adapters` 等旧路径与所有兼容 re-export。
- ESLint 规则 + 架构测试守卫设计 §16 全部边界（含"`package/ui` 之外无 React 视觉组件"、"routes/entities/page-builder 不直接导入 `package/ui` 内部文件"、"main 是唯一双向装配点"）。
- **最小替换测试包**：不同品牌 Login/AdminLayout、1 个自定义实体、2 个不同 Block + 2 个 Editor、不同菜单路由。验证只替换 `src/package` 即可切换，`package.json` 不变，类型检查+测试+生产构建通过，应用显示测试包内容。
- **UI-only 替换测试包**：仅替换 `src/package/ui`，保持 identity/types/routes/entities/blocks/page-builder/adapters 不变。验证路由 path/API/实体行为不变，视觉全部来自新 UI，缺失/错误 id 被 TypeScript 发现。

**验收**：设计 §17 全部验收标准达成。

---

## 4. 关键风险与跨阶段注意事项

1. **`shared` 当前并不干净**（勘察实证）：`shared/media/*` 依赖 `@/ui/*` 与 `@/types`(R2Image)，`shared/forms/controls/*` 依赖 `@/types`(Translation)。这些违反"shared 不依赖 ui/项目类型"，属 **P4/P5** 清理。因此 P1 的边界测试**只全量约束 `core`**，对 `shared` 仅约束新建的 `shared/i18n`；整库 `shared` 边界守卫延后到 P4/P5。
2. **Translation 归属切换**（P1 起）：先建 `shared/i18n` 再逐步把 `@/types` 的 Translation 引用迁过去；P5 才删除 `@/types` 兼容层，避免中途大面积 import 改动。
3. **稳定 id 是解耦核心**：routes/entities/page-builder 一律用字符串 id 引用 UI；任何"直接 import UI 文件"都是回归，必须由架构测试拦截（P5 落地，但 P2/P3 编写时就要遵守）。
3. **core 零项目泄漏**：`CoreBlock` 是 core 对 Block 的唯一认知；任何 `BlockType` 字面量、`Product`/`Blog` 字段进入 core 都违规。
4. **page-builder 是最大难点**：现有 reducer/commands 与 UI 耦合较紧，P3（拆 UI）与 P4（提 core）需谨慎拆分；建议 P4 先用现有测试做安全网再搬迁。
5. **每阶段保持可运行**：迁移期允许临时兼容 re-export（旧路径 → 新位置），统一在 P5 删除，避免单阶段内出现大面积红屏。
6. **依赖零新增**：package 只能用 adminApp 已装依赖（见 `package.json`）。

---

## 5. 执行方式

后续按小型项目节奏直接推进：每次选择一个低耦合垂直切片，使用 CodeGraph 确认依赖，完成迁移后运行 TypeScript、Vitest 与生产构建门禁。无需使用 superpowers 工作流；完成一个阶段并验收后，再细化下一阶段。
