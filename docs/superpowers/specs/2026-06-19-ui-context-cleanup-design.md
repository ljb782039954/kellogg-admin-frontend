# UI、ContentContext 与旧路径清理设计

## 1. 背景

`adminApp` 的主要业务模块已经迁入 `features/`，但仍存在三类架构遗留：

1. 可复用 UI 仍位于 `src/admin/components`。
2. Page Builder 属性编辑器仍位于 `src/admin/pageBuilder/propsEditors`。
3. `ContentContext` 仍为少量旧 UI 提供跨业务数据，导致 `lib/api` 无法删除。

当前剩余依赖主要包括：

- 多个 feature 直接导入 `admin/components`。
- `LinkSelector` 通过 `ContentContext` 读取页面列表。
- Page Builder 的分类与商品属性编辑器通过 `ContentContext` 读取数据。
- `Overview` 通过 `ContentContext` 获取商品总数和刷新状态。
- `ContentContext` 是 `lib/api.ts` 唯一运行时消费者。

这些遗留不会立即影响功能，但会阻碍：

- 将业务逻辑跨项目复用。
- 为不同项目替换整套后台 UI。
- 明确 feature、shared 和视觉层的依赖方向。
- 删除全局实体 Context 和旧 API 聚合层。

## 2. 目标

本次清理建立独立 `src/ui` 视觉层，并完成旧架构退场。

完成后应具备以下能力：

- `features` 可以复用，不依赖当前默认 UI 主题。
- `src/ui` 可以被替换或提取为 workspace package。
- UI 控件只接收值、资源和事件，不自行读取业务 Context。
- 跨业务数据由 Container 或 Adapter 显式注入。
- 服务端实体只由 TanStack Query 管理。
- `ContentContext`、`ContentProvider` 和 `lib/api` 被删除。
- `src/admin` 只保留应用页面，不再承载共享控件或旧业务 UI。

## 3. 范围

### 3.1 纳入范围

- `src/admin/components/**`
- `src/admin/pageBuilder/propsEditors/**`
- `src/context/ContentContext.tsx`
- `src/lib/api.ts` 与对应测试
- `Overview` 的数据来源
- `LinkSelector` 的页面数据来源
- Page Builder 属性编辑器的商品和分类数据来源
- 现有 feature 对旧 UI 路径的 imports
- UI 目录、公共导出和 ESLint 依赖规则
- 导航文档与架构说明

### 3.2 明确排除

- 重做后台视觉设计。
- 修改 Worker API。
- 改造前台 `components/blocks`。
- 将 `src/ui` 立即发布为 npm package。
- 建设运行时主题切换系统。
- 让所有 feature UI 在本次全部变为可插拔插件。
- 重构与清理无关的业务流程。

## 4. 目标目录

```text
src/
├─ app/
│  ├─ providers/
│  ├─ routes/
│  └─ adapters/
├─ features/
│  └─ <domain>/
│     ├─ api/
│     ├─ model/
│     └─ containers/
├─ ui/
│  ├─ primitives/
│  ├─ forms/
│  ├─ media/
│  ├─ navigation/
│  └─ themes/
│     └─ default/
│        └─ page-builder/
├─ shared/
│  ├─ api/
│  └─ media/
└─ admin/
   ├─ Dashboard.tsx
   ├─ Overview.tsx
   └─ BlocksPreview.tsx
```

目录职责：

- `features`：API、Mapper、Schema、Query、Controller、ViewModel、Actions。
- `ui`：视觉组件和默认主题实现。
- `shared`：无业务实体语义的技术能力。
- `app`：路由、Provider、跨 feature 与 UI 的装配。
- `admin`：当前后台应用的页面壳；后续可再迁入 `app/pages`，但不属于本次必要范围。

## 5. 依赖方向

```text
app
├─ features
└─ ui

ui
├─ primitives
├─ shared 技术能力
└─ feature 公共类型/契约

features
├─ shared
└─ 不依赖 ui/themes/default

shared
└─ 不依赖 features 或 ui
```

硬性规则：

- feature 的 api/model 不得导入 `src/ui`。
- feature Container 可以由 app 装配 UI，但不得依赖具体默认主题实现。
- `ui` 不得导入 feature 内部路径。
- `ui` 不得直接调用 API client 或 QueryClient。
- `shared` 不得导入 feature 或 UI。
- 默认主题不得成为业务类型的权威来源。

## 6. UI 层结构

### 6.1 Primitives

现有 `src/components/ui` 是 shadcn 基础组件库。

本次可采用两种兼容方式：

- 物理迁移到 `src/ui/primitives`。
- 先通过 `src/ui/primitives/index.ts` 统一转发，再分批物理迁移。

推荐先建立统一入口，避免一次性修改大量 shadcn imports。最终代码只从 `@/ui/primitives/...` 或公共 index 导入。

### 6.2 Forms

迁入：

```text
admin/components/BilingualInput.tsx
admin/components/BilingualInputAera.tsx
admin/components/BilingualRichInput.tsx
admin/components/RichInput/**
```

目标：

```text
ui/forms/
├─ BilingualTextControl.tsx
├─ BilingualTextareaControl.tsx
├─ rich-text/
└─ index.ts
```

当前 `shared/forms/controls` 已存在双语基础 Control。迁移时应选择一个权威实现：

- `shared/forms` 保留无主题行为与最小控件契约。
- `ui/forms` 提供默认视觉包装。

不得保留两套相同职责的双语输入实现。

旧拼写 `BilingualInputAera` 仅作为短期兼容导出，最终删除。

### 6.3 Media

迁入：

```text
admin/components/AdminImage.tsx
admin/components/ImageInput.tsx
```

目标：

```text
ui/media/
├─ AdminImage.tsx
├─ ImageInput.tsx
└─ index.ts
```

职责：

- `shared/media`：上传准备、哈希、查重、上传 Controller。
- `ui/media`：文件选择、预览、错误、重复图片弹窗的默认视觉。

`ui/media` 可以依赖 `shared/media`，反向依赖禁止。

### 6.4 Navigation

`LinkSelector` 迁入：

```text
ui/navigation/LinkSelector.tsx
```

它必须成为纯受控组件，不再读取 ContentContext。

## 7. LinkSelector 数据注入

当前问题：

```text
LinkSelector
  → useContent()
  → content.pages
```

目标契约：

```ts
interface PageOption {
  pageId: string;
  path: string;
  title: Translation;
  isFixed: boolean;
}

interface LinkSelectorProps {
  value: NavLink;
  pages: PageOption[];
  onChange(value: NavLink): void;
}
```

新增 pages 公共只读能力：

```ts
usePageOptions(): {
  pages: PageOption[];
  isLoading: boolean;
  error: Error | null;
}
```

使用方：

- navigation Container 查询 pages 后传给 Navigation View。
- footer Container 查询 pages 后传给 Footer View。
- Page Builder 默认 Adapter 查询 pages 后传给需要链接的属性编辑器。

删除页面后的失效判断仍可由 LinkSelector 纯函数完成，但输入数据必须来自 props。

## 8. Page Builder 默认主题

所有属性编辑器迁入：

```text
ui/themes/default/page-builder/property-editors/
```

Page Builder feature 保留：

- Block Catalog。
- 草稿、Reducer 和命令。
- Controller。
- 属性编辑器契约。
- ViewModel 和 Actions。

默认主题保留：

- 属性面板布局。
- 具体输入控件。
- Block 类型对应的属性编辑器。
- 商品、分类和页面数据的预览 UI。

目标适配层：

```text
app/adapters/page-builder/
├─ DefaultPageBuilderAdapter.tsx
└─ usePropertyEditorResources.ts
```

## 9. PropertyEditorResources

当前以下编辑器依赖 ContentContext：

- `CategoriesPropsEditor`
- `NewArrivalsPropsEditor`
- `FeaturedProductsPropsEditor`

目标契约：

```ts
interface PropertyEditorResources {
  categories: Category[];
  products: Product[];
  pages: PageOption[];
  isLoading: boolean;
  error: string | null;
}
```

资源由 Adapter 查询：

```text
useCategoriesQuery()
useProductsPreviewQuery()
usePageOptions()
  ↓
PropertyEditorResources
  ↓
默认主题属性编辑器
```

属性编辑器只根据 resources 计算预览，不调用 Query 或 Context。

`NewArrivals` 的发布日期排序和 `FeaturedProducts` 的精选筛选可以提取为纯函数，便于测试和复用。

## 10. Feature 只读数据端口

### 10.1 Pages

新增公开：

```ts
usePageOptions()
```

从页面索引 Query 派生轻量选项。

### 10.2 Categories

新增公开：

```ts
useCategoriesQuery(): {
  categories: Category[];
  isLoading: boolean;
  error: Error | null;
}
```

编辑器 Controller 可以继续复用该 Query，但 UI Adapter 不得导入内部 API。

### 10.3 Products

新增公开：

```ts
useProductsSummary(): {
  total: number;
  isLoading: boolean;
  error: Error | null;
  refetch(): Promise<unknown>;
}

useProductPreviewData(): {
  products: Product[];
  isLoading: boolean;
  error: Error | null;
}
```

Preview Query 只请求 Page Builder 所需字段/数量；如果后端暂不支持字段裁剪，则使用合理 pageSize，不再加载到 ContentContext。

## 11. Overview 清理

当前：

```text
Overview
  → useContent()
  → allProducts / refreshData / error
```

目标：

```text
Overview
  → useProductsSummary()
```

规则：

- 商品数量来自 products Query。
- 刷新按钮只 refetch 商品 summary。
- 错误仅表示 Overview 所需数据失败。
- 不再加载分类、博客、页面、导航、页脚或站点配置。
- 关闭错误提示属于组件 UI state，不进入全局 Context。

## 12. ContentContext 退场

完成以下调用方迁移后删除：

```text
Overview
LinkSelector
CategoriesPropsEditor
NewArrivalsPropsEditor
FeaturedProductsPropsEditor
```

删除范围：

```text
src/context/ContentContext.tsx
App.tsx 中的 ContentProvider
```

不得创建新的“轻量全局 ContentContext”替代它。服务端状态继续按 feature Query 管理。

`LanguageContext` 不在本次范围内，它只管理应用级语言偏好，不保存服务端实体。

## 13. lib/api 退场

当前运行时只有 ContentContext 使用 `lib/api`。

ContentContext 删除后：

- 删除 `src/lib/api.ts`。
- 删除 `src/lib/api.test.ts`。
- 所有请求继续通过 feature API 和 `shared/api/client`。
- 若发现剩余调用方，应迁入所属 feature，不保留聚合 API 兼容层。

## 14. 兼容策略

迁移期间允许短期兼容导出：

```ts
// admin/components/ImageInput.tsx
export { ImageInput as default } from '@/ui/media';
```

规则：

- 兼容文件不包含逻辑。
- 新代码只能使用 `@/ui/...`。
- 每批迁移完成后删除对应兼容导出。
- 最终 `src/admin/components` 整体删除。

Page Builder 旧路径也可短期转发，但最终必须删除 `src/admin/pageBuilder`。

## 15. 迁移批次

### 第一批：UI 根目录与公共入口

- 建立 `src/ui`。
- 建立 primitives、forms、media、navigation 和 default theme。
- 建立短期兼容导出。
- 更新新代码 imports。

完成标准：UI 有统一入口，行为不变。

### 第二批：受控 LinkSelector

- 建立 `usePageOptions`。
- LinkSelector 改为 props 注入 pages。
- navigation、footer 和 Page Builder Adapter 注入数据。
- 删除 LinkSelector 对 ContentContext 的依赖。

完成标准：LinkSelector 可脱离 Provider 单独测试。

### 第三批：Page Builder 默认主题

- 移动全部属性编辑器。
- 建立 PropertyEditorResources。
- 建立 products/categories/pages 只读 Hook。
- Adapter 注入 resources。
- 删除属性编辑器中的 Context 和旧 admin imports。

完成标准：`src/admin/pageBuilder` 删除。

### 第四批：Overview 与 Context 收尾

- Overview 改用 products summary。
- 确认 useContent 无调用方。
- 删除 ContentProvider 与 ContentContext。
- 删除 lib/api。

完成标准：应用不再存在跨领域服务端实体 Context。

### 第五批：兼容层与边界规则

- 删除 `src/admin/components`。
- 清理所有旧 imports。
- 增加 ESLint 依赖规则。
- 更新文档。

完成标准：旧 UI 路径全部消失。

## 16. 测试策略

### UI 控件

- 双语输入的值、事件、禁用和错误。
- ImageInput 与 shared/media Controller 的连接。
- LinkSelector 内外链切换、页面选择和失效提示。
- UI 测试不启动真实 API。

### Feature 只读 Hook

- page options 派生。
- categories Query 状态。
- products summary 与 preview Query。
- Query Key 和 refetch 范围。

### Page Builder Adapter

- resources 正确组合。
- loading/error 合并。
- 属性编辑器只消费 resources。
- 新品排序和精选筛选纯函数。

### Context 删除回归

- App 无 ContentProvider。
- Overview 能独立加载和刷新。
- navigation/footer/Page Builder 链接选择正常。
- Page Builder 商品和分类预览正常。
- 全量测试和生产构建通过。

## 17. 强制架构规则

```text
features/api|model     不得依赖 ui
features              不得依赖 ui/themes/default
ui                    不得导入 feature 内部路径
ui                    不得调用 apiClient 或 QueryClient
shared                不得依赖 features 或 ui
app/adapters          可以组合 feature 公共能力与 UI
```

建议增加 ESLint：

- 禁止 `@/admin/components`。
- 禁止 `@/admin/pageBuilder`。
- 禁止 `@/context/ContentContext`。
- 禁止 `@/lib/api`。
- feature 间只能通过 `index.ts` 公共入口依赖。

## 18. 验收指标

- `src/ui` 成为当前默认视觉实现的唯一根路径。
- `src/admin/components` 删除。
- `src/admin/pageBuilder` 删除。
- `ContentContext.tsx` 与 ContentProvider 删除。
- `lib/api.ts` 与对应测试删除。
- LinkSelector 不读取 Context 或 Query。
- 属性编辑器不读取 Context 或 Query。
- Overview 不执行全局刷新。
- feature 的业务测试不依赖默认主题 UI。
- UI 可以通过 props 和公共契约替换。
- 所有现有路由和视觉主流程保持不变。
- 全量测试和 Vite 构建通过。
- ESLint 不新增错误，并能阻止旧路径重新出现。

## 19. 后续方向

本次完成后，可以在出现第二个后台项目时再进行：

- 将 `src/ui` 提取为 `packages/admin-ui-default`。
- 将 feature 业务能力提取为 `packages/admin-core` 与 `packages/admin-react`。
- 为不同品牌实现新的 theme package。
- 在 app 层选择不同 UI Adapter。

在第二个真实消费者出现前，不建设额外插件系统或运行时主题注册中心。
