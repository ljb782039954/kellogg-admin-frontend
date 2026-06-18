# Page Builder 独立模块重构实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 Page Builder 迁入独立 `features/page-builder`，实现积木编辑业务逻辑与当前 UI 解耦。

**Architecture:** `features/pages` 只负责页面查询和持久化；`features/page-builder` 负责草稿、Block Catalog、纯命令、Reducer、Controller 与 View。UI 仅消费 `PageBuilderViewModel` 和 `PageBuilderActions`。

**Tech Stack:** React 19、TypeScript 5.9、Vite 7、React Router 7、TanStack Query 5、Vitest 4、Testing Library、`@dnd-kit`、shadcn/ui、Tailwind CSS 3。

## Global Constraints

- 保持 `/pages` 与 `/pages/:pageId/edit` 路由、视觉和主要交互不变。
- `pages` 不得依赖 `page-builder`。
- `page-builder` 只能通过 `@/features/pages` 使用页面能力。
- `page-builder/model` 不得依赖 React UI、shadcn 或 Tailwind。
- Page Builder UI 不得调用 API client、QueryClient 或 pages 内部文件。
- Block Picker 不得生成 ID、复制默认值或判断 singleton。
- Block List 和拖拽 UI 只发送目标索引，不修改 blocks。
- 属性编辑器不得维护页面草稿或执行保存。
- 不修改 `src/components/blocks/**`。
- 不加入撤销重做、自动保存、版本历史或低代码表单引擎。

---

## 目标文件结构

```text
src/features/pages/
├─ model/useResolvedPage.ts
├─ model/useResolvedPage.test.tsx
├─ model/useSavePage.ts
└─ model/useSavePage.test.tsx

src/features/page-builder/
├─ model/
│  ├─ pageBuilder.types.ts
│  ├─ pageBuilder.defaults.ts
│  ├─ pageBuilder.mapper.ts
│  ├─ pageBuilder.mapper.test.ts
│  ├─ blockCatalog.ts
│  ├─ blockCatalog.test.ts
│  ├─ blockCommands.ts
│  ├─ blockCommands.test.ts
│  ├─ pageBuilder.reducer.ts
│  ├─ pageBuilder.reducer.test.ts
│  ├─ usePageBuilderController.ts
│  └─ usePageBuilderController.test.tsx
├─ ui/
│  ├─ PageBuilderContainer.tsx
│  ├─ PageBuilderView.tsx
│  ├─ PageBuilderView.test.tsx
│  ├─ block-list/
│  ├─ block-picker/
│  ├─ property-panel/
│  ├─ page-settings/
│  └─ seo-settings/
└─ index.ts
```

最终删除：

```text
src/features/pages/model/usePageEditor.ts
src/features/pages/model/usePageEditor.test.tsx
src/features/pages/ui/PageBuilderEditor.tsx
src/admin/pageBuilder/**
```

---

## Task 1：建立 pages 公共读取与保存端口

**Files:**

- Create: `src/features/pages/model/useResolvedPage.ts`
- Create: `src/features/pages/model/useResolvedPage.test.tsx`
- Create: `src/features/pages/model/useSavePage.ts`
- Create: `src/features/pages/model/useSavePage.test.tsx`
- Modify: `src/features/pages/index.ts`

**Produces:**

```ts
useResolvedPage(pageId): {
  page: CustomPage | undefined;
  isLoading: boolean;
  error: Error | null;
}

useSavePage(): {
  savePage(page: CustomPage): Promise<CustomPage>;
  isSaving: boolean;
  error: Error | null;
}
```

- [ ] **Step 1：测试页面索引与详情合并**

覆盖：

- 索引提供 `id/path/title/isFixed/type`。
- 详情提供 `blocks/content/seo`。
- `pageId` 为空时不请求详情。
- 页面不存在时返回 `undefined`。

Run:

```powershell
npm.cmd test -- src/features/pages/model/useResolvedPage.test.tsx
```

Expected: 初次 FAIL，完成实现后 PASS。

- [ ] **Step 2：实现 `useResolvedPage`**

使用 `pageKeys.list()` 与 `pageKeys.detail(pageId)`；合并规则只存在于 pages feature。不要让 page-builder 理解 `pages_index` 或 `page:{id}`。

- [ ] **Step 3：测试详情与索引同步保存**

覆盖：

- 调用 `savePageDetail(page.id, page)`。
- 读取当前索引并替换对应条目。
- 调用 `savePagesIndex(sanitizePageIndex(nextPages))`。
- 成功后更新详情缓存并失效列表缓存。
- 任一步失败时 Promise reject。

Run:

```powershell
npm.cmd test -- src/features/pages/model/useSavePage.test.tsx
```

- [ ] **Step 4：实现 `useSavePage` 并公开导出**

`src/features/pages/index.ts` 最终为：

```ts
export { PagesManager } from './ui/PagesManager';
export { useResolvedPage } from './model/useResolvedPage';
export { useSavePage } from './model/useSavePage';
```

- [ ] **Step 5：验证并提交**

```powershell
npm.cmd test -- src/features/pages/model/useResolvedPage.test.tsx src/features/pages/model/useSavePage.test.tsx
git add src/features/pages
git commit -m "refactor(pages): expose page builder persistence ports"
```

---

## Task 2：建立 Page Builder 类型、默认值和 Mapper

**Files:**

- Create: `src/features/page-builder/model/pageBuilder.types.ts`
- Create: `src/features/page-builder/model/pageBuilder.defaults.ts`
- Create: `src/features/page-builder/model/pageBuilder.mapper.ts`
- Create: `src/features/page-builder/model/pageBuilder.mapper.test.ts`

**Key types:**

```ts
type PageBuilderPanel =
  | { type: 'page-settings' }
  | { type: 'seo-settings' }
  | { type: 'block'; blockId: string };

interface PageBuilderDraft {
  id: string;
  path: string;
  title: Translation;
  isFixed: boolean;
  type?: CustomPage['type'];
  content?: unknown;
  blocks: PageBlock[];
  seo: PageSeo;
}

interface PageBuilderState {
  draft: PageBuilderDraft;
  baseline: PageBuilderDraft;
  selectedPanel: PageBuilderPanel | null;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  error: string | null;
}
```

- [ ] **Step 1：写 Mapper 测试**

覆盖：

- 缺失 SEO 时补齐 title、description、keywords、targetCountry。
- blocks、content、title、seo 不共享可变引用。
- `toSavablePage(toPageBuilderDraft(page))` 保留现有 `CustomPage` 字段。

- [ ] **Step 2：实现默认值与 Mapper**

必须提供：

```ts
createDefaultSeo(): PageSeo
toPageBuilderDraft(page: CustomPage): PageBuilderDraft
toSavablePage(draft: PageBuilderDraft): CustomPage
```

使用 `structuredClone` 复制可变内容。

- [ ] **Step 3：验证并提交**

```powershell
npm.cmd test -- src/features/page-builder/model/pageBuilder.mapper.test.ts
git add src/features/page-builder/model
git commit -m "feat(page-builder): add draft model and mapper"
```

---

## Task 3：建立唯一 Block Catalog

**Files:**

- Create: `src/features/page-builder/model/blockCatalog.ts`
- Create: `src/features/page-builder/model/blockCatalog.test.ts`
- Modify: `src/config/componentRegistry.ts`

**Produces:**

```ts
interface BlockCatalogItem {
  type: BlockType;
  name: Translation;
  description: Translation;
  category: ComponentCategory;
  icon: string;
  singleton: boolean;
  hasGlobalData: boolean;
  createDefaultContent(): unknown;
}

getBlockCatalogItem(type): BlockCatalogItem | undefined
getAvailableBlocks(blocks): AvailableBlock[]
```

- [ ] **Step 1：写 Catalog 测试**

覆盖：

- 每次 `createDefaultContent()` 返回独立嵌套对象。
- 已存在 singleton 时 `canAdd=false`。
- 普通 Block 可重复添加。
- 现有全部 BlockType 均有 Catalog 条目。
- 分类顺序与当前 `componentsByCategory` 一致。

- [ ] **Step 2：迁移现有注册表数据**

将 `src/config/componentRegistry.ts` 中全部元数据和默认值原样迁入 `blockCatalog.ts`。不得调整名称、分类、图标、默认值、singleton 或 `hasGlobalData`。

默认值改为：

```ts
createDefaultContent: () => structuredClone(defaultContent)
```

- [ ] **Step 3：旧注册表改为兼容派生**

`componentRegistry`、`componentsByCategory`、`categoryNames`、`canAddBlock` 从新 Catalog 派生，避免两个权威来源。新 Page Builder 不得导入旧注册表。

- [ ] **Step 4：验证并提交**

```powershell
npm.cmd test -- src/features/page-builder/model/blockCatalog.test.ts
npm.cmd run build
git add src/features/page-builder/model/blockCatalog* src/config/componentRegistry.ts
git commit -m "refactor(page-builder): centralize block catalog"
```

---

## Task 4：实现 Block 纯命令

**Files:**

- Create: `src/features/page-builder/model/blockCommands.ts`
- Create: `src/features/page-builder/model/blockCommands.test.ts`

**Interfaces:**

```ts
type PageBuilderCommandError =
  | 'UNKNOWN_BLOCK_TYPE'
  | 'BLOCK_NOT_FOUND'
  | 'DUPLICATE_SINGLETON'
  | 'INVALID_TARGET_INDEX';

type CommandResult<T> =
  | { ok: true; value: T; changed: boolean }
  | { ok: false; error: PageBuilderCommandError };
```

必须实现：

```ts
createBlock(type, idGenerator)
addBlock(draft, block, position?)
removeBlock(draft, blockId)
moveBlock(draft, blockId, targetIndex)
toggleBlockVisibility(draft, blockId)
updateBlockContent(draft, blockId, content)
updatePageMeta(draft, changes)
updateSeo(draft, seo)
```

- [ ] **Step 1：写失败测试**

覆盖：

- 注入 ID 生成器。
- 未知类型。
- singleton 冲突。
- 指定位置添加。
- 删除存在或不存在的 Block。
- 移动到首位、末位、原位和越界位置。
- 显隐切换。
- 只替换目标 Block content。
- Meta 与 SEO 更新。
- 无实际变化时 `changed=false`。
- 所有命令不修改输入对象。

- [ ] **Step 2：实现纯命令**

命令不得依赖 React、浏览器 API 或 UI 文案。错误只返回稳定错误码。

- [ ] **Step 3：验证并提交**

```powershell
npm.cmd test -- src/features/page-builder/model/blockCommands.test.ts
git add src/features/page-builder/model/blockCommands*
git commit -m "feat(page-builder): add pure block commands"
```

---

## Task 5：建立 Reducer 和编辑会话

**Files:**

- Create: `src/features/page-builder/model/pageBuilder.reducer.ts`
- Create: `src/features/page-builder/model/pageBuilder.reducer.test.ts`

**Actions:**

```ts
select-panel
add-block
remove-block
move-block
toggle-block
update-block
update-meta
update-seo
save-started
save-succeeded
save-failed
clear-save-feedback
replace-from-server
```

- [ ] **Step 1：写 Reducer 测试**

覆盖：

- 有效命令更新 draft 并产生 dirty。
- 无效命令保留 draft 并写入明确中文错误。
- 删除当前选中 Block 后清空选区。
- 保存开始、成功、失败状态。
- 保存成功后 baseline 与 draft 一致。
- dirty draft 不接受后台刷新覆盖。
- clean draft 接受服务端新值。
- 魔法字符串 `__settings__`、`__seo__` 不再出现。

- [ ] **Step 2：实现 Reducer**

必须提供：

```ts
createPageBuilderState(page): PageBuilderState
pageBuilderReducer(state, action): PageBuilderState
isPageBuilderDirty(state): boolean
```

Reducer 不执行 Query、Mutation、计时器、confirm 或导航。

- [ ] **Step 3：验证并提交**

```powershell
npm.cmd test -- src/features/page-builder/model/pageBuilder.reducer.test.ts
git add src/features/page-builder/model/pageBuilder.reducer*
git commit -m "feat(page-builder): add editor session reducer"
```

---

## Task 6：实现 Headless Controller

**Files:**

- Create: `src/features/page-builder/model/usePageBuilderController.ts`
- Create: `src/features/page-builder/model/usePageBuilderController.test.tsx`

**Consumes:**

```ts
useResolvedPage
useSavePage
pageBuilderReducer
blockCatalog
createBlock
```

**Produces:**

```ts
usePageBuilderController(pageId):
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'not-found' }
  | {
      status: 'ready';
      viewModel: PageBuilderViewModel;
      actions: PageBuilderActions;
    }
```

- [ ] **Step 1：写 Controller 测试**

覆盖：

- loading、error、not-found、ready。
- Query 页面初始化 draft。
- 添加 Block 时 Controller 生成 `block_<nanoid>` 并自动选中。
- availableBlocks 包含 singleton 可用状态。
- selectedBlock 从 selectedPanel 派生。
- 修改 Meta、SEO、Block 后 dirty。
- 保存调用 `useSavePage`。
- 保存成功重置 baseline。
- 保存失败保留 dirty draft。
- refetch 不覆盖 dirty draft。
- fixed-layout 返回只读状态。

- [ ] **Step 2：实现 ViewModel**

```ts
interface PageBuilderViewModel {
  page: PageBuilderDraft;
  selectedPanel: PageBuilderPanel | null;
  selectedBlock?: PageBlock;
  availableBlocks: AvailableBlock[];
  isFixedLayout: boolean;
  isDirty: boolean;
  canSave: boolean;
  isSaving: boolean;
  saveStatus: PageBuilderSaveStatus;
  error: string | null;
}
```

- [ ] **Step 3：实现 Actions**

```ts
interface PageBuilderActions {
  selectPanel(panel): void;
  addBlock(type): void;
  removeBlock(blockId): void;
  moveBlock(blockId, targetIndex): void;
  toggleBlock(blockId): void;
  updateBlock(blockId, content): void;
  updateMeta(changes): void;
  updateSeo(seo): void;
  save(): Promise<void>;
}
```

Controller 不渲染 JSX，不返回 Reducer dispatch 或 Query 对象。

- [ ] **Step 4：验证并提交**

```powershell
npm.cmd test -- src/features/page-builder/model/usePageBuilderController.test.tsx
git add src/features/page-builder/model/usePageBuilderController*
git commit -m "feat(page-builder): add headless editor controller"
```

---

## Task 7：建立 Container、View 并切换路由

**Files:**

- Create: `src/features/page-builder/ui/PageBuilderContainer.tsx`
- Create: `src/features/page-builder/ui/PageBuilderView.tsx`
- Create: `src/features/page-builder/ui/PageBuilderView.test.tsx`
- Create: `src/features/page-builder/index.ts`
- Modify: `src/App.tsx`
- Modify: `src/features/pages/index.ts`

**View contract:**

```ts
interface PageBuilderViewProps {
  viewModel: PageBuilderViewModel;
  actions: PageBuilderActions;
  onBack(): void;
}
```

- [ ] **Step 1：写 View 契约测试**

使用伪造 ViewModel/Actions，覆盖：

- 设置和 SEO 按钮只调用 `selectPanel`。
- 保存按钮按 `canSave/isSaving` 启禁。
- View 不需要 QueryProvider 或 API mock。
- 错误和 saved 状态正确显示。

- [ ] **Step 2：实现 Container**

职责仅包括：

- 读取 `pageId`。
- 调用 Controller。
- 渲染 loading/error/not-found/fixed-layout。
- 将 ready 状态传给 View。
- 适配返回 `/pages`。

- [ ] **Step 3：实现当前双栏 View 骨架**

可维护 `addDialogOpen` 等纯视觉状态；不得创建页面草稿 `useState`。

- [ ] **Step 4：公开 feature 并切换路由**

```ts
// features/page-builder/index.ts
export { PageBuilderContainer } from './ui/PageBuilderContainer';
export type {
  PageBuilderActions,
  PageBuilderViewModel,
} from './model/pageBuilder.types';
```

`src/App.tsx`：

```ts
import { PagesManager } from '@/features/pages';
import { PageBuilderContainer } from '@/features/page-builder';
```

- [ ] **Step 5：验证并提交**

```powershell
npm.cmd test -- src/features/page-builder/ui/PageBuilderView.test.tsx
npm.cmd run build
git add src/features/page-builder src/features/pages/index.ts src/App.tsx
git commit -m "refactor(page-builder): route through independent container"
```

---

## Task 8：迁移列表、Picker、拖拽、页面设置和 SEO UI

**Files:**

- Move: `src/admin/pageBuilder/BlockList.tsx`
- Move: `src/admin/pageBuilder/BlockItem.tsx`
- Move: `src/admin/pageBuilder/AddBlockDialog.tsx`
- Move: `src/admin/pageBuilder/BlockThumbnail.tsx`
- Move: `src/admin/pageBuilder/PageSettingsEditor.tsx`
- Move: `src/admin/pageBuilder/SEOEditor.tsx`
- Modify: `src/features/page-builder/ui/PageBuilderView.tsx`
- Modify: `src/features/page-builder/ui/PageBuilderView.test.tsx`

目标路径：

```text
ui/block-list/
ui/block-picker/
ui/page-settings/
ui/seo-settings/
```

- [ ] **Step 1：使用 `git mv` 移动文件**

保留当前 JSX 和样式，不在此任务重做视觉。

- [ ] **Step 2：让 Picker 成为纯 View**

新契约：

```ts
interface AddBlockDialogProps {
  open: boolean;
  items: AvailableBlock[];
  onOpenChange(open: boolean): void;
  onAdd(type: BlockType): void;
}
```

删除：

```text
nanoid
componentRegistry
defaultProps
canAddBlock
```

- [ ] **Step 3：统一排序 Action**

Block List：

```ts
onMove(blockId, targetIndex)
```

按钮上下移动与 DnD 都只计算目标索引，然后调用 `actions.moveBlock`。View 不使用 `arrayMove` 生成新数组。

- [ ] **Step 4：设置和 SEO 改为受控 View**

```ts
PageSettingsEditor({
  title,
  path,
  isFixed,
  disabled,
  errors,
  onChange,
})

SEOEditor({
  value,
  disabled,
  errors,
  onChange,
})
```

默认 SEO 由 Mapper 提供，不在 UI 补值。

- [ ] **Step 5：补充交互测试**

覆盖添加、选择、移动、显隐、删除、设置和 SEO Action 参数。

- [ ] **Step 6：验证并提交**

```powershell
npm.cmd test -- src/features/page-builder/ui/PageBuilderView.test.tsx
npm.cmd run build
git add src/features/page-builder/ui src/admin/pageBuilder
git commit -m "refactor(page-builder): migrate editor views"
```

---

## Task 9：建立属性编辑器注册表并迁移编辑器

**Files:**

- Create: `src/features/page-builder/ui/property-panel/propertyEditor.types.ts`
- Create: `src/features/page-builder/ui/property-panel/propertyEditorRegistry.ts`
- Create: `src/features/page-builder/ui/property-panel/BlockPropertyPanel.tsx`
- Move: `src/admin/pageBuilder/propsEditors/*.tsx`
- Delete: `src/admin/pageBuilder/BlockPropsEditor.tsx`

**Editor contract:**

```ts
interface BlockPropertyEditorProps<T = unknown> {
  value: T;
  onChange(value: T): void;
  disabled?: boolean;
  errors?: Record<string, string>;
}
```

- [ ] **Step 1：创建 UI 注册表**

```ts
type PropertyEditorComponent =
  ComponentType<BlockPropertyEditorProps<unknown>>;

const propertyEditorRegistry: Partial<
  Record<BlockType, PropertyEditorComponent>
>;
```

注册现有 `BlockPropsEditor` switch 中的全部类型。`caseStudies` 当前无编辑器，保持未注册并显示空状态。

- [ ] **Step 2：移动全部 `propsEditors`**

目标：

```text
src/features/page-builder/ui/property-panel/editors/
```

统一机械替换：

```text
props     → value
onUpdate  → onChange
```

保留现有 UI、文案、图片上传和字段行为。

- [ ] **Step 3：保留 Product Grid 组合编辑**

在注册表旁创建组合适配器，同时渲染：

```text
LayoutPropsEditor
ProductGridPropsEditor
```

`LayoutPropsEditor` 不注册为独立 BlockType。

- [ ] **Step 4：实现 `BlockPropertyPanel`**

职责：

- 从 Catalog 获取名称、描述和图标。
- 从 UI 注册表获取编辑器。
- 将 `block.content` 与 `onChange` 传入编辑器。
- 未知类型显示错误。
- 无编辑器类型显示“暂无属性编辑器”。

- [ ] **Step 5：检查禁止依赖**

```powershell
Get-ChildItem -Recurse -File src/features/page-builder/ui/property-panel | Select-String -Pattern "@/features/pages|pages.api|apiClient|usePageBuilderController|nanoid|componentRegistry"
```

Expected: no matches。

- [ ] **Step 6：验证并提交**

```powershell
npm.cmd run build
npm.cmd test -- src/features/page-builder
git add src/features/page-builder/ui/property-panel src/admin/pageBuilder
git commit -m "refactor(page-builder): migrate property editors behind registry"
```

---

## Task 10：加入统一离开确认

**Files:**

- Modify: `src/features/page-builder/model/pageBuilder.types.ts`
- Modify: `src/features/page-builder/model/usePageBuilderController.ts`
- Modify: `src/features/page-builder/model/usePageBuilderController.test.tsx`
- Modify: `src/features/page-builder/ui/PageBuilderView.tsx`

- [ ] **Step 1：扩展 Actions**

```ts
requestExit(onConfirmed: () => void): void;
```

- [ ] **Step 2：测试浏览器离开保护**

覆盖：

- clean draft 不阻止 `beforeunload`。
- dirty draft 调用 `preventDefault`。
- 保存成功后不再阻止。

- [ ] **Step 3：测试应用内离开确认**

覆盖：

- clean 时直接执行回调。
- dirty 且 confirm=true 时执行回调。
- dirty 且 confirm=false 时不执行回调。

- [ ] **Step 4：实现并接入返回按钮**

`window.confirm` 只存在于 Controller。View 返回按钮调用：

```ts
actions.requestExit(onBack)
```

- [ ] **Step 5：验证并提交**

```powershell
npm.cmd test -- src/features/page-builder/model/usePageBuilderController.test.tsx src/features/page-builder/ui/PageBuilderView.test.tsx
git add src/features/page-builder
git commit -m "feat(page-builder): protect unsaved drafts"
```

---

## Task 11：删除旧实现

**Files:**

- Delete: `src/features/pages/model/usePageEditor.ts`
- Delete: `src/features/pages/model/usePageEditor.test.tsx`
- Delete: `src/features/pages/ui/PageBuilderEditor.tsx`
- Delete remaining: `src/admin/pageBuilder/**`

- [ ] **Step 1：用 CodeGraph 检查调用方**

```powershell
codegraph explore "Find every caller and import of usePageEditor, PageBuilderEditor, admin/pageBuilder, BlockPropsEditor, AddBlockDialog, BlockList, PageSettingsEditor, SEOEditor."
```

Expected: 只剩待删除文件。

- [ ] **Step 2：删除旧文件**

使用 `git rm`。删除 `src/admin/pageBuilder` 前确认绝对路径：

```text
H:\Kellogg\adminApp\src\admin\pageBuilder
```

- [ ] **Step 3：检查架构边界**

```powershell
Get-ChildItem -Recurse -File src/features/page-builder | Select-String -Pattern "@/shared/api/client|@/lib/api|@/features/pages/"
Get-ChildItem -Recurse -File src/features/pages | Select-String -Pattern "@/features/page-builder"
Get-ChildItem -Recurse -File src/components/blocks | Select-String -Pattern "page-builder|admin/pageBuilder"
```

Expected: no matches。

- [ ] **Step 4：验证并提交**

```powershell
npm.cmd run build
npm.cmd test
git add src/features/pages src/features/page-builder src/admin/pageBuilder
git commit -m "refactor(page-builder): remove legacy editor implementation"
```

---

## Task 12：文档和最终验证

**Files:**

- Modify: `docs/README.md`

- [ ] **Step 1：更新目录导航**

```text
features/
├── pages/           页面索引、详情与 CRUD
└── page-builder/    编辑会话、Block 命令与可替换 UI
```

删除旧 `admin/pageBuilder` 导航说明。

- [ ] **Step 2：记录边界**

补充：

```markdown
`features/pages` 只负责页面事实与持久化；`features/page-builder`
通过 pages 公共入口读取和保存页面。Page Builder View 只消费
ViewModel 与 Actions，不直接访问页面 API。
```

- [ ] **Step 3：运行最终验证**

Targeted:

```powershell
npm.cmd test -- src/features/pages/model/useResolvedPage.test.tsx src/features/pages/model/useSavePage.test.tsx src/features/page-builder
```

Full:

```powershell
npm.cmd test
npm.cmd run build
npx.cmd eslint src/features/page-builder src/features/pages src/App.tsx
```

Architecture:

```powershell
Test-Path src/admin/pageBuilder
git diff --name-only HEAD~1 -- src/components/blocks
```

Expected:

- 所有测试 PASS。
- Production build PASS。
- ESLint 无新增错误。
- `Test-Path` 返回 `False`。
- `src/components/blocks` 无变更。

- [ ] **Step 4：提交**

```powershell
git add docs/README.md
git commit -m "docs(page-builder): document independent feature"
```

---

## Completion Criteria

- `features/page-builder` 独立存在并通过 `index.ts` 暴露入口。
- `/pages/:pageId/edit` 使用 `PageBuilderContainer`。
- `pages` 只负责页面查询、CRUD、索引同步和缓存。
- Block Catalog 是默认值与 singleton 规则的唯一来源。
- Block 操作由纯命令完成并有边界测试。
- Controller 管理草稿、基线、保存、错误和离开确认。
- View 只消费 ViewModel 与 Actions。
- Picker 不包含 ID、默认值或 singleton 逻辑。
- 属性编辑器通过统一受控契约连接。
- 保存失败保留草稿，refetch 不覆盖脏草稿。
- 旧 `usePageEditor` 与 `src/admin/pageBuilder` 删除。
- `src/components/blocks/**` 无修改。
- Targeted tests、full tests、build 和 lint 全部通过。

## Commit Sequence

```text
refactor(pages): expose page builder persistence ports
feat(page-builder): add draft model and mapper
refactor(page-builder): centralize block catalog
feat(page-builder): add pure block commands
feat(page-builder): add editor session reducer
feat(page-builder): add headless editor controller
refactor(page-builder): route through independent container
refactor(page-builder): migrate editor views
refactor(page-builder): migrate property editors behind registry
feat(page-builder): protect unsaved drafts
refactor(page-builder): remove legacy editor implementation
docs(page-builder): document independent feature
```
