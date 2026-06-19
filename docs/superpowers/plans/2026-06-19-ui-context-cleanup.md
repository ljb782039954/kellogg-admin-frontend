# UI、ContentContext 与旧路径清理实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立独立 `src/ui` 默认视觉层，解除 UI 对 ContentContext 和旧路径的依赖，并删除 `admin/components`、`admin/pageBuilder`、`ContentContext` 与 `lib/api`。

**Architecture:** Feature 保留 API、Query、Controller、ViewModel 与公共契约；`src/ui` 提供默认视觉实现；`src/app/adapters` 负责组合跨 feature 查询与默认 UI。服务端实体继续由 TanStack Query 管理，不创建新的全局实体 Context。

**Tech Stack:** React 19、TypeScript 5.9、Vite 7、TanStack Query 5、React Hook Form 7、Vitest 4、Testing Library、ESLint 9、shadcn/ui、Tailwind CSS 3。

## Global Constraints

- 保持所有当前路由、视觉和主要交互不变。
- `features/api` 与 `features/model` 不得依赖 `src/ui`。
- `features` 不得依赖 `ui/themes/default`。
- `ui` 不得导入 feature 内部目录、API client 或 QueryClient。
- `shared` 不得依赖 features 或 ui。
- 跨业务数据只能由 Container 或 `app/adapters` 注入 UI。
- 不创建新的全局业务 Context。
- 不修改 worker-api 或前台 `components/blocks`。
- 不建设运行时主题注册中心。
- 新代码不得继续使用 `@/admin/components`、`@/admin/pageBuilder`、`@/context/ContentContext` 或 `@/lib/api`。
- 当前工作区已存在第一批旧组件删除，不得恢复或覆盖这些用户改动。

---

## 目标结构

```text
src/
├─ app/
│  ├─ adapters/
│  │  └─ page-builder/
│  └─ providers/
├─ features/
│  └─ <domain>/
│     ├─ api/
│     ├─ model/
│     └─ ui/
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
│  ├─ forms/
│  └─ media/
└─ admin/
   ├─ Dashboard.tsx
   ├─ Overview.tsx
   └─ BlocksPreview.tsx
```

最终删除：

```text
src/components/ui/**
src/admin/components/**
src/admin/pageBuilder/**
src/context/ContentContext.tsx
src/lib/api.ts
src/lib/api.test.ts
```

保留：

```text
src/context/LanguageContext.tsx
src/admin/Dashboard.tsx
src/admin/Overview.tsx
src/admin/BlocksPreview.tsx
src/components/blocks/**
src/components/custom/**
```

---

## Task 1：建立 `src/ui` 根目录与 Primitives 入口

**Files:**

- Create: `src/ui/primitives/index.ts`
- Move: `src/components/ui/**` → `src/ui/primitives/**`
- Modify: all imports from `@/components/ui/*`

**Produces:**

```ts
@/ui/primitives/button
@/ui/primitives/input
@/ui/primitives/dialog
```

- [ ] **Step 1：记录迁移前引用基线**

```powershell
rg -l "@/components/ui/" src --glob "*.ts" --glob "*.tsx"
```

保存文件列表用于迁移后对比。

- [ ] **Step 2：使用 `git mv` 迁移 primitives**

逐文件移动现有 shadcn 组件到 `src/ui/primitives`，保持文件名、导出和实现不变。

- [ ] **Step 3：机械更新 imports**

```text
@/components/ui/<name>
→
@/ui/primitives/<name>
```

禁止在此任务修改组件行为或视觉。

- [ ] **Step 4：建立公共 index**

`index.ts` 仅转发常用 primitives；业务代码仍可按单文件路径导入，避免 index 造成大 bundle。

- [ ] **Step 5：验证**

```powershell
rg -n "@/components/ui/" src
npm.cmd test
npx.cmd vite build
```

Expected:

- 旧路径无结果。
- 全量测试通过。
- Vite build 通过。

- [ ] **Step 6：提交**

```powershell
git add src/components/ui src/ui/primitives src
git commit -m "refactor(ui): move primitives to ui root"
```

---

## Task 2：统一双语表单控件

**Files:**

- Create: `src/ui/forms/BilingualInput.tsx`
- Create: `src/ui/forms/BilingualTextarea.tsx`
- Create: `src/ui/forms/index.ts`
- Modify: `src/shared/forms/controls/BilingualTextControl.tsx`
- Modify: `src/shared/forms/controls/BilingualTextareaControl.tsx`
- Modify: all current BilingualInput imports

**Interfaces:**

```ts
interface BilingualInputProps {
  label: string;
  value: Translation;
  onChange(value: Translation): void;
  placeholder?: Translation;
  disabled?: boolean;
  errors?: Partial<Record<'zh' | 'en', string>>;
}
```

- [ ] **Step 1：扩展 shared controls 测试**

覆盖：

- zh/en 值渲染。
- onChange 更新对应语言。
- disabled。
- 字段错误。
- placeholder。

- [ ] **Step 2：实现默认视觉包装**

`ui/forms` 包装 `shared/forms/controls`，维持当前后台视觉和旧 props 语义。

`BilingualTextarea` 替代拼写错误的 `BilingualInputAera`。

- [ ] **Step 3：迁移所有调用方**

```text
@/admin/components/BilingualInput
→
@/ui/forms/BilingualInput

@/admin/components/BilingualInputAera
→
@/ui/forms/BilingualTextarea
```

- [ ] **Step 4：验证**

```powershell
rg -n "BilingualInputAera|@/admin/components/BilingualInput" src
npm.cmd test -- src/shared/forms src/ui/forms
npx.cmd vite build
```

- [ ] **Step 5：提交**

```powershell
git add src/shared/forms src/ui/forms src
git commit -m "refactor(ui): centralize bilingual form controls"
```

---

## Task 3：迁移富文本 UI

**Files:**

- Move: `src/admin/components/RichInput/**`
- Move: `src/admin/components/BilingualRichInput.tsx`
- Destination: `src/ui/forms/rich-text/**`
- Modify: Page Builder editor imports

**Interfaces:**

```ts
export { BilingualRichInput, RichInput } from '@/ui/forms/rich-text';
```

- [ ] **Step 1：为富文本包装补交互测试**

覆盖：

- 双语值切换。
- modal 打开与关闭。
- 保存返回 Translation。
- disabled 状态。

- [ ] **Step 2：使用 `git mv` 迁移**

保持当前实现与视觉，不在本任务重写编辑器。

- [ ] **Step 3：更新 imports**

所有属性编辑器改用 `@/ui/forms/rich-text`。

- [ ] **Step 4：验证并提交**

```powershell
rg -n "@/admin/components/BilingualRichInput|admin/components/RichInput" src
npm.cmd test -- src/ui/forms
npx.cmd vite build
git add src/admin/components src/ui/forms src
git commit -m "refactor(ui): move rich text controls"
```

---

## Task 4：迁移媒体 UI

**Files:**

- Move: `src/admin/components/AdminImage.tsx`
- Move: `src/admin/components/ImageInput.tsx`
- Move: `src/admin/components/ImageInput.test.tsx`
- Destination: `src/ui/media/`
- Modify: `src/shared/media/ui/*.tsx`
- Modify: all feature imports

**Interfaces:**

```ts
export { default as AdminImage } from './AdminImage';
export { default as ImageInput } from './ImageInput';
```

- [ ] **Step 1：保持 ImageInput 兼容测试**

测试必须继续覆盖：

- 文件选择调用上传 Controller。
- 清空图片。
- acceptType 和 maxWidth。
- 重复文件选择。

- [ ] **Step 2：使用 `git mv` 迁移**

`ImageInput` 继续作为 `shared/media` Controller 的默认 UI Adapter。

- [ ] **Step 3：更新 imports**

```text
@/admin/components/AdminImage
→
@/ui/media/AdminImage

@/admin/components/ImageInput
→
@/ui/media/ImageInput
```

- [ ] **Step 4：检查依赖方向**

```powershell
rg -n "@/features/|QueryClient|apiClient" src/ui/media
```

Expected: no matches。

- [ ] **Step 5：验证并提交**

```powershell
npm.cmd test -- src/ui/media src/shared/media
npx.cmd vite build
git add src/admin/components src/ui/media src/shared/media src/features
git commit -m "refactor(ui): move media controls"
```

---

## Task 5：建立 Pages 公共选项 Hook

**Files:**

- Create: `src/features/pages/model/usePageOptions.ts`
- Create: `src/features/pages/model/usePageOptions.test.tsx`
- Modify: `src/features/pages/index.ts`

**Interfaces:**

```ts
export interface PageOption {
  pageId: string;
  path: string;
  title: Translation;
  isFixed: boolean;
}

export function usePageOptions(): {
  pages: PageOption[];
  isLoading: boolean;
  error: Error | null;
}
```

- [ ] **Step 1：写失败测试**

覆盖：

- 从页面索引派生轻量 PageOption。
- 不暴露 blocks、seo 或 content。
- loading/error 转发。
- Query refetch 后选项更新。

- [ ] **Step 2：实现并公开**

复用 pages list Query，不创建重复 API。

`features/pages/index.ts` 导出 Hook 和 `PageOption` 类型。

- [ ] **Step 3：验证并提交**

```powershell
npm.cmd test -- src/features/pages/model/usePageOptions.test.tsx
git add src/features/pages
git commit -m "feat(pages): expose page options query"
```

---

## Task 6：将 LinkSelector 改为纯受控 UI

**Files:**

- Move: `src/admin/components/LinkSelector.tsx`
- Destination: `src/ui/navigation/LinkSelector.tsx`
- Create: `src/ui/navigation/LinkSelector.test.tsx`
- Create: `src/ui/navigation/index.ts`
- Modify: navigation、footer 与 Page Builder 调用方

**Interface:**

```ts
interface LinkSelectorProps {
  value: NavLink;
  pages: PageOption[];
  disabled?: boolean;
  onChange(value: NavLink): void;
}
```

- [ ] **Step 1：写纯 View 测试**

覆盖：

- 内部/外部类型切换。
- 选择页面后写入 path。
- 页面不存在时显示失效提示。
- 自动设置 `pageDeleted`。
- 不需要 ContentProvider 或 QueryProvider。

- [ ] **Step 2：删除 Context 读取**

删除：

```ts
useContent()
content.pages
```

页面选项只来自 props。

- [ ] **Step 3：为 navigation 与 footer 注入 pages**

Container 使用 `usePageOptions()`，将 pages 传给 View，再传入 LinkSelector。

不得让 `ui/navigation/LinkSelector` 调用 Hook。

- [ ] **Step 4：为 Page Builder Adapter 预留 pages**

属性编辑器资源契约加入 `pages: PageOption[]`。

- [ ] **Step 5：验证并提交**

```powershell
rg -n "useContent|ContentContext|QueryClient|apiClient" src/ui/navigation
npm.cmd test -- src/ui/navigation src/features/navigation src/features/footer
npx.cmd vite build
git add src/admin/components src/ui/navigation src/features/navigation src/features/footer
git commit -m "refactor(ui): make link selector controlled"
```

---

## Task 7：建立 Categories 与 Products 只读数据端口

**Files:**

- Create: `src/features/categories/model/useCategoriesQuery.ts`
- Create: `src/features/categories/model/useCategoriesQuery.test.tsx`
- Modify: `src/features/categories/index.ts`
- Create: `src/features/products/model/useProductsSummary.ts`
- Create: `src/features/products/model/useProductsSummary.test.tsx`
- Create: `src/features/products/model/useProductPreviewData.ts`
- Create: `src/features/products/model/useProductPreviewData.test.tsx`
- Modify: `src/features/products/index.ts`

**Interfaces:**

```ts
useCategoriesQuery(): {
  categories: Category[];
  isLoading: boolean;
  error: Error | null;
}

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

- [ ] **Step 1：写 Categories Query 测试**

确认它复用 `categoryKeys.list()`，不包含 Mutation 能力。

- [ ] **Step 2：写 Products Summary 测试**

使用最小 pageSize 获取 total；验证 refetch 只刷新 products Query。

- [ ] **Step 3：写 Product Preview 测试**

请求 Page Builder 所需的合理数量，返回 products，不复制到本地 state。

- [ ] **Step 4：实现并通过公共 index 导出**

其他 feature 只能从 `@/features/categories`、`@/features/products` 导入。

- [ ] **Step 5：验证并提交**

```powershell
npm.cmd test -- src/features/categories/model/useCategoriesQuery.test.tsx src/features/products/model/useProductsSummary.test.tsx src/features/products/model/useProductPreviewData.test.tsx
git add src/features/categories src/features/products
git commit -m "feat: expose shared read-only feature queries"
```

---

## Task 8：建立 Page Builder PropertyEditorResources

**Files:**

- Create: `src/features/page-builder/ui/property-panel/propertyEditor.resources.ts`
- Modify: `src/features/page-builder/ui/property-panel/propertyEditor.types.ts`
- Modify: `src/features/page-builder/ui/property-panel/BlockPropertyPanel.tsx`
- Modify: `src/features/page-builder/ui/PageBuilderView.tsx`

**Contract:**

```ts
export interface PropertyEditorResources {
  categories: Category[];
  products: Product[];
  pages: PageOption[];
  isLoading: boolean;
  error: string | null;
}

export interface BlockPropertyEditorProps<T = unknown> {
  value: T;
  resources: PropertyEditorResources;
  onChange(value: T): void;
  disabled?: boolean;
  errors?: Record<string, string>;
}
```

- [ ] **Step 1：更新契约测试**

伪造 resources 渲染属性面板，测试不得依赖 QueryProvider。

- [ ] **Step 2：向属性面板传递 resources**

Feature 只定义契约，不查询 categories/products/pages。

- [ ] **Step 3：更新 PageBuilderView Props**

View 接收 resources 或 property-panel renderer；不得导入默认主题 Adapter。

- [ ] **Step 4：验证并提交**

```powershell
npm.cmd test -- src/features/page-builder
git add src/features/page-builder
git commit -m "refactor(page-builder): define property editor resources"
```

---

## Task 9：迁移 Page Builder 默认主题属性编辑器

**Files:**

- Move: `src/admin/pageBuilder/propsEditors/**`
- Destination: `src/ui/themes/default/page-builder/property-editors/**`
- Move: `propertyEditorRegistry.tsx`
- Create: `src/ui/themes/default/page-builder/index.ts`
- Modify: all editor imports

- [ ] **Step 1：使用 `git mv` 移动全部编辑器**

保持每个 Block 类型的视觉和字段行为不变。

- [ ] **Step 2：统一编辑器契约**

将旧：

```ts
{ props, onUpdate }
```

改为：

```ts
{ value, resources, onChange, disabled, errors }
```

- [ ] **Step 3：移除 Context**

对应替换：

```text
CategoriesPropsEditor   → resources.categories
NewArrivalsPropsEditor  → resources.products
FeaturedProductsEditor  → resources.products
LinkSelector            → resources.pages
```

- [ ] **Step 4：提取预览纯函数**

```ts
selectNewArrivalProducts(products, maxItems)
selectFeaturedProducts(products, maxItems)
```

覆盖发布日期排序、精选回退和数量限制。

- [ ] **Step 5：迁移 Registry 与 ProductGrid 组合**

默认主题 Registry 位于 `ui/themes/default`；feature 不导入它。

- [ ] **Step 6：验证边界**

```powershell
rg -n "useContent|ContentContext|QueryClient|apiClient|@/admin/" src/ui/themes/default
npm.cmd test -- src/ui/themes/default src/features/page-builder
npx.cmd vite build
```

- [ ] **Step 7：提交**

```powershell
git add src/admin/pageBuilder src/ui/themes/default src/features/page-builder
git commit -m "refactor(ui): move page builder default theme"
```

---

## Task 10：建立默认 Page Builder Adapter

**Files:**

- Create: `src/app/adapters/page-builder/usePropertyEditorResources.ts`
- Create: `src/app/adapters/page-builder/DefaultPageBuilderRoute.tsx`
- Create: `src/app/adapters/page-builder/usePropertyEditorResources.test.tsx`
- Modify: `src/App.tsx`
- Modify: Page Builder Container/View injection point

- [ ] **Step 1：写资源组合测试**

覆盖：

- categories、products、pages 合并。
- 任一加载时 `isLoading=true`。
- 错误转为稳定字符串。
- 不复制实体数组。

- [ ] **Step 2：实现 Adapter**

Adapter 调用三个 feature 公共 Hook，并装配默认 Registry/Property Panel。

- [ ] **Step 3：切换路由**

```tsx
<Route
  path="pages/:pageId/edit"
  element={<DefaultPageBuilderRoute />}
/>
```

- [ ] **Step 4：检查依赖**

```powershell
rg -n "ui/themes/default" src/features
```

Expected: no matches。

- [ ] **Step 5：验证并提交**

```powershell
npm.cmd test -- src/app/adapters/page-builder src/features/page-builder
npx.cmd vite build
git add src/app src/App.tsx src/features/page-builder
git commit -m "refactor(app): inject default page builder theme"
```

---

## Task 11：Overview 改用 Products Summary

**Files:**

- Modify: `src/admin/Overview.tsx`
- Create: `src/admin/Overview.test.tsx`

- [ ] **Step 1：写失败测试**

Mock `@/features/products` 公共 Hook，覆盖：

- 商品总数显示。
- loading。
- error。
- 刷新只调用 products refetch。
- 关闭错误只影响本页面。

- [ ] **Step 2：移除 useContent**

```ts
const {
  total,
  isLoading,
  error,
  refetch,
} = useProductsSummary();
```

用本地 state 控制错误提示关闭。

- [ ] **Step 3：验证并提交**

```powershell
rg -n "useContent|ContentContext" src/admin/Overview.tsx
npm.cmd test -- src/admin/Overview.test.tsx
npx.cmd vite build
git add src/admin/Overview*
git commit -m "refactor(overview): use product summary query"
```

---

## Task 12：删除 ContentContext 与旧 API Facade

**Files:**

- Delete: `src/context/ContentContext.tsx`
- Delete: `src/lib/api.ts`
- Delete: `src/lib/api.test.ts`
- Modify: `src/App.tsx`

- [ ] **Step 1：确认零调用方**

```powershell
rg -n "useContent|ContentProvider|ContentContext|@/lib/api|\\.\\./lib/api" src
```

Expected: 仅待删除文件自身匹配。

- [ ] **Step 2：移除 Provider**

`App.tsx` 保留 `LanguageProvider`，删除 `ContentProvider` import 和 JSX 包裹。

- [ ] **Step 3：删除文件**

使用 `git rm` 删除 Context 和旧 API facade。

- [ ] **Step 4：验证**

```powershell
npm.cmd test
npx.cmd vite build
```

Expected: 全量测试和打包通过。

- [ ] **Step 5：提交**

```powershell
git add src/App.tsx src/context src/lib
git commit -m "refactor: remove global content context and legacy api"
```

---

## Task 13：删除旧 UI 路径与兼容层

**Files:**

- Delete: `src/admin/components/**`
- Delete: `src/admin/pageBuilder/**`
- Remove empty directories

- [ ] **Step 1：确认无 imports**

```powershell
rg -n "@/admin/components|@/admin/pageBuilder|admin/components|admin/pageBuilder" src
```

Expected: no matches。

- [ ] **Step 2：删除旧目录**

删除前确认绝对路径：

```text
H:\Kellogg\adminApp\src\admin\components
H:\Kellogg\adminApp\src\admin\pageBuilder
```

- [ ] **Step 3：检查 `src/admin`**

最终只应保留：

```text
Dashboard.tsx
Overview.tsx
Overview.test.tsx
BlocksPreview.tsx
```

- [ ] **Step 4：验证并提交**

```powershell
npm.cmd test
npx.cmd vite build
git add src/admin
git commit -m "refactor: remove legacy admin ui paths"
```

---

## Task 14：增加架构 ESLint 规则

**Files:**

- Modify: `eslint.config.js`
- Create: `src/test/architecture/import-boundaries.test.ts`

- [ ] **Step 1：写路径边界测试**

扫描源码并拒绝：

```text
@/admin/components
@/admin/pageBuilder
@/context/ContentContext
@/lib/api
```

同时验证：

- shared 不导入 features/ui。
- feature api/model 不导入 ui。
- feature 不导入 `ui/themes/default`。
- ui 不导入 feature 内部路径。

- [ ] **Step 2：扩展 ESLint**

增加按目录覆盖的 `no-restricted-imports`，错误消息明确给出正确入口。

- [ ] **Step 3：修复本次迁移产生的 lint**

只处理本计划涉及文件。仓库既有 lint 债务单独记录，不扩大任务。

- [ ] **Step 4：验证并提交**

```powershell
npm.cmd test -- src/test/architecture/import-boundaries.test.ts
npx.cmd eslint src/ui src/app src/features src/admin/Overview.tsx
git add eslint.config.js src/test/architecture
git commit -m "chore: enforce ui architecture boundaries"
```

---

## Task 15：同步最终架构文档

**Files:**

- Modify: `docs/README.md`

- [ ] **Step 1：确认文档基线**

历史重构与阶段性改进文档已在本计划建立时移除。当前权威文档为：

```text
docs/README.md
docs/superpowers/specs/2026-06-19-ui-context-cleanup-design.md
docs/superpowers/plans/2026-06-19-ui-context-cleanup.md
```

- [ ] **Step 2：更新 README 的最终目录结构**

删除“待迁移”说明，并按实际完成后的目录记录：

```text
ui/        默认视觉实现
features/  业务能力
shared/    技术能力
app/       装配
admin/     后台外壳页面
```

- [ ] **Step 3：记录最终架构边界**

README 必须明确：

- UI 不直接请求业务 API。
- feature 业务层不依赖默认主题。
- shared 不依赖 feature 或 UI。
- 跨业务资源由 `app/adapters` 注入。
- `LanguageContext` 是唯一保留的应用 Context。

- [ ] **Step 4：检查文档链接与旧路径**

```powershell
rg -n "docs/refactoring|refactoring/feature-reviews" docs/README.md
rg -n "admin/components|admin/pageBuilder|ContentContext|lib/api" docs/README.md
```

Expected: no matches。

- [ ] **Step 5：提交**

```powershell
git add docs
git commit -m "docs: document final ui architecture"
```

---

## Task 16：最终验证

- [ ] **Step 1：运行全量测试**

```powershell
npm.cmd test
```

Expected: all tests pass。

- [ ] **Step 2：运行生产构建**

```powershell
npm.cmd run build
```

如果构建被本计划外的既有 TypeScript 错误阻断，必须：

1. 记录准确文件与错误。
2. 单独运行 `npx.cmd vite build` 验证模块解析与打包。
3. 不把既有错误描述为本次迁移成功。

- [ ] **Step 3：运行 ESLint**

```powershell
npx.cmd eslint src/ui src/app src/features src/admin/Overview.tsx
```

- [ ] **Step 4：检查零遗留**

```powershell
Test-Path src/admin/components
Test-Path src/admin/pageBuilder
Test-Path src/context/ContentContext.tsx
Test-Path src/lib/api.ts
rg -n "@/admin/components|@/admin/pageBuilder|ContentContext|@/lib/api" src
```

Expected:

- 四个 Test-Path 均为 False。
- 引用搜索无结果。

- [ ] **Step 5：检查依赖方向**

```powershell
rg -n "ui/themes/default" src/features
rg -n "@/features/.+/(api|model|ui)" src/ui
rg -n "@/features|@/ui" src/shared
```

Expected: no forbidden matches。

---

## Completion Criteria

- `src/ui` 是默认视觉实现唯一根路径。
- `src/components/ui`、`src/admin/components`、`src/admin/pageBuilder` 删除。
- `LinkSelector` 只接收 pages props。
- Page Builder 属性编辑器只接收 resources。
- 默认主题通过 app Adapter 注入。
- Overview 只刷新 products summary。
- ContentContext、ContentProvider、lib/api 删除。
- Feature 业务层不依赖默认主题。
- Shared 不依赖 feature 或 UI。
- 旧重构/改进文档删除，仅保留当前权威 spec 和 plan。
- 全量测试、Vite build 和迁移范围 ESLint 通过。

## Commit Sequence

```text
refactor(ui): move primitives to ui root
refactor(ui): centralize bilingual form controls
refactor(ui): move rich text controls
refactor(ui): move media controls
feat(pages): expose page options query
refactor(ui): make link selector controlled
feat: expose shared read-only feature queries
refactor(page-builder): define property editor resources
refactor(ui): move page builder default theme
refactor(app): inject default page builder theme
refactor(overview): use product summary query
refactor: remove global content context and legacy api
refactor: remove legacy admin ui paths
chore: enforce ui architecture boundaries
docs: document final ui architecture
```
