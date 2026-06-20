# 可替换项目 Package 架构设计

## 1. 背景

adminApp 需要成为可被多个项目共同使用的后台管理内核。

目标不是仅替换 UI 主题，而是让项目专属的数据类型、业务模块、后台外观、前端 Blocks、编辑器和 DTO 映射全部集中到 `src/package`。切换项目时只替换该目录，不修改通用代码或依赖配置。

不同项目除 UI 外观和 Blocks 展示组件外通常差异较小，因此 package 内部还必须支持更轻量的 UI 替换：同一项目只替换 `src/package/ui`，即可保留实体、路由、DTO、缓存和业务配置，仅更换后台外观、业务页面、编辑器与 Blocks UI。

此前“将 UI 移入 `src/ui`、业务继续留在 features”的方案无法实现这一目标，原因包括：

- Product、Page、Blog 和具体 BlockType 仍存在于通用目录。
- 路由、菜单和启用模块仍由应用入口固定。
- Block Catalog 与属性编辑器仍绑定当前项目。
- 默认 UI 与项目适配逻辑分散在多个目录。
- 更换项目仍需修改 `App.tsx`、features 或 adapters。

本设计以“通用内核 + 编译期项目包”为唯一目标架构。

## 2. 核心目标

完成后必须满足：

1. 更换项目只替换 `src/package/`。
2. 不修改 `src/core`、`src/shared`、`src/main.tsx` 或 `package.json`。
3. 项目的菜单、路由和业务模块可以增减。
4. 后端 API 路径或 DTO 不同时，由项目 Adapter 转换。
5. 登录页、后台布局和基础 UI 可随项目整体替换。
6. Product、Blog、Inquiry 和具体 BlockType 不得进入通用内核。
7. 前端 Blocks UI 可以从前端项目整目录复制。
8. 所有项目包只能使用 adminApp 已安装的公共依赖。
9. 同一项目只替换 `src/package/ui/` 即可切换整套视觉实现。
10. UI 组件不得散落在 entities、routes、page-builder 或 adapters 中。

## 3. 架构方案

采用编译期项目包注册表。

`src/package/index.ts` 导出唯一的 `ProjectPackage` 对象。通用内核只依赖公共契约，不直接导入 package 内部文件。

不采用：

- 分散固定路径导入：缺少统一完整性校验。
- 运行时插件系统：加载、类型和错误处理复杂度过高。
- 独立 npm/workspace 包：当前只需替换本地目录。

## 4. 目标目录

```text
src/
├─ core/
│  ├─ app/
│  ├─ contracts/
│  ├─ entities/
│  ├─ page-builder/
│  ├─ routing/
│  └─ shell/
├─ shared/
│  ├─ api/
│  ├─ forms/
│  ├─ media/
│  └─ utils/
├─ package/
│  ├─ index.ts
│  ├─ identity/
│  ├─ types/
│  ├─ routes/
│  ├─ entities/
│  ├─ blocks/
│  ├─ page-builder/
│  ├─ adapters/
│  └─ ui/
│     ├─ index.ts
│     ├─ primitives/
│     ├─ forms/
│     ├─ media/
│     ├─ feedback/
│     ├─ shell/
│     ├─ screens/
│     ├─ editors/
│     └─ blocks/
└─ main.tsx
```

### 4.1 core

保存跨项目共用的后台业务能力：

- 应用启动与 Provider 装配。
- 路由生命周期、鉴权和错误边界。
- 通用 CRUD、分页、搜索和筛选编排。
- TanStack Query 缓存、失效和 Mutation。
- 表单草稿、保存状态和错误重试。
- Page Builder 编辑会话、历史记录和 Block 操作。
- 项目包所需的公共 TypeScript 契约。

### 4.2 shared

保存无项目和业务实体语义的技术能力：

- API client 与通用错误解析。
- 文件上传、哈希和媒体处理。
- 通用表单辅助。
- 无业务语义的工具函数。

### 4.3 package

保存当前项目的全部专属内容：

- 品牌和项目信息。
- 数据模型、输入类型和 DTO 类型。
- 菜单、路由和启用的业务模块。
- Block 注册表、默认数据和资源定义。
- DTO、领域模型和通用内核之间的 Adapter。
- 集中位于 `package/ui` 的全部视觉实现。

`package/ui` 包含：

- 登录页、后台布局和基础 UI。
- 实体列表、编辑页面和字段控件。
- 前端 Blocks 展示组件。
- 后台 Block 编辑组件。
- 空状态、错误提示和反馈组件。

除 `package/ui` 外，package 的其他目录不得定义 React 视觉组件。

## 5. 依赖方向

```text
main ───────→ core
  └─────────→ package

package ────→ core/contracts
  └─────────→ shared

core ───────→ core/contracts
  └─────────→ shared

shared ─────→ 第三方公共依赖
```

硬性规则：

- `core` 不得导入 `package`。
- `shared` 不得导入 `core` 或 `package`。
- `package` 只能导入 `core` 的公开入口和 `shared`。
- `main.tsx` 是唯一同时导入 core 与 package 的装配点。
- core 中禁止出现项目名称、具体实体名称和具体 BlockType。
- package 不得要求增加 `package.json` 依赖。

应用入口保持稳定：

```ts
createAdminApp(projectPackage).mount();
```

## 6. ProjectPackage 契约

项目包通过统一入口定义：

```ts
export const projectPackage = defineProjectPackage({
  identity,
  shell,
  routes,
  entities,
  pageBuilder,
});
```

公共契约：

```ts
interface ProjectPackage {
  identity: ProjectIdentity;
  routes: AdminRouteDefinition[];
  entities: EntityDefinition[];
  pageBuilder?: PageBuilderDefinition;
  ui: ProjectUiDefinition;
}
```

`defineProjectPackage` 仅用于类型收窄和开发期验证，不维护运行时插件中心。

UI 通过单独入口导出：

```ts
export const projectUi = defineProjectUi({
  shell,
  screens,
  blockViews,
  blockEditors,
});
```

```ts
interface ProjectUiDefinition {
  shell: AdminShellDefinition;
  screens: Record<string, ComponentType<AdminScreenProps>>;
  blockViews: Record<string, ComponentType<BlockPreviewProps>>;
  blockEditors: Record<string, ComponentType<BlockEditorProps>>;
}
```

`package/index.ts` 只组合业务定义与 `projectUi`。同一项目的其他目录只能依赖 `ProjectUiDefinition` 中的稳定标识，不得直接导入具体 UI 文件。

项目包验证至少包含：

- route id、path 和 entity key 不重复。
- 菜单引用的路由存在。
- route 和 entity 引用的 screen id 在 `ui.screens` 中存在。
- Block type 不重复。
- 每个 Block 在 `ui.blockViews` 和 `ui.blockEditors` 中都有对应实现。
- package 未导入被禁止的内部路径。
- `package/ui` 之外不存在 React 视觉组件。

## 7. 身份、后台外壳和基础 UI

```text
package/
├─ identity/
│  └─ config.ts
└─ ui/
   ├─ index.ts
   ├─ primitives/
   ├─ forms/
   ├─ media/
   ├─ feedback/
   ├─ shell/
   │  ├─ LoginPage.tsx
   │  ├─ AdminLayout.tsx
   │  ├─ Sidebar.tsx
   │  ├─ Header.tsx
   │  └─ ErrorPage.tsx
   ├─ screens/
   ├─ editors/
   └─ blocks/
```

package 决定：

- 项目名称、Logo 和品牌信息。
- 支持的语言。
- 登录页和后台整体视觉。
- Sidebar、Header 和菜单分组。
- 基础按钮、输入、弹窗和反馈组件。

core 只持有 Shell 契约和生命周期，不直接引用具体 UI。

`package/ui/index.ts` 是视觉层唯一公共出口。package 其他目录不得导入 `ui/primitives`、`ui/screens` 等内部路径，只能在 `package/index.ts` 装配时使用完整 `projectUi`。

UI 替换必须保持业务契约不变：

- screen id 不变。
- Block type 不变。
- Editor 和 Preview props 契约不变。
- 不改变实体、DTO、路由 path 或 API 配置。

## 8. 菜单与路由

不同项目可以增减后台模块，菜单和路由必须由 package 声明。

```ts
interface AdminRouteDefinition {
  id: string;
  path: string;
  title: Translation;
  icon?: IconName;
  menu?: {
    group: string;
    order: number;
  };
  screenId: string;
}
```

core 负责：

- 根据定义创建 React Router 路由。
- 嵌套路由、404、鉴权和错误边界。
- 页面标题和生命周期。
- 向 screen 注入通用服务。

package 负责：

- 启用哪些页面和业务模块。
- 菜单文案、图标、排序和 screen id。
- `package/ui` 提供页面组件、登录页、布局和菜单的最终呈现。

项目可以删除 Blog、增加 CaseStudy，而不修改 core。

路由只保存 `screenId`，具体 React 页面统一注册在 `package/ui/screens`。这样仅替换 UI 时无需改动路由定义。

## 9. 通用实体业务

`core/entities` 提供：

- 列表查询、详情查询和分页。
- 搜索、排序和筛选状态。
- 新增、编辑和删除 Mutation。
- Query Key、缓存失效和乐观更新。
- 表单草稿、保存状态、错误和重试。
- 列表页与编辑页的通用 Controller。

项目实体定义示例：

```ts
interface EntityDefinition<Model, Dto, Input, Filters> {
  key: string;
  endpoint: string;
  adapter: EntityAdapter<Model, Dto, Input>;
  capabilities: EntityCapabilities;
  screens: {
    list?: string;
    editor?: string;
  };
}
```

Adapter 负责：

```ts
interface EntityAdapter<Model, Dto, Input> {
  fromDto(dto: Dto): Model;
  toInput(model: Model): Input;
  toRequest(input: Input): unknown;
}
```

数据流：

```text
package route
  → core EntityController
  → core API/cache/mutation executor
  → package adapter
  → package screen(ViewModel + Actions)
  → core 保存并刷新缓存
```

package UI 不直接调用 API。core 不读取 Product 或 Blog 的具体字段。

实体定义中的 screen 值是 `package/ui/screens` 的注册 id，不是 React 组件。列表页、编辑页和详情页全部集中在 UI 目录。

特殊业务操作通过受控扩展提供：

- package 声明 action 的输入和输出。
- core 提供请求、状态、缓存和错误执行器。
- package screen 只调用注入的 action。

## 10. Page Builder 通用内核

`core/page-builder` 负责：

- 页面加载和保存。
- 临时草稿和脏状态。
- 添加、删除、复制和排序 Block。
- Block 显示与隐藏。
- 撤销和重做。
- 当前选中 Block。
- 离开提醒和保存错误。
- 将项目资源注入编辑器。
- 接收编辑器的实时变更。

core 只认识最小结构：

```ts
interface CoreBlock<Type extends string = string, Content = unknown> {
  id: string;
  type: Type;
  content: Content;
  isVisible: boolean;
}
```

具体 Block 联合类型由 package 定义，core 不维护具体 BlockType。

## 11. Blocks 类型与 UI 目录

Block 数据类型、默认值和业务元数据保留在非视觉目录；前端展示 UI 集中到 `package/ui/blocks`，以便从前端项目整目录复制。

```text
package/blocks/
├─ types/
│  ├─ carousel.ts
│  ├─ product-grid.ts
│  └─ index.ts
└─ registry.ts

package/ui/blocks/
├─ Carousel.tsx
├─ ProductGrid.tsx
├─ ImageText.tsx
├─ registry.ts
├─ renderer.tsx
└─ index.ts
```

规则：

- `package/blocks` 不包含 React 组件。
- `package/ui/blocks` 只负责前端展示。
- UI 通过 props 接收 content 和 resources。
- UI 不调用后台 API、QueryClient 或编辑状态。
- UI 不导入后台 Editor。
- 所有 Block 数据类型位于 `package/blocks/types`。
- `package/blocks/registry.ts` 只绑定 type、元数据和默认数据。
- `package/ui/blocks/registry.ts` 只绑定 type 与 Preview。
- `package/ui/blocks/renderer.tsx` 根据 type 渲染 Preview。

```ts
interface BlockViewProps<Content, Resources> {
  content: Content;
  resources: Resources;
}
```

## 12. Editors 与 Page Builder 装配

后台编辑组件与前端 Blocks UI 分开，但都集中在 `package/ui`：

```text
package/ui/editors/
├─ CarouselEditor.tsx
├─ ProductGridEditor.tsx
├─ ImageTextEditor.tsx
└─ registry.ts

package/page-builder/
├─ definition.ts
├─ resources.ts
└─ adapters.ts
```

每个 Block 定义包含：

```ts
interface BlockDefinition<Block, Resources> {
  type: Block['type'];
  title: Translation;
  category: string;
  icon: IconName;
  singleton?: boolean;
  create(): Block;
  previewId: string;
  editorId: string;
}
```

`package/page-builder/definition.ts` 将：

- Block 类型和默认数据。
- Preview 与 Editor 的稳定注册 id。
- 项目资源。
- 页面 DTO Adapter。

组合为 core 可消费的 `PageBuilderDefinition`。

具体 Preview 与 Editor 由 `projectUi.blockViews` 和 `projectUi.blockEditors` 提供。替换 UI 目录时必须实现同一组 id，但可以完全改变组件结构和视觉。

数据流：

```text
core 加载页面并创建编辑会话
  → package 加载 Resources
  → core 按 BlockDefinition 的 editorId 从 projectUi 选择 Editor
  → Editor 通过 onChange 返回新 Block
  → core 更新草稿、历史记录和保存状态
  → core 按 previewId 从 projectUi 选择 Preview 实时渲染
```

## 13. 数据类型归属

以下类型属于 package：

- Product、Category、Blog、Inquiry、Review 等实体。
- 实体 Input、DTO 和 Filters。
- Page 和项目页面内容。
- BlockType、Block Content 和资源类型。
- Navigation、Footer 和 CompanyInfo 等项目配置。

以下类型属于 core：

- 通用加载、错误和分页状态。
- Entity Controller 的泛型契约。
- Route、Shell 和 Package 定义契约。
- `CoreBlock` 和 Page Builder 通用命令。
- ViewModel/Actions 的基础泛型。

以下类型属于 shared：

- `Translation` 等真正跨项目稳定的值对象。
- API 通用响应和错误。
- 上传与媒体技术类型。

## 14. API 与 Adapter

不同项目可以使用不同 API 路径和 DTO，但请求生命周期保持共用。

职责分配：

- `shared/api`：HTTP、认证、响应解析和网络错误。
- `core`：Query、Mutation、缓存、重试和回滚。
- `package/adapters`：DTO 校验、字段映射和请求体转换。
- `package/ui`：加载、空状态和错误的视觉呈现。

package Adapter 抛出的映射错误必须包含实体 key 和失败阶段，避免静默生成错误模型。

## 15. 迁移范围

### 第一阶段：建立契约与稳定装配点

- 建立 `core/contracts`。
- 建立 `defineProjectPackage`。
- 将应用入口改为稳定的 `createAdminApp(projectPackage)`。
- 增加 package 完整性和依赖边界测试。

### 第二阶段：建立 Kellogg package

- 将品牌、菜单、路由和业务定义迁入 package。
- 将项目实体类型和 DTO Adapter 迁入 package。
- 将 Shell、基础组件和所有业务页面集中迁入 `package/ui`。
- 建立 `package/ui/index.ts` 和 `ProjectUiDefinition`。

### 第三阶段：迁移 Blocks 与 Editors

- 将前端 Blocks UI 整体迁入 `package/ui/blocks`。
- 将 Block 类型、默认值和业务元数据迁入 `package/blocks`。
- 将后台属性编辑器迁入 `package/ui/editors`。
- 以稳定 id 连接 Block 定义、Preview 和 Editor。
- 建立 package Page Builder definition 和资源 Adapter。

### 第四阶段：提取通用内核

- 从现有 features 提取 Query、Mutation 和 CRUD 编排。
- 提取 Page Builder 会话、命令、历史记录和保存流程。
- 提取路由、Shell 和实体 Controller。
- 删除 core 中所有项目类型依赖。

### 第五阶段：删除旧路径并执行替换验证

- 删除已迁移的 `features`、`ui/themes/default`、`components/blocks`、`types` 等旧项目专属路径。
- 删除兼容导出。
- 增加 ESLint 与架构测试。
- 使用最小测试 package 完成替换测试。

## 16. 测试策略

### core

- 使用伪 ProjectPackage 测试，不导入 Kellogg package。
- Entity Controller 覆盖查询、分页、Mutation 和缓存失效。
- Page Builder 覆盖命令、历史、草稿和保存。
- 路由装配覆盖模块增减、404 和错误边界。

### package

- Adapter 覆盖 DTO、Model 和 Request 双向转换。
- 每个实体 screen 使用注入的 ViewModel/Actions 测试。
- Block Registry 覆盖 type 唯一性和默认数据。
- Preview 与 Editor 覆盖值渲染和 onChange。
- `ProjectUiDefinition` 覆盖全部 screen、preview 和 editor id。

### 架构

- core 不得包含或导入项目实体。
- shared 不得导入 core/package。
- package 不得导入 core 内部路径。
- `package/ui` 之外不得存在 React 视觉组件。
- `package/ui/blocks` 不得导入 Editor、API 或 QueryClient。
- routes、entities 和 page-builder 不得直接导入 `package/ui` 内部文件。
- main 是唯一双向装配点。

### 替换测试

提供测试用最小 package，至少包含：

- 不同品牌的 Login 和 AdminLayout。
- 一个与 Kellogg 不同的自定义实体。
- 两个不同类型的 Blocks。
- 对应的两个 Editors。
- 不同菜单和路由。

验证切换 package 后：

- 不修改其他源码。
- 不修改 `package.json`。
- TypeScript 类型检查通过。
- 测试和生产构建通过。
- 应用可启动并显示测试 package 的菜单、实体和 Blocks。

另提供 UI-only 测试包，仅替换 `package/ui`，保持 identity、types、routes、entities、blocks、page-builder 和 adapters 不变。

验证 UI-only 替换后：

- 路由 path、API 和实体行为不变。
- 登录页、后台 Shell、业务 screens、Editors 和 Blocks 外观全部来自新 UI。
- TypeScript 能发现缺失或错误的 screen、preview、editor id。
- 不修改 package 其他目录或 `package.json`。

## 17. 验收标准

- `src/package/index.ts` 是唯一项目包出口。
- 替换 `src/package` 即可切换项目。
- 替换 `src/package/ui` 即可切换同一项目的完整视觉实现。
- 菜单、路由、实体和后台外观均由 package 决定。
- API 差异由 package Adapter 处理。
- Product、Blog、Kellogg 和具体 BlockType 不存在于 core。
- 所有 React 视觉组件均位于 `package/ui`。
- 前端 Blocks UI 全部位于 `package/ui/blocks`。
- Editors 位于 `package/ui/editors`，与 Blocks UI 分开存放。
- routes、entities 和 page-builder 只通过稳定 id 引用 UI。
- package 不直接实现通用请求和缓存流程。
- core 不导入 package。
- package 不需要额外依赖。
- 最小替换测试通过。
- UI-only 替换测试通过。

## 18. 非目标

- 运行时切换多个 package。
- 动态下载安装插件。
- 将 package 发布为 npm 包。
- 允许 package 修改 `package.json`。
- 同时重构 worker-api。
- 强制不同项目使用相同实体或 Block 数量。
- 为尚未出现的扩展场景建立插件市场或注册中心。

## 19. 文档地位

本文档取代 `2026-06-19-ui-context-cleanup-design.md` 及其实施计划。

后续实施计划必须以“只替换 `src/package`”作为首要验收条件，不能再以“移动 UI 路径”作为最终目标。
