# Page Builder 独立模块重构设计

## 1. 背景

`adminApp` 的页面查询、页面保存能力已经迁移到 `features/pages`，但 Page Builder 的主要 UI 仍位于 `src/admin/pageBuilder`。当前实现已经初步把页面查询和保存编排放入 `usePageEditor`，但积木领域规则、编辑会话状态和具体视觉组件仍没有形成稳定边界。

当前主要结构如下：

```text
features/pages/
├─ api/                         页面索引、详情与保存请求
├─ model/usePageEditor.ts       页面草稿、选区、积木命令与保存流程
└─ ui/PageBuilderEditor.tsx     编辑器布局与状态展示

admin/pageBuilder/
├─ AddBlockDialog.tsx           Block 创建、ID 生成、单例判断与弹窗 UI
├─ BlockList.tsx                积木列表 UI
├─ BlockItem.tsx                积木操作 UI
├─ BlockPropsEditor.tsx         类型分发与属性面板 UI
├─ PageSettingsEditor.tsx
├─ SEOEditor.tsx
└─ propsEditors/                21 类积木的属性编辑器
```

这种结构存在两个问题：

1. `features/pages` 同时承担页面持久化与 Page Builder 编辑会话，领域边界偏宽。
2. Block 创建、默认值、单例限制、排序和属性编辑规则分散在 Hook、Dialog 与各类 UI 文件中。

当后续需要把当前左右双栏编辑器替换为三栏预览、抽屉式编辑器或其他视觉风格时，仍可能修改草稿、命令和保存逻辑。

## 2. 重构目标

本次重构建立独立的 `features/page-builder` 业务域，使 Page Builder 的业务能力不依赖当前视觉实现。

完成后应具备以下能力：

- 替换编辑器整体布局时，不修改页面查询、草稿、Block 命令和保存流程。
- 替换积木选择弹窗时，不修改 Block 创建、默认值和单例规则。
- 替换属性面板控件时，不修改 Block 内容更新命令。
- 页面持久化规则继续由 `features/pages` 独立负责。
- Page Builder 可通过纯函数和 Controller 独立测试。
- 现有 `src/components/blocks` 前台积木渲染组件保持不变。

## 3. 范围

### 3.1 纳入范围

- Page Builder 编辑会话与脏状态。
- 页面元数据、SEO 和 Block 草稿编辑。
- Block 创建、添加、删除、显隐、移动和内容更新命令。
- 组件目录、默认属性、分类与 singleton 规则。
- 当前 Page Builder Container、View、列表、选择器和属性面板。
- 21 类 Block 属性编辑器的迁移边界与统一输入契约。
- 保存、错误、离开确认和服务端刷新保护。
- Page Builder 领域纯函数、Controller 与关键交互测试。

### 3.2 明确排除

- 修改 `src/components/blocks` 内的前台渲染实现。
- 重做当前后台视觉设计。
- 建设完整低代码平台或运行时 Schema 表单引擎。
- 修改后端页面 API 或 KV 存储协议。
- 一次性为所有 Block content 建立完美的强类型与完整 Zod Schema。
- 在本次迁移中加入实时协同编辑、历史版本或撤销重做。

## 4. 现状诊断

### 4.1 `usePageEditor` 职责过宽

`src/features/pages/model/usePageEditor.ts` 当前同时负责：

- 页面详情 Query。
- 页面索引与详情数据合并。
- 本地页面草稿。
- 脏状态保护。
- 当前活动面板。
- 保存状态和反馈计时。
- Block 添加、删除、显隐、移动和属性更新。
- 页面元数据和 SEO 更新。
- Query 缓存写入与失效。

其中页面查询与保存属于 `pages`，而草稿、选区和 Block 命令属于 `page-builder`。两者继续合并会使未来任何编辑器交互变化都影响页面数据 feature。

### 4.2 `AddBlockDialog` 包含领域规则

`AddBlockDialog` 当前直接：

- 读取 `componentRegistry`。
- 使用 `nanoid` 生成 Block ID。
- 从 `defaultProps` 创建 Block。
- 调用 `canAddBlock` 判断 singleton。
- 决定创建后关闭弹窗。

ID 生成、默认值复制和 singleton 限制不是弹窗视觉职责。若未来改为命令面板、拖入画布或快捷添加，这些规则会被重复实现。

### 4.3 Block 命令直接嵌入 React 状态更新

删除、显隐、移动和内容更新均直接写在 Hook 的 `setLocalPage` 回调中。它们缺少独立返回结果，边界情况通常直接返回：

- Block ID 不存在。
- 移动目标越界。
- singleton 冲突。
- 创建类型不存在。

这些场景应由可测试的纯命令显式表达，Controller 再决定如何转成用户反馈。

### 4.4 属性编辑分发依赖具体 UI

`BlockPropsEditor` 使用大型 `switch` 直接导入 21 个属性编辑器。属性面板注册、类型与视觉实现被绑在同一文件中，并广泛使用 `any`。

第一阶段不要求一次解决所有 Block content 类型问题，但必须先建立统一属性编辑器契约，使属性面板可以被替换或逐类强化，而不影响 Controller。

### 4.5 页面编辑器 View 仍理解过多内部状态

`PageBuilderEditor` 当前理解：

- `__settings__` 和 `__seo__` 特殊字符串。
- 如何从 `activePanel` 查找 selected Block。
- 固定布局页面是否可编辑。
- 保存成功、错误和加载状态的来源。
- 何时调用每个底层 Handler。

这些派生规则应由 Controller 转成明确的 ViewModel。View 只负责显示状态并发送用户意图。

## 5. 方案选择

### 5.1 方案一：继续保留在 `features/pages`

只拆分 `usePageEditor` 和 UI 子组件，不建立新 feature。

优点：

- 移动文件较少。
- 页面查询与编辑器代码距离较近。

缺点：

- `pages` 同时理解持久化和编辑器交互。
- 未来存在第二套 Page Builder UI 时边界仍不清晰。
- Block 规则容易继续依附页面 CRUD。

不采用。

### 5.2 方案二：独立 `features/page-builder`

`pages` 负责页面事实与持久化，`page-builder` 负责编辑会话、Block 领域规则和可替换 UI。

优点：

- 变化来源清晰。
- Page Builder 可独立测试和替换视觉实现。
- 页面 API 与编辑器交互互不反向依赖。
- 适合渐进迁移当前 21 个属性编辑器。

缺点：

- 需要建立两个 feature 之间的公开接口。
- 迁移期间存在短期兼容层。

采用该方案。

### 5.3 方案三：配置驱动的通用低代码平台

将 Block Schema、表单字段和属性面板全部配置化。

优点：

- 简单 Block 可快速生成属性表单。

缺点：

- 当前 Block 属性结构差异较大。
- 图片、链接、嵌套列表等交互需要大量逃生接口。
- 明显超出本次 UI 与业务解耦目标。

不采用。

## 6. 业务边界与依赖方向

### 6.1 Feature 职责

```text
features/pages
├─ 页面索引 Query
├─ 页面详情 Query
├─ 页面 CRUD Mutation
├─ API DTO 与领域页面 Mapper
└─ 页面缓存更新与失效

features/page-builder
├─ Page Builder 编辑草稿
├─ 编辑基线与脏状态
├─ Block Catalog
├─ Block 创建与编排命令
├─ 当前面板和选区
├─ 属性编辑器契约
├─ 保存用例编排
└─ 可替换的编辑器 View

components/blocks
└─ 前台页面 Block 渲染
```

### 6.2 固定依赖方向

```text
PageBuilder 路由
  ↓
page-builder Container
  ↓
page-builder Controller / Commands
  ↓
pages 公开查询与保存能力
  ↓
shared API Client

page-builder View
  ↑
ViewModel + Actions
```

硬性规则：

- `features/page-builder` 只能通过 `features/pages/index.ts` 使用页面能力。
- `features/pages` 不得导入 `features/page-builder`。
- `page-builder/model` 不得导入 shadcn、Tailwind 组件或具体属性编辑器。
- `page-builder/ui` 不得导入底层 API client。
- 其他 feature 不得导入 `page-builder` 的内部目录。
- `src/components/blocks` 不得反向依赖后台 Page Builder。

## 7. 推荐目录

```text
src/features/page-builder/
├─ model/
│  ├─ pageBuilder.types.ts
│  ├─ pageBuilder.defaults.ts
│  ├─ blockCatalog.ts
│  ├─ blockCommands.ts
│  ├─ blockCommands.test.ts
│  ├─ pageBuilder.reducer.ts
│  ├─ pageBuilder.reducer.test.ts
│  ├─ pageBuilder.mapper.ts
│  ├─ pageBuilder.mapper.test.ts
│  ├─ usePageBuilderController.ts
│  └─ usePageBuilderController.test.tsx
├─ ui/
│  ├─ PageBuilderContainer.tsx
│  ├─ PageBuilderView.tsx
│  ├─ block-list/
│  │  ├─ BlockList.tsx
│  │  └─ BlockItem.tsx
│  ├─ block-picker/
│  │  ├─ AddBlockDialog.tsx
│  │  └─ BlockThumbnail.tsx
│  ├─ property-panel/
│  │  ├─ BlockPropertyPanel.tsx
│  │  ├─ propertyEditorRegistry.ts
│  │  └─ editors/
│  ├─ page-settings/
│  │  └─ PageSettingsEditor.tsx
│  └─ seo-settings/
│     └─ SEOEditor.tsx
└─ index.ts
```

目录按职责划分，而不是为了缩短文件机械拆分：

- `model` 保存无视觉依赖的类型、纯函数、Reducer 和 Controller。
- `ui` 保存当前视觉实现。
- 属性编辑器保留按 Block 类型拆分，不建设万能属性表单。
- `index.ts` 只暴露路由需要的 Container 和确有跨 feature 用途的稳定类型。

## 8. Page Builder 领域模型

### 8.1 编辑草稿

```ts
export interface PageBuilderDraft {
  id: string;
  path: string;
  title: Translation;
  isFixed: boolean;
  type?: CustomPage['type'];
  content?: unknown;
  blocks: PageBlock[];
  seo: PageSeo;
}
```

Page Builder 使用自己的草稿类型，避免 UI 直接依赖 API DTO。`pageBuilder.mapper.ts` 负责在 `pages` 公开的页面模型与草稿之间转换：

```ts
toPageBuilderDraft(page: CustomPage): PageBuilderDraft
toSavablePage(draft: PageBuilderDraft): CustomPage
```

Mapper 必须：

- 为缺失 SEO 提供稳定默认值。
- 对数组和可变嵌套值进行必要复制。
- 保留当前后端可识别的页面字段。
- 不包含 React 状态或 UI 文案。

### 8.2 面板类型

不得继续用 `__settings__` 和 `__seo__` 魔法字符串表达不同面板：

```ts
export type PageBuilderPanel =
  | { type: 'page-settings' }
  | { type: 'seo-settings' }
  | { type: 'block'; blockId: string };
```

这样可以避免 Block ID 与特殊字符串冲突，也方便未来增加预览设置等新面板。

### 8.3 编辑状态

```ts
export interface PageBuilderState {
  draft: PageBuilderDraft;
  baseline: PageBuilderDraft;
  selectedPanel: PageBuilderPanel | null;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  error: string | null;
}
```

脏状态由 `draft` 与 `baseline` 的领域比较结果或 Reducer 维护的 revision 判定，不由 View 自行设置。

保存成功后，服务端返回页面同时成为新 `draft` 与 `baseline`。保存失败时保留当前 `draft`。

## 9. Block Catalog

当前 `componentRegistry` 同时服务后台目录展示与其他预览页面。迁移后将 Page Builder 所需元数据集中为无 React 依赖的 Catalog：

```ts
export interface BlockCatalogItem {
  type: BlockType;
  name: Translation;
  description: Translation;
  category: ComponentCategory;
  icon: string;
  singleton: boolean;
  hasGlobalData: boolean;
  createDefaultContent(): unknown;
}
```

规则：

- `createDefaultContent()` 每次返回独立值，禁止不同 Block 共享嵌套对象引用。
- Catalog 不导入属性编辑器 React 组件。
- 属性编辑器注册放在 `ui/property-panel/propertyEditorRegistry.ts`。
- 缩略图属于当前 UI，可以依据 Block type 渲染，但不进入领域 Catalog。
- 未知 Block type 必须产生明确错误状态，不能静默创建空 Block。

迁移期间可以从现有 `componentRegistry` 生成 Catalog，但最终 Block 创建规则只能有一个权威来源。

## 10. Block 纯命令

Block 修改必须通过无 React 依赖的纯函数完成：

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

统一结果：

```ts
export type CommandResult<T> =
  | { ok: true; value: T }
  | {
      ok: false;
      error:
        | 'UNKNOWN_BLOCK_TYPE'
        | 'BLOCK_NOT_FOUND'
        | 'DUPLICATE_SINGLETON'
        | 'INVALID_TARGET_INDEX';
    };
```

命令规则：

- 不直接修改输入对象。
- `createBlock` 注入 ID 生成器，测试不依赖随机值。
- `addBlock` 必须检查 singleton。
- `moveBlock` 接收目标索引，按钮上下移动和拖拽排序统一使用同一命令。
- 删除当前选中 Block 后，由 Reducer 清理选区。
- 更新 Block content 时替换目标 Block，不改变其他 Block 引用。
- 无变化操作不得错误地把草稿标记为已修改。

## 11. Reducer 与编辑会话

Reducer 负责将用户意图转换为领域命令，并保持草稿、基线、选区和错误一致：

```ts
type PageBuilderAction =
  | { type: 'select-panel'; panel: PageBuilderPanel | null }
  | { type: 'add-block'; blockType: BlockType }
  | { type: 'remove-block'; blockId: string }
  | { type: 'move-block'; blockId: string; targetIndex: number }
  | { type: 'toggle-block'; blockId: string }
  | { type: 'update-block'; blockId: string; content: unknown }
  | { type: 'update-meta'; changes: PageMetaChanges }
  | { type: 'update-seo'; seo: PageSeo }
  | { type: 'save-started' }
  | { type: 'save-succeeded'; page: PageBuilderDraft }
  | { type: 'save-failed'; message: string }
  | { type: 'replace-from-server'; page: PageBuilderDraft };
```

Reducer 不执行 Query、Mutation、计时器或浏览器确认。副作用由 Controller 编排。

## 12. Controller 契约

`usePageBuilderController(pageId)` 负责：

- 通过 `pages` 公开能力读取页面。
- 将页面转换为 Page Builder 草稿。
- 初始化和维护 Reducer。
- 防止后台 refetch 覆盖脏草稿。
- 暴露 ViewModel 与 Actions。
- 调用页面保存 Mutation。
- 保存成功后重置基线。
- 将领域命令错误转换为可展示信息。
- 注册离开页面的脏数据确认。

Controller 不渲染 JSX，也不决定 Tailwind 类名、侧栏宽度、按钮位置或弹窗形式。

## 13. ViewModel 与 Actions

### 13.1 ViewModel

```ts
export interface PageBuilderViewModel {
  page: PageBuilderDraft;
  selectedPanel: PageBuilderPanel | null;
  selectedBlock?: PageBlock;
  availableBlocks: Array<
    BlockCatalogItem & {
      canAdd: boolean;
      disabledReason?: 'singleton-exists';
    }
  >;
  isFixedLayout: boolean;
  isDirty: boolean;
  canSave: boolean;
  isSaving: boolean;
  saveStatus: 'idle' | 'saved' | 'error';
  error: string | null;
}
```

### 13.2 Actions

```ts
export interface PageBuilderActions {
  selectPanel(panel: PageBuilderPanel | null): void;
  addBlock(type: BlockType): void;
  removeBlock(blockId: string): void;
  moveBlock(blockId: string, targetIndex: number): void;
  toggleBlock(blockId: string): void;
  updateBlock(blockId: string, content: unknown): void;
  updateMeta(changes: PageMetaChanges): void;
  updateSeo(seo: PageSeo): void;
  save(): Promise<void>;
}
```

View 只消费这两个对象。未来可以提供不同 View：

- 当前左右双栏 View。
- 三栏实时预览 View。
- 抽屉式属性编辑 View。
- 移动端简化管理 View。

这些 View 不得复制 Block 命令或页面保存流程。

## 14. Container 与 View 分离

`PageBuilderContainer` 负责路由参数、Controller 和导航适配：

```text
PageBuilderContainer
├─ 读取 pageId
├─ 调用 usePageBuilderController
├─ 处理 loading/not-found/fixed-layout
└─ 将 ViewModel 与 Actions 传入 PageBuilderView
```

`PageBuilderView` 负责当前布局：

```text
PageBuilderView
├─ BlockList
├─ AddBlockDialog
├─ PageSettingsEditor
├─ SEOEditor
└─ BlockPropertyPanel
```

View 可以维护纯视觉瞬时状态，例如“添加弹窗是否打开”和“当前目录 Tab”，但不得维护页面草稿副本。

## 15. 属性编辑器迁移

### 15.1 第一阶段统一契约

21 个属性编辑器先统一到最小契约：

```ts
export interface BlockPropertyEditorProps<T> {
  value: T;
  onChange(value: T): void;
  disabled?: boolean;
  errors?: Record<string, string>;
}
```

第一阶段允许部分 `T` 暂时为 `unknown` 或现有属性类型，不强制一次消除全部 `any`。但 UI 不得：

- 直接修改 Page Builder Draft。
- 直接调用页面保存 API。
- 自行生成 Block ID。
- 自行判断 singleton。
- 导入 `usePageBuilderController`。

### 15.2 属性编辑器注册

React 组件注册只存在于 UI 层：

```ts
type PropertyEditorComponent =
  React.ComponentType<BlockPropertyEditorProps<unknown>>;

const propertyEditorRegistry: Partial<
  Record<BlockType, PropertyEditorComponent>
>;
```

`BlockPropertyPanel` 根据 selected Block 读取对应编辑器，并把 `value/onChange` 连接到 Actions。

未知或尚无编辑器的类型显示明确空状态，不影响其他 Block 编辑。

### 15.3 后续强类型增强

迁移完成后再按风险逐类引入：

- Block content 类型映射。
- Zod Schema。
- 字段级错误。
- 内容默认值版本迁移。

强类型增强不作为独立 feature 迁移完成的前置条件。

## 16. 页面设置与 SEO

页面设置和 SEO 继续作为 Page Builder 的编辑面板，但不拥有保存流程。

规则：

- `PageSettingsEditor` 只接收值、只读状态、错误和 `onChange`。
- 固定页面的 path 是否可编辑由 ViewModel 决定，而不是输入框内部猜测。
- `SEOEditor` 不自行补默认值；默认值由 Mapper 提供。
- SEO 的字段结构属于 Page Builder 草稿模型，不泄漏后端 DTO 字段命名。
- 页面级校验结果通过 ViewModel 或面板 props 显示。

## 17. 数据加载、刷新与保存

### 17.1 初始化

```text
pages detail Query
  ↓
toPageBuilderDraft
  ↓
初始化 draft 与 baseline
  ↓
PageBuilderViewModel
```

页面索引与详情合并规则应继续由 `pages` feature 提供。Page Builder 不重新理解 KV 的 `pages_index` 与 `page:{id}` 分片协议。

### 17.2 后台刷新

- 草稿未修改时，新的服务端页面可以替换 `draft` 与 `baseline`。
- 草稿已修改时，后台 refetch 只更新 Query 缓存，不覆盖编辑会话。
- 切换 `pageId` 前必须触发脏数据确认。
- 不使用无条件 `useEffect` 把 Query 数据复制到本地状态。

### 17.3 保存

```text
actions.save()
  ↓
校验当前草稿
  ↓
toSavablePage
  ↓
pages save mutation
  ↓
pages 更新详情缓存并失效页面列表
  ↓
服务端结果转换为新 draft/baseline
```

保存成功后：

- `isDirty` 变为 false。
- 保留当前有效选区。
- `saveStatus` 短暂显示为 `saved`，反馈计时由 Controller 管理。

保存失败后：

- 保留草稿。
- `isDirty` 保持 true。
- 显示可重试错误。
- 不清空当前面板。

## 18. 错误处理

错误分为三类：

### 18.1 加载与保存错误

由 `pages` 的 `AppError` 转换为 Page Builder 可展示消息。View 不读取 HTTP 状态或响应 DTO。

### 18.2 领域命令错误

Block 不存在、目标索引越界、未知类型和 singleton 冲突必须返回 `CommandResult`。Controller 决定显示行内错误或短提示。

### 18.3 属性校验错误

属性编辑器通过 `errors` 接收字段级错误。尚未建立 Schema 的 Block 可以只做现有最小校验，但不得在保存时静默丢弃数据。

## 19. 离开确认

Page Builder 应提供统一的脏草稿保护：

- 浏览器刷新或关闭页面时使用 `beforeunload`。
- 应用内返回页面列表或切换页面时使用路由阻止能力。
- 没有脏数据时不弹确认。
- 保存成功后立即解除阻止。
- 确认逻辑位于 Controller 或独立 Hook，不写入具体返回按钮。

## 20. 测试策略

### 20.1 纯函数测试

必须覆盖：

- 默认内容每次创建互不共享引用。
- ID 生成器被正确调用。
- singleton Block 不可重复添加。
- 普通 Block 可以重复添加。
- 删除存在和不存在的 Block。
- 移动到首位、末位及越界位置。
- 显隐切换。
- 只更新目标 Block 内容。
- 页面 Meta 与 SEO 更新。
- Mapper 补充 SEO 默认值并保留页面字段。

### 20.2 Reducer 测试

必须覆盖：

- 有效命令更新草稿并产生脏状态。
- 无效命令不修改草稿。
- 删除当前选中 Block 后清理选区。
- 保存开始、成功和失败状态。
- 保存成功后重置 baseline。
- 脏草稿不被服务端刷新替换。
- 未修改草稿可以接受服务端刷新。

### 20.3 Controller 测试

使用现有 Query 测试底座覆盖：

- 页面加载成功与失败。
- Query 页面初始化草稿。
- 保存调用 `pages` 公开 Mutation。
- 保存成功后的缓存与基线状态。
- 保存失败时保留草稿。
- saved 反馈计时。
- 固定布局页面状态。
- 路由切换和 `beforeunload` 脏数据保护。

### 20.4 View 交互测试

覆盖主流程：

- 打开 Block Picker。
- singleton 类型显示禁用原因。
- 添加 Block 后自动选中。
- 修改属性后显示可保存状态。
- 上移、下移或拖拽调用统一 targetIndex Action。
- 隐藏、删除并保存。
- 页面设置和 SEO 面板切换。

View 测试使用伪造 ViewModel 与 Actions，不启动真实页面 API，以证明 UI 与业务编排已经分离。

### 20.5 回归约束

- 现有 pages API、Mapper 和列表测试继续通过。
- `src/components/blocks` 不产生变更。
- 当前 `/pages` 与 Page Builder 路由保持不变。
- 当前视觉和主要交互保持不变。

## 21. 迁移批次

### 第一批：领域核心

- 建立 `features/page-builder/model`。
- 定义草稿、面板、ViewModel 和 Actions 类型。
- 建立 Block Catalog。
- 提取 Block 纯命令及测试。
- 建立 Mapper 与 Reducer。

完成标准：不依赖 React UI 即可完成所有 Page Builder 草稿操作。

### 第二批：Controller 与 pages 集成

- 在 `features/pages/index.ts` 暴露页面详情与保存所需的稳定能力。
- 建立 `usePageBuilderController`。
- 将现有 `usePageEditor` 的编辑会话与 Block 命令迁出。
- 接入保存、缓存、脏状态保护和错误处理。

完成标准：Controller 可在测试中完成加载、修改和保存，不渲染当前 Page Builder UI。

### 第三批：当前 UI 迁移

- 建立 `PageBuilderContainer` 与 `PageBuilderView`。
- 移动 Block List、Item、Picker、Thumbnail、页面设置与 SEO UI。
- 将当前视觉实现连接到 ViewModel 与 Actions。
- 保持路由和视觉行为稳定。

完成标准：当前 UI 不直接调用 pages API、Query 或底层 Controller 内部状态。

### 第四批：属性编辑器与清理

- 建立属性编辑器统一契约和 UI 注册表。
- 分批移动 21 个属性编辑器。
- 移除大型 `switch`。
- 删除 `src/admin/pageBuilder` 兼容导出与无引用文件。
- 更新导航文档和架构说明。

完成标准：`src/admin/pageBuilder` 不再承载 Page Builder 实现，独立 feature 可完整构建和测试。

## 22. 兼容策略

迁移期间允许短期兼容导出：

```ts
// 旧路径仅转发，不承载新逻辑
export { BlockList } from '@/features/page-builder';
```

兼容层规则：

- 不新增逻辑。
- 不反向导入旧实现。
- 每个兼容导出必须在第四批删除。
- 路由应尽早切换到 `features/page-builder` 公共入口。

## 23. 强制架构规则

```text
pages                    不得依赖 page-builder
page-builder/model       不得依赖 React UI 组件
page-builder/ui          不得调用底层 API client
属性编辑器                不得维护页面草稿副本
Block Picker             不得生成 ID 或复制默认值
Block List               不得实现排序规则
路由组件                  不得直接保存页面
components/blocks        不得依赖后台编辑器
```

审查警戒线：

- View 中出现 Query key、API DTO 或缓存失效时必须移出。
- Dialog 中出现 singleton、默认值或 ID 生成时必须移出。
- 新增 Block 类型需要同时声明 Catalog 与属性编辑器支持状态。
- 同一 Block content 默认值不得存在两个权威来源。
- 不通过大量可选 props 创建万能 Page Builder 组件。

## 24. 验收指标

重构完成后必须满足：

- `features/page-builder` 独立存在并通过 `index.ts` 暴露稳定入口。
- `features/pages` 只负责页面事实、CRUD 与持久化。
- 当前 Page Builder UI 仅消费 ViewModel 与 Actions。
- 更换编辑器布局无需修改 Block 命令和页面保存。
- 更换 Block Picker 无需修改创建与 singleton 规则。
- Block 命令全部可作为纯函数测试。
- 保存失败不会丢失草稿。
- 后台 refetch 不会覆盖脏草稿。
- 离开页面时存在统一脏数据确认。
- 21 个属性编辑器不直接访问页面 API 或编辑会话内部状态。
- `src/admin/pageBuilder` 最终删除或为空兼容层后删除。
- `src/components/blocks` 在迁移中零修改。
- `/pages` 与 Page Builder 路由、当前视觉和用户主流程保持稳定。

## 25. 非目标与后续方向

以下能力可以在本次迁移稳定后另立设计：

- 撤销与重做。
- 实时页面预览。
- Block content 完整强类型映射。
- 每类 Block 的 Zod Schema。
- Block 配置版本迁移。
- 草稿自动保存。
- 历史版本与发布审批。

这些方向应建立在本设计的纯命令、Reducer、Controller 和可替换 View 边界上，而不是重新把业务逻辑塞回 UI。
