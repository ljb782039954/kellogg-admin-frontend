# Inquiries 独立模块重构实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将询盘收件箱和 `system-inquiry` 页面配置迁入独立 `features/inquiries`，实现 UI、查询、Mutation、导出和页面保存逻辑分离。

**Architecture:** `features/inquiries/inbox` 通过 TanStack Query 管理服务端分页列表，以 Controller 暴露 ViewModel 和 Actions；`features/inquiries/settings` 通过 `features/pages` 公共 Hook 读取和保存页面配置。两个 UI 都不直接访问 API、QueryClient、ContentContext 或传输层 DTO。

**Tech Stack:** React 19、TypeScript 5.9、Vite 7、TanStack Query 5、React Hook Form 7、Zod 4、Vitest 4、Testing Library、MSW、shadcn/ui、Tailwind CSS 3。

## Global Constraints

- 本计划只修改 `adminApp`。
- worker-api 已支持 `page/pageSize/status/search`，不在本计划中安排后端任务。
- 保持 `/inquiries` 和 `/inquiry-editor` 路由不变。
- 保持当前收件箱双栏布局和配置编辑器视觉不变。
- UI 不得导入 `@/lib/api`、`@/shared/api/client`、QueryClient 或 ContentContext。
- settings 只能通过 `@/features/pages` 使用页面能力。
- pages 不得依赖 inquiries。
- 查询数据不得复制到 `useState<Inquiry[]>`。
- 选区只保存 `selectedId`，不保存独立 Inquiry 副本。
- CSV 只导出当前服务端筛选页。
- 不新增批量操作、邮件回复、内部备注、负责人或全量导出接口。
- 每项业务行为先写失败测试，再实现并验证。

---

## 目标文件结构

```text
src/features/inquiries/
├─ api/
│  ├─ inquiries.api.ts
│  ├─ inquiries.api.test.ts
│  └─ inquiries.keys.ts
├─ model/
│  ├─ inquiry.types.ts
│  ├─ inquiry.mapper.ts
│  ├─ inquiry.mapper.test.ts
│  ├─ inquiry.schema.ts
│  ├─ inquiry.exports.ts
│  ├─ inquiry.exports.test.ts
│  ├─ useInquiriesList.ts
│  ├─ useInquiriesList.test.tsx
│  ├─ useInquirySettings.ts
│  └─ useInquirySettings.test.tsx
├─ ui/
│  ├─ inbox/
│  │  ├─ InquiriesManager.tsx
│  │  ├─ InquiriesView.tsx
│  │  ├─ InquiriesView.test.tsx
│  │  ├─ InquiryList.tsx
│  │  └─ InquiryDetail.tsx
│  └─ settings/
│     ├─ InquirySettingsEditor.tsx
│     ├─ InquirySettingsView.tsx
│     └─ InquirySettingsView.test.tsx
└─ index.ts
```

最终删除：

```text
src/admin/InquiryManagement.tsx
src/admin/editors/InquiryEditor.tsx
```

---

## Task 1：建立 API、Query Keys 和领域类型

**Files:**

- Create: `src/features/inquiries/api/inquiries.api.ts`
- Create: `src/features/inquiries/api/inquiries.api.test.ts`
- Create: `src/features/inquiries/api/inquiries.keys.ts`
- Create: `src/features/inquiries/model/inquiry.types.ts`

**Interfaces:**

```ts
export type InquiryStatus = 'pending' | 'processed';

export interface InquiryListFilters {
  page: number;
  pageSize: number;
  search?: string;
  status?: InquiryStatus;
}

export interface InquiryDto {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  company: string | null;
  product_type: string | null;
  quantity: string | null;
  message: string | null;
  status: string;
  created_at: string;
  updated_at?: string;
}

export interface PaginatedInquiriesDto {
  data: InquiryDto[];
  pagination: Pagination;
}
```

- [ ] **Step 1：写 API 失败测试**

覆盖：

- `getInquiries` 编码 `page/pageSize/search/status`。
- 空 search 不发送。
- `status=all` 在调用 API 前已转换为不发送 status。
- 特殊字符通过 URLSearchParams 编码。
- PATCH 路径、方法和 body 正确。
- DELETE 路径和方法正确。

关键断言：

```ts
expect(requestMock).toHaveBeenCalledWith(
  '/api/inquiries?page=2&pageSize=20&search=Acme&status=pending',
);
```

- [ ] **Step 2：运行并确认失败**

```powershell
npm.cmd test -- src/features/inquiries/api/inquiries.api.test.ts
```

Expected: FAIL，模块不存在。

- [ ] **Step 3：实现 API**

必须提供：

```ts
getInquiries(filters): Promise<PaginatedInquiriesDto>
updateInquiryStatus(id, status): Promise<{ message: string }>
deleteInquiry(id): Promise<{ message: string }>
```

全部通过 `apiClient.request`，不得使用旧 `api` 对象。

- [ ] **Step 4：建立 Query Keys**

```ts
export const inquiryKeys = {
  all: ['inquiries'] as const,
  lists: () => [...inquiryKeys.all, 'list'] as const,
  list: (filters: InquiryListFilters) =>
    [...inquiryKeys.lists(), filters] as const,
};
```

- [ ] **Step 5：验证并提交**

```powershell
npm.cmd test -- src/features/inquiries/api/inquiries.api.test.ts
git add src/features/inquiries/api src/features/inquiries/model/inquiry.types.ts
git commit -m "feat(inquiries): add inbox api and types"
```

---

## Task 2：建立 DTO Mapper 和配置 Schema

**Files:**

- Create: `src/features/inquiries/model/inquiry.mapper.ts`
- Create: `src/features/inquiries/model/inquiry.mapper.test.ts`
- Create: `src/features/inquiries/model/inquiry.schema.ts`

**Interfaces:**

```ts
export interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  company: string | null;
  productType: string | null;
  quantity: string | null;
  message: string | null;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string | null;
}

export interface InquirySettings {
  title: Translation;
  description: Translation;
}

toInquiry(dto: InquiryDto): Inquiry
toPaginatedInquiries(dto: PaginatedInquiriesDto): PaginatedInquiries
toInquirySettings(content: unknown): InquirySettings
```

- [ ] **Step 1：写 Mapper 失败测试**

覆盖：

- snake_case 转 camelCase。
- nullable 字段保持 null。
- `updated_at` 缺失时为 null。
- pending/processed 正常转换。
- 未知 status 抛出明确错误。
- 分页元数据原样保留。
- settings 缺失时使用当前默认中英文文案。
- settings 部分字段非法时回落到对应默认值。

- [ ] **Step 2：实现 Schema**

使用 Zod：

```ts
const translationSchema = z.object({
  zh: z.string(),
  en: z.string(),
});

export const inquirySettingsSchema = z.object({
  title: translationSchema,
  description: translationSchema,
});
```

导出 `InquirySettingsFormValues`。

- [ ] **Step 3：实现 Mapper**

默认文案必须与旧 `InquiryEditor` 一致。DTO 字段只允许出现在 API 与 Mapper。

- [ ] **Step 4：验证并提交**

```powershell
npm.cmd test -- src/features/inquiries/model/inquiry.mapper.test.ts
git add src/features/inquiries/model/inquiry.mapper* src/features/inquiries/model/inquiry.schema.ts
git commit -m "feat(inquiries): add domain mapper and settings schema"
```

---

## Task 3：提取 TXT/CSV 导出纯函数

**Files:**

- Create: `src/features/inquiries/model/inquiry.exports.ts`
- Create: `src/features/inquiries/model/inquiry.exports.test.ts`

**Interfaces:**

```ts
buildInquiryText(inquiry: Inquiry): string
buildInquiriesCsv(inquiries: Inquiry[]): string
buildInquiryTextFilename(inquiry: Inquiry): string
buildInquiriesCsvFilename(date: Date): string
downloadTextFile(content, filename, mimeType): void
```

- [ ] **Step 1：写纯函数失败测试**

覆盖：

- TXT 包含联系人、业务信息、状态、时间和消息。
- null 字段输出稳定占位符。
- CSV 列顺序与旧页面一致。
- 含逗号、引号、换行的所有单元格正确转义。
- CSV 使用 UTF-8 BOM，便于 Excel 打开中文。
- 单条文件名移除 Windows 非法字符。
- CSV 日期文件名稳定。

- [ ] **Step 2：实现内容与文件名函数**

CSV 不手动给部分字段加引号，应统一调用：

```ts
escapeCsvCell(value: unknown): string
```

纯内容函数不得访问 `document`、`URL` 或 toast。

- [ ] **Step 3：实现浏览器下载 helper**

`downloadTextFile` 只负责 Blob、Object URL、隐藏链接与 revoke。Controller 调用它，View 不调用。

- [ ] **Step 4：验证并提交**

```powershell
npm.cmd test -- src/features/inquiries/model/inquiry.exports.test.ts
git add src/features/inquiries/model/inquiry.exports*
git commit -m "feat(inquiries): add tested export formatters"
```

---

## Task 4：建立收件箱 Controller

**Files:**

- Create: `src/features/inquiries/model/useInquiriesList.ts`
- Create: `src/features/inquiries/model/useInquiriesList.test.tsx`

**ViewModel:**

```ts
interface InquiriesViewModel {
  inquiries: Inquiry[];
  selectedInquiry: Inquiry | null;
  pendingCount: number;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  search: string;
  status: 'all' | InquiryStatus;
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;
}
```

**Actions:**

```ts
changeSearch(value: string): void
changeStatus(value: 'all' | InquiryStatus): void
changePage(page: number): void
selectInquiry(id: number | null): void
updateStatus(id: number, status: InquiryStatus): Promise<void>
removeInquiry(id: number): Promise<void>
exportInquiry(inquiry: Inquiry): void
exportCurrentPage(): void
retry(): void
```

- [ ] **Step 1：写查询和筛选测试**

覆盖：

- 初始 filters 为 page 1、固定 pageSize、无 search/status。
- search 使用 400ms debounce。
- search 变化后 page 重置为 1。
- status 变化立即重置 page。
- page 变化保留 search/status。
- Query Key 使用完整 filters。
- 新查询保留上一页数据。

- [ ] **Step 2：写选区测试**

覆盖：

- 只存 selectedId。
- selectedInquiry 从当前 Query 数据派生。
- 状态缓存更新后详情自动变化。
- 翻页或筛选后 ID 不存在时清空选区。

- [ ] **Step 3：写 Mutation 缓存测试**

状态更新成功：

- 遍历 `inquiryKeys.lists()` 下现有缓存。
- 只替换匹配 ID。
- 不 invalidate 其他业务。

删除成功：

- 从相关缓存移除 ID。
- total 减一。
- 删除当前项清空选区。
- 当前页最后一项删除且 page > 1 时切回上一页。

失败：

- 缓存和选区不变。

- [ ] **Step 4：实现 Controller**

使用 `placeholderData: keepPreviousData`。Mutation 成功时使用 `queryClient.setQueriesData` 精确更新 inquiry list 缓存。

`pendingCount` 定义为当前返回页中 pending 数量；不伪装为全库总数。

导出：

- `exportInquiry` 使用单条 TXT。
- `exportCurrentPage` 使用当前 `inquiries` 数组。

- [ ] **Step 5：验证并提交**

```powershell
npm.cmd test -- src/features/inquiries/model/useInquiriesList.test.tsx
git add src/features/inquiries/model/useInquiriesList*
git commit -m "feat(inquiries): add inbox controller"
```

---

## Task 5：迁移收件箱 UI

**Files:**

- Create: `src/features/inquiries/ui/inbox/InquiriesManager.tsx`
- Create: `src/features/inquiries/ui/inbox/InquiriesView.tsx`
- Create: `src/features/inquiries/ui/inbox/InquiriesView.test.tsx`
- Create: `src/features/inquiries/ui/inbox/InquiryList.tsx`
- Create: `src/features/inquiries/ui/inbox/InquiryDetail.tsx`

**Boundaries:**

- `InquiriesManager`：调用 Controller、删除确认和 toast。
- `InquiriesView`：组合 Header、Filters、List、Detail、Pagination。
- `InquiryList`：列表与选择事件。
- `InquiryDetail`：详情、状态、删除和单条导出事件。

- [ ] **Step 1：写 View 失败测试**

使用伪造 ViewModel/Actions，覆盖：

- 搜索输入调用 `changeSearch`。
- 状态按钮调用 `changeStatus`。
- 分页调用 `changePage`。
- 点击列表调用 `selectInquiry`。
- 状态按钮调用 `updateStatus`。
- 删除按钮只发送删除意图。
- 单条和 CSV 导出事件。
- loading、empty、error、fetching 状态。

测试不使用 QueryProvider，不 mock API。

- [ ] **Step 2：拆分并迁移旧 JSX**

从 `src/admin/InquiryManagement.tsx` 迁移当前视觉。替换：

```text
inq.product_type  → inquiry.productType
inq.created_at    → inquiry.createdAt
```

删除 UI 中：

```text
api.getInquiries
api.patchInquiry
api.deleteInquiry
Blob/URL/document 导出逻辑
本地 inquiries 数组
本地 selectedInquiry 对象
本地过滤逻辑
```

- [ ] **Step 3：接入分页**

分页显示服务端 `page/total/totalPages`。搜索或状态变化后的页码由 Controller 控制。

标题角标使用“当前页 X 条待处理”，避免误导为全库数量。

- [ ] **Step 4：实现 Manager**

删除确认：

```ts
if (!window.confirm('确定要删除这条询盘吗？此操作不可撤销。')) return;
```

确认后调用 `removeInquiry`。成功/失败 toast 在 Manager 中处理，不进入纯 View。

- [ ] **Step 5：验证并提交**

```powershell
npm.cmd test -- src/features/inquiries/ui/inbox/InquiriesView.test.tsx
npm.cmd run build
git add src/features/inquiries/ui/inbox
git commit -m "refactor(inquiries): migrate inbox view"
```

---

## Task 6：建立页面配置 Controller

**Files:**

- Create: `src/features/inquiries/model/useInquirySettings.ts`
- Create: `src/features/inquiries/model/useInquirySettings.test.tsx`

**Consumes:**

```ts
useResolvedPage('system-inquiry')
useSavePage()
inquirySettingsSchema
toInquirySettings()
```

**Produces:**

```ts
useInquirySettings(): {
  status: 'loading' | 'error' | 'not-found' | 'ready';
  form?: UseFormReturn<InquirySettingsFormValues>;
  isSaving: boolean;
  error: string | null;
  submit(): Promise<void>;
}
```

- [ ] **Step 1：写初始化测试**

覆盖：

- 从 `system-inquiry.content` 初始化表单。
- content 缺失时使用默认文案。
- 页面 loading/error/not-found 状态。
- 后台 refetch 不覆盖 dirty 表单。

- [ ] **Step 2：写保存测试**

保存时必须：

```ts
savePage({
  ...originalPage,
  content: validatedSettings,
})
```

覆盖：

- 保留 id/path/title/isFixed/type/blocks/seo。
- 只替换 content。
- 成功后使用返回页面 content reset。
- 失败后保留 dirty 值。
- Zod 错误不调用 savePage。

- [ ] **Step 3：实现 Controller**

使用 React Hook Form + `zodResolver`。不调用 ContentContext，不导入 pages 内部文件。

- [ ] **Step 4：验证并提交**

```powershell
npm.cmd test -- src/features/inquiries/model/useInquirySettings.test.tsx
git add src/features/inquiries/model/useInquirySettings*
git commit -m "feat(inquiries): add settings form controller"
```

---

## Task 7：迁移页面配置 UI

**Files:**

- Create: `src/features/inquiries/ui/settings/InquirySettingsEditor.tsx`
- Create: `src/features/inquiries/ui/settings/InquirySettingsView.tsx`
- Create: `src/features/inquiries/ui/settings/InquirySettingsView.test.tsx`

**View contract:**

```ts
interface InquirySettingsViewProps {
  form: UseFormReturn<InquirySettingsFormValues>;
  isSaving: boolean;
  error: string | null;
  onSubmit(): void;
}
```

- [ ] **Step 1：写 View 失败测试**

覆盖：

- 显示当前双语标题和描述。
- 修改字段更新 form。
- 字段错误显示在对应控件。
- 保存按钮调用 onSubmit。
- saving 时按钮禁用。
- 持久保存错误显示。

- [ ] **Step 2：迁移旧视觉**

从旧 `InquiryEditor` 迁移 Header、卡片和提示区域。

优先使用现有 shared form Field；若当前没有对应 Field，可暂用兼容 `BilingualInput/BilingualInputAera`，但只能由 View 使用。

删除：

```text
useContent
findPage
updatePage
api.getPageById
config useState/useEffect
```

- [ ] **Step 3：实现 Editor Container**

根据 Controller status 渲染 loading/error/not-found/ready，并将 ready 表单传给 View。

- [ ] **Step 4：验证并提交**

```powershell
npm.cmd test -- src/features/inquiries/ui/settings/InquirySettingsView.test.tsx
npm.cmd run build
git add src/features/inquiries/ui/settings
git commit -m "refactor(inquiries): migrate settings editor"
```

---

## Task 8：公开 Feature 并切换路由

**Files:**

- Create: `src/features/inquiries/index.ts`
- Modify: `src/App.tsx`

- [ ] **Step 1：建立公共入口**

```ts
export { InquiriesManager } from './ui/inbox/InquiriesManager';
export { InquirySettingsEditor } from './ui/settings/InquirySettingsEditor';
export type { Inquiry, InquiryStatus } from './model/inquiry.types';
```

- [ ] **Step 2：切换路由导入**

`src/App.tsx`：

```ts
import {
  InquiriesManager,
  InquirySettingsEditor,
} from '@/features/inquiries';
```

路由保持：

```tsx
<Route path="inquiries" element={<InquiriesManager />} />
<Route path="inquiry-editor" element={<InquirySettingsEditor />} />
```

- [ ] **Step 3：验证并提交**

```powershell
npm.cmd test -- src/features/inquiries
npm.cmd run build
git add src/features/inquiries/index.ts src/App.tsx
git commit -m "refactor(inquiries): switch routes to feature"
```

---

## Task 9：删除旧 API 和旧页面

**Files:**

- Modify: `src/lib/api.ts`
- Delete: `src/admin/InquiryManagement.tsx`
- Delete: `src/admin/editors/InquiryEditor.tsx`

- [ ] **Step 1：使用 CodeGraph 确认调用方**

```powershell
codegraph explore "Find every caller and import of InquiryManagement, InquiryEditor, api.getInquiries, api.patchInquiry, api.deleteInquiry."
```

Expected: 只剩待删除旧页面和 `lib/api` 定义。

- [ ] **Step 2：删除旧 API 方法**

从 `src/lib/api.ts` 删除：

```ts
getInquiries
patchInquiry
deleteInquiry
```

- [ ] **Step 3：删除旧页面**

```powershell
git rm src/admin/InquiryManagement.tsx
git rm src/admin/editors/InquiryEditor.tsx
```

- [ ] **Step 4：检查依赖**

```powershell
Get-ChildItem -Recurse -File src/features/inquiries | Select-String -Pattern "@/lib/api|@/shared/api/client|@/context/ContentContext|@/features/pages/"
```

Expected:

- UI 不匹配任何禁止依赖。
- API 目录允许匹配 `@/shared/api/client`。
- settings model 不得匹配 `@/features/pages/` 内部路径，只允许 `@/features/pages`。

- [ ] **Step 5：验证并提交**

```powershell
npm.cmd test -- src/features/inquiries src/lib/api.test.ts
npm.cmd run build
git add src/lib/api.ts src/admin src/features/inquiries
git commit -m "refactor(inquiries): remove legacy pages and api methods"
```

---

## Task 10：清理 ContentContext 询盘遗留能力

**Files:**

- Modify: `src/context/ContentContext.tsx`
- Modify: `src/App.tsx` only if provider becomes unused.

- [ ] **Step 1：用 CodeGraph 检查 `findPage/updatePage/useContent`**

```powershell
codegraph explore "Find all callers of ContentContext findPage, updatePage, useContent, and ContentProvider after inquiries migration."
```

- [ ] **Step 2：删除询盘专用能力**

从 Context 类型、Provider 实现和 value 中删除：

```ts
findPage
updatePage
```

同时删除 `updatePage` 所需的页面保存逻辑和注释。

- [ ] **Step 3：按实际调用方决定 Provider**

如果仍有 `useContent` 消费者：

- 保留 ContentProvider。
- 不做无关 Context 重构。

如果已经没有消费者：

- 从 `App.tsx` 删除 ContentProvider 包裹。
- 删除 `ContentContext.tsx`。

不得在未检查调用方时直接删除 Provider。

- [ ] **Step 4：验证并提交**

```powershell
npm.cmd test
npm.cmd run build
git add src/context/ContentContext.tsx src/App.tsx
git commit -m "refactor(inquiries): remove context page compatibility"
```

---

## Task 11：文档与最终验证

**Files:**

- Modify: `docs/README.md`

- [ ] **Step 1：更新目录导航**

增加：

```text
features/
└── inquiries/    询盘收件箱与 system-inquiry 页面配置
```

删除：

```text
admin/InquiryManagement
admin/editors/InquiryEditor
```

- [ ] **Step 2：记录架构边界**

```markdown
`features/inquiries` 包含收件箱与页面配置两个子能力。收件箱使用
服务端搜索、状态筛选和分页；页面配置通过 `features/pages`
公共入口读取和保存 `system-inquiry`，不依赖 ContentContext。
```

- [ ] **Step 3：运行 Targeted Tests**

```powershell
npm.cmd test -- src/features/inquiries
```

Expected: API、Mapper、导出、Controller 和 View 测试全部 PASS。

- [ ] **Step 4：运行全量验证**

```powershell
npm.cmd test
npm.cmd run build
npx.cmd eslint src/features/inquiries src/App.tsx src/context/ContentContext.tsx src/lib/api.ts
```

Expected:

- Full tests PASS。
- Production build PASS。
- ESLint 无新增错误。

- [ ] **Step 5：检查架构边界**

```powershell
Get-ChildItem -Recurse -File src/features/inquiries/ui | Select-String -Pattern "@/lib/api|@/shared/api/client|@/context/ContentContext|QueryClient"
Get-ChildItem -Recurse -File src/features/inquiries/model | Select-String -Pattern "@/features/pages/"
Test-Path src/admin/InquiryManagement.tsx
Test-Path src/admin/editors/InquiryEditor.tsx
```

Expected:

- UI 搜索无结果。
- model 不导入 pages 内部路径。
- 两个 Test-Path 均为 False。

- [ ] **Step 6：提交**

```powershell
git add docs/README.md
git commit -m "docs(inquiries): document feature migration"
```

---

## Completion Criteria

- `features/inquiries` 独立存在并通过 `index.ts` 暴露两个路由入口。
- `/inquiries` 使用服务端 search、status 和 pagination。
- 搜索或状态变化重置页码。
- Query 数据不复制到普通数组 state。
- selectedInquiry 从 selectedId 与当前 Query 数据派生。
- Mutation 只更新 inquiries 缓存。
- CSV 导出当前筛选页并正确转义。
- `/inquiry-editor` 通过 pages 公共 Hook 保存配置。
- Settings 保存保留页面其他字段。
- UI 不导入 API、QueryClient 或 ContentContext。
- 旧页面、旧 inquiries API 方法和 Context 兼容能力删除。
- 两条路由与视觉主流程保持稳定。
- Targeted tests、full tests、build 和 lint 全部通过。

## Commit Sequence

```text
feat(inquiries): add inbox api and types
feat(inquiries): add domain mapper and settings schema
feat(inquiries): add tested export formatters
feat(inquiries): add inbox controller
refactor(inquiries): migrate inbox view
feat(inquiries): add settings form controller
refactor(inquiries): migrate settings editor
refactor(inquiries): switch routes to feature
refactor(inquiries): remove legacy pages and api methods
refactor(inquiries): remove context page compatibility
docs(inquiries): document feature migration
```
