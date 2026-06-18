# 页面与 Page Builder 模块改进指导

## 1. 审查结论

Pages 已建立页面索引 API、详情 API、Mapper、Schema、列表 controller 和编辑 controller，但目前把三个不同问题放在同一个 feature 内：

1. 页面索引与页面元数据 CRUD。
2. 页面详情草稿与保存会话。
3. Page Builder 的积木编排和属性编辑。

最需要优先处理的是存储一致性。当前创建、复制和删除涉及 `pages_index` 与 `page:{id}` 两份数据，却没有一个明确 use case 保证两者顺序、失败恢复和缓存更新；某些流程实际上只写了其中一份。

因此本模块属于“API 已迁移，但页面聚合根与 Page Builder 边界尚未成立”。

## 2. 当前存储与数据流

后端约定：

```text
pages_index     轻量页面索引
page:{id}       页面详情，包含 blocks、SEO、content
```

当前列表流程：

```text
PagesManager
  -> usePageList
     -> getPagesIndex
     -> savePagesIndex
     -> deletePageDetail
```

当前编辑流程：

```text
PageBuilderEditor
  -> usePageEditor
     -> usePageList（再次查询索引）
     -> getPageById
     -> localPage useState
     -> savePageDetail
  -> 旧 admin/pageBuilder 组件
```

## 3. 具体问题

### P0：创建和复制只写索引，没有写页面详情

代码证据：

- `usePageList.addPage()` 构造完整 `newPage`，复制时还复制 blocks 与 SEO。
- 随后只调用 `savePagesIndex(sanitizePageIndex(updated))`。
- `sanitizePageIndex` 会把 `blocks` 清空，只保留 `blockCount`。
- 流程没有调用 `savePageDetail(pageId, newPage)`。

影响：

- 新页面跳转到编辑器后，详情 Query 可能 404。
- 复制页面的 blocks 只参与计算索引数量，未持久化到 `page:{id}`。
- 编辑器是否还能打开取决于 API 对缺失详情的隐式兼容，行为不稳定。

目标：

建立明确的 `createPage` / `duplicatePage` use case：

```text
生成并校验完整页面
  -> 保存 page:{id}
  -> 更新 pages_index
  -> 更新 detail/list cache
  -> 导航
```

若后端无法提供原子接口，前端必须明确补偿策略。例如索引写入失败时删除刚创建的详情，或反过来选择更容易恢复的顺序。

### P0：删除存在不可恢复的部分成功

代码证据：

- `deletePage` 先删除 `page:{id}`。
- 然后保存过滤后的 `pages_index`。

如果第二步失败，索引仍指向已删除的详情；如果调整顺序，反向失败则会留下孤立详情。当前没有补偿、重试或部分失败提示。

目标：

- 优先推动后端提供单一删除端点，同时维护详情与索引。
- 过渡期返回分步骤结果，明确提示“详情已删除但索引更新失败”等状态。
- 删除成功后移除 detail cache，并更新或失效 list cache。

### P0：编辑草稿会被 Query 更新静默覆盖

代码证据：

- `usePageEditor` 将索引与详情合并后写入 `localPage`。
- `useEffect` 依赖 `pageId`、`indexPage`、`pageDetail`。
- 任一 Query refetch 或索引更新都会再次执行 `setLocalPage`。
- 没有 dirty 标记或覆盖确认。

影响：

- 用户编辑 blocks、SEO 或页面设置期间，后台 refetch 可能覆盖未保存内容。
- 保存详情后失效列表 Query，也可能通过 `indexPage` 变化触发表单重置。

目标：

- 页面草稿使用 reducer 或 RHF 建立初始化基线和 `isDirty`。
- 只在首次加载或显式切换 pageId 时初始化。
- 远端变化到来时：表单不脏则 reset；表单脏则保留草稿并提示远端已更新。
- 离开页面、返回列表和切换记录前进行未保存确认。

### P1：详情保存没有同步更新索引元数据

`handleUpdateMeta` 修改 `localPage.title/path`，`handleSave` 只调用 `savePageDetail`，随后只是失效列表。

如果后端保存 `page:{id}` 不会同时更新 `pages_index`，列表标题和路径仍是旧值。现有 API 设计表明这两份配置是独立写入的，因此该风险需要显式处理。

目标：

- 保存页面详情的 use case 同时生成并更新对应索引项。
- 或将元数据编辑只放在列表流程，Page Builder 不允许修改 title/path。
- 两种方案必须二选一，不能让两个入口分别维护同一字段而没有同步协议。

推荐保留 Page Builder 内编辑，但统一走 `savePage` 聚合 use case。

### P1：`usePageList` 没有使用 Mutation

当前 create、update、delete 是普通 async callback：

- 没有独立 pending 状态，用户可以重复点击。
- error state 从未在这些方法中设置。
- 成功反馈通过裸 `window.setTimeout` 管理。
- 无法在 mutation 生命周期中统一更新缓存和处理部分失败。

目标：

- 分别建立 create、update-meta、delete mutation。
- View 获得准确的 `isCreating`、`isUpdating`、`deletingId`。
- mutation error 标准化并展示。

### P1：Page Builder 命令与页面查询混在同一 hook

`usePageEditor` 同时管理：

- 索引和详情 Query。
- 草稿合并。
- 保存流程。
- 当前右侧面板。
- block 增删、显隐、移动和属性更新。
- 页面 Meta 与 SEO 更新。

目标拆分：

```text
usePageDocument(pageId)       页面详情、索引、保存和 dirty 会话
pageBlockCommands.ts          纯函数：add/remove/toggle/move/update
usePageBuilderSession()       activePanel、选中 block 等编辑器状态
```

Block 命令必须基于不可变输入返回新结果，并定义找不到 ID、边界移动、删除当前选中项等行为。

### P1：pages 与 page-builder 没有明确边界

代码证据：

- `PageBuilderEditor` 位于 `features/pages/ui`。
- 它直接导入五个 `@/admin/pageBuilder/*` 组件。
- pages feature 因此同时理解持久化、编辑器布局和旧组件内部能力。

目标：

```text
features/pages
  页面索引、页面详情、CRUD、Mapper、Schema

features/page-builder
  页面草稿会话、block commands、编辑器 Container/View
  过渡期封装 admin/pageBuilder 组件
```

`components/blocks` 继续作为预览渲染依赖，不纳入本轮重写。

### P1：索引类型不真实

代码证据：

- `PageIndexEntry extends CustomPage`，但索引实际上不应拥有完整 `CustomPage` 语义。
- `sanitizePageIndex` 使用 `(p as any).blockCount`。
- `PagesManager` 再次使用 `(page as any).blockCount`。
- `addPage` 使用 `newPage as unknown as CustomPage`。

影响：

- 类型系统无法区分索引与详情。
- UI 容易误以为索引中的 `blocks` 是真实详情。

目标类型：

```ts
type PageIndexEntry = {
  id: string;
  path: string;
  title: Translation;
  isFixed: boolean;
  type: PageType;
  blockCount: number;
}

type PageDocument = {
  ...完整页面详情
}
```

Mapper 负责 `PageDocument -> PageIndexEntry`，禁止通过空 `blocks` 冒充完整页面。

### P1：Schema 未参与 CRUD 和编辑提交

`customPageSchema` 和 `toPageFormValues` 已存在，但 controller 没有调用它们。`content` 和 block `content` 使用 `any`，path 也没有约束。

目标：

- 创建、复制、元数据更新和详情保存都经过 schema。
- 至少验证 path 格式、双语标题、页面类型、固定页面限制和 block 基础结构。
- block content 的具体 schema 仍可由 component registry 按 block type 管理，不要求在 pages schema 中一次性穷举。

### P2：UI 组件职责过多

`PagesManager` 同时包含搜索、分类、卡片、创建/编辑/复制弹窗和两套删除确认 UI。

推荐拆分：

```text
PagesManager
├─ PagesToolbar
├─ PageSection
│  └─ PageCard
├─ PageMetaDialog
└─ DeletePageDialog
```

拆分目标是隔离交互状态与页面展示，不应把持久化逻辑搬进子 View。

## 4. 目标职责与公开边界

### pages feature

对外提供：

- `PagesManager`
- 页面 Query options/hooks
- `PageIndexEntry`、`PageDocument` 等稳定领域类型
- 创建、复制、更新、删除页面的 use case
- 页面索引到内部链接选项的只读能力

### page-builder feature

对外提供：

- `PageBuilderEditor`
- Page Builder 草稿 controller
- Block command 纯函数

不应对外暴露：

- `pages.api.ts`
- 旧 `admin/pageBuilder` 组件路径
- KV key 细节

## 5. 分阶段改进顺序

### 第一阶段：修复存储一致性

1. 定义独立的 `PageIndexEntry` 与 `PageDocument`。
2. 建立 create/duplicate/save/delete 聚合 use case。
3. 明确双写顺序、失败结果和补偿策略。
4. 修复创建与复制未保存详情的问题。

### 第二阶段：建立页面草稿会话

1. 使用 reducer 或 RHF 管理页面详情草稿。
2. 增加 dirty、reset、远端更新冲突和离开确认。
3. 统一 Meta、SEO、blocks 的保存入口。
4. 将手写 async 操作改为 Mutation。

### 第三阶段：拆出 Page Builder

1. 提取 block command 纯函数。
2. 新建 `features/page-builder`。
3. 过渡期只封装旧 `admin/pageBuilder` 组件，不修改 `components/blocks`。
4. 收窄 pages 根导出，禁止外部依赖内部 API。

### 第四阶段：拆分列表 View

1. 拆 Toolbar、Section、Card 和 Dialog。
2. 为不同 mutation 展示准确 pending 状态。
3. 删除重复的行内确认与全屏确认方案，只保留一种。

## 6. 测试补充

当前 pages feature 没有专属测试，应优先覆盖：

- 创建页面同时写入详情与索引。
- 复制页面为所有 block 生成新 ID，且深层可变数据不会与源页面共享。
- 任一步写入失败时返回明确结果并执行约定补偿。
- 删除的部分失败场景。
- `PageDocument -> PageIndexEntry` 不携带 blocks，blockCount 正确。
- 脏草稿不被列表或详情 refetch 覆盖。
- 保存详情后同步更新列表元数据。
- block add/remove/toggle/move/update 的边界行为。
- 固定布局页面不能进入积木编辑流程。
- 非法 path、空标题和非法页面类型不会发出保存请求。

## 7. 完成标准

- 新建和复制页面后，`page:{id}` 与 `pages_index` 都存在且一致。
- 删除或保存发生部分失败时，用户能看到明确状态，系统有可执行恢复策略。
- 索引与详情使用不同类型，不再出现 `any` 或双重类型断言。
- Query refetch 不覆盖脏页面草稿。
- 页面 Meta 不会在详情与索引之间静默分叉。
- Block 命令可脱离 React 独立测试。
- pages 与 page-builder 通过公开入口交互。
- `components/blocks` 不因本轮架构拆分发生修改。
