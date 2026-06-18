# 客户评价模块改进指导

## 1. 审查结论

Reviews 的列表查询已进入 TanStack Query，列表 View 与表单 View 也做了初步拆分；但创建和更新目前存在两套并行流程：

```text
useReviewsManager 中的 create/update mutation
useReviewForm 中直接调用 createReview/updateReview
```

实际弹窗使用的是第二套，因此 manager 暴露的 `saveReview` 和 `isSaving` 没有进入当前 UI 主流程。表单仍直接使用 API DTO、手写校验和本地 `useState`，本质上是旧逻辑搬到 feature 目录。

本模块属于“列表 Query 已迁移，表单业务边界尚未建立”。

## 2. 当前实现与数据流

列表：

```text
ReviewsManager
  -> useReviewsManager
     -> getReviews(filters)
     -> delete/update mutation
  -> ReviewsListView
```

表单：

```text
ReviewsManager
  -> ReviewFormDialog
     -> useReviewForm
        -> useState<ReviewInput>
        -> 手写 validate
        -> createReview/updateReview
        -> document.body scroll lock
     -> ReviewFormView
        -> DTO 字段
        -> 旧 ImageInput
```

保存成功后，`ReviewsManager.handleDialogSaved` 再手动失效列表 Query。

## 3. 具体问题

### P0：创建和更新 Mutation 重复

代码证据：

- `useReviewsManager` 创建 `createMutation`、`updateMutation`，并暴露 `saveReview`。
- `useReviewForm` 直接导入并调用 `createReview`、`updateReview`。
- `ReviewsManager` 没有从 manager 传入 save 命令，只在 dialog saved 后再次 invalidate。

影响：

- mutation pending、error、缓存失效规则有两个来源。
- 未来加入 optimistic update、错误映射或埋点时必须改两处。
- manager 中存在实际未被主流程使用的能力，容易让维护者误判架构。

目标：

- 只保留一套 create/update mutation。
- 推荐由 `useReviewEditor` 拥有表单和 mutation；保存成功后由该 controller 精确失效列表。
- `ReviewsManager` 只管理当前编辑 ID/弹窗开关和列表 controller，不再手动重复 invalidate。

### P0：表单直接使用 API DTO

代码证据：

- `useReviewForm` 的 state 类型是 `ReviewInput`。
- `ReviewFormView` 直接消费 `client_name`、`media_type`、`review_text_zh` 等字段。

影响：

- UI 与后端 snake_case 字段绑定。
- 中英文评价无法表达为统一的 `Translation`。
- API 字段调整会穿透 controller 和整个 View。

目标表单模型示例：

```ts
type ReviewFormValues = {
  clientName: string;
  country: string;
  rating: number;
  media: {
    type: 'video' | 'image';
    url: string;
  };
  content: Translation;
  sortOrder: number;
  status: 'published' | 'draft';
}
```

Mapper 提供：

```ts
toReviewForm(review)
toCreateReviewInput(form)
toUpdateReviewInput(form)
```

DTO 字段只允许出现在 API 和 Mapper。

### P0：表单没有 Schema、字段级错误和 dirty 保护

当前 `validate()` 只返回第一条字符串错误，并在 controller 顶部展示：

- 没有字段级错误。
- rating、sortOrder、status 等约束不完整。
- 切换媒体类型时旧 URL 的处理未定义。
- 关闭弹窗会直接丢弃草稿。

目标：

- 使用 RHF + `reviewSchema`。
- Schema 校验客户名、评分范围、媒体类型、媒体 URL、双语正文和排序值。
- 保存只通过 `handleSubmit`。
- 关闭、点击遮罩或按 Escape 前检查 `isDirty`。
- 创建与编辑成功后使用明确基线 reset。

### P1：Dialog 行为进入 model

代码证据：

- `useReviewForm` 在 effect 中修改 `document.body.style.overflow`。
- hook 同时接收 `onClose`，保存成功后主动关闭。

影响：

- 表单 controller 依赖具体弹窗载体。
- 改成抽屉或独立页面时需要修改业务 hook。
- 多层 Dialog 同时存在时，直接恢复空字符串可能破坏其他 scroll lock。

目标：

- scroll lock 由 Dialog 组件或通用 overlay 基础设施管理。
- controller 只返回保存结果。
- Container 根据结果决定关闭、导航或继续编辑。

### P1：删除确认和缓存失效散落在 Container

`ReviewsManager` 直接调用全局 `confirm`，同时自己持有 `QueryClient` 和 `reviewKeys`。

目标：

- manager controller 暴露删除 mutation 和结构化删除目标。
- Container/View 负责确认 Dialog。
- mutation 自己负责缓存失效。
- UI 层不直接理解 Query key。

### P1：筛选类型被弱化为 `Record<string, unknown>`

代码证据：

- API 内部 `ReviewsQuery` 没有导出。
- manager 构造 `Record<string, unknown>`。
- `reviewKeys.list` 也接收任意 Record。

影响：

- `status`、page、pageSize 和 search 的类型无法在 Query key 与 API 之间保持一致。
- 任意不可序列化值都可能进入 key。

目标：

```ts
type ReviewListFilters = {
  page: number;
  pageSize: number;
  search?: string;
  status?: 'published' | 'draft';
}
```

- API、Query key 和 list controller 共用该类型。
- 规范化空 search 和 `all`，保证相同语义产生相同 key。

### P1：搜索防抖属于可复用的列表状态，但当前生命周期不完整

当前 effect 会在 400ms 后更新搜索并重置 page。需要补充明确行为：

- search 变化时是否立即显示旧页结果。
- filter 变化时是否保留上一页数据。
- 输入清空时 0ms 更新是否符合预期。
- URL 是否需要保存筛选和页码。

建议：

- 列表 controller 使用强类型 filters。
- 可使用 `useDeferredValue` 或统一 debounce hook。
- 若后台列表需要刷新后保留条件，将 page/search/status 同步到 URL；否则至少保持在 controller 内，不散入 View。

### P1：表单初始值只在首次挂载时创建

`useState` 的初始化函数只执行一次。当前 Dialog 由条件渲染，通常会重新挂载，因此暂时可工作；但一旦改为常驻 Dialog、在弹窗内切换评价或复用表单组件，就会出现旧评价数据残留。

RHF 迁移后应明确：

- review ID 变化且表单不脏时 reset。
- review ID 变化且表单脏时先确认。
- 创建模式使用 defaults，不依赖上一次编辑状态。

### P1：错误和 pending 状态不完整

- 列表 Query error 未暴露给 View。
- 删除和状态切换没有按项 pending 状态。
- mutation 失败可能形成未处理 Promise。
- 表单 catch 使用 `any`，没有统一 `AppError`。

目标：

- list controller 暴露 `queryError`。
- 每条评价可判断 `isDeleting`、`isTogglingStatus`。
- 所有 action 对错误有统一落点。
- field error、form error 和 query error 分开显示。

### P2：YouTube 解析与展示文案耦合

`extractYoutubeId` 是适合保留的纯函数，但应从 hook 文件中移出并补测试。

还需明确：

- 是否支持 `youtube-nocookie.com`。
- 是否允许带额外路径或参数。
- 非 YouTube 视频是否明确不支持。
- thumbnail URL 生成是 domain 规则还是 ViewModel 派生。

建议建立 `reviewMedia.ts`，提供解析结果而不是只返回字符串或 null。

### P2：View 文件过大且继续依赖旧媒体组件

建议拆分：

```text
ReviewFormView
├─ ReviewIdentitySection
├─ ReviewRatingSection
├─ ReviewMediaSection
└─ ReviewContentSection

ReviewsListView
├─ ReviewsToolbar
├─ ReviewsTable / ReviewCard
└─ ReviewsPagination
```

拆分后各 section 只使用 RHF context 或明确字段 props，不调用 API。

图片选择可继续通过兼容 wrapper 使用旧 `ImageInput`，但不应在 review feature 中实现上传和查重。

## 4. 目标职责边界

```text
useReviewsList
  filters + list Query + delete/status mutation

useReviewEditor
  detail/form defaults + schema + mapper + create/update mutation + dirty

ReviewsManager
  组合列表和编辑载体

ReviewFormView / ReviewsListView
  只接收 ViewModel、字段对象和事件
```

建议目录：

```text
reviews/
├─ api/
│  ├─ reviews.api.ts
│  └─ reviews.keys.ts
├─ model/
│  ├─ review.types.ts
│  ├─ review.schema.ts
│  ├─ review.defaults.ts
│  ├─ review.mapper.ts
│  ├─ reviewMedia.ts
│  ├─ useReviewsList.ts
│  └─ useReviewEditor.ts
└─ ui/
   ├─ ReviewsManager.tsx
   ├─ ReviewsListView.tsx
   ├─ ReviewFormDialog.tsx
   └─ sections/
```

## 5. 分阶段改进顺序

### 第一阶段：统一 mutation 所有权

1. 删除重复的 create/update 路径。
2. 保存成功后的缓存失效只保留一处。
3. 删除与状态切换也由 list controller 管理。
4. UI 不再直接持有 QueryClient 或 Query key。

### 第二阶段：建立表单模型

1. 增加 defaults、schema 和 mapper。
2. 使用 camelCase + `Translation` 的表单模型。
3. 使用 RHF 管理字段、错误和 dirty。
4. 抽出并测试 YouTube 解析。

### 第三阶段：分离 Dialog 与业务

1. 移除 model 中的 body scroll lock 和主动关闭。
2. Container 处理确认、关闭和 overlay 行为。
3. 增加脏表单关闭保护。
4. 补充 query/mutation 错误和按项 pending。

### 第四阶段：拆分 View

1. 表单按基本信息、评分、媒体和正文拆 section。
2. 列表按 Toolbar、列表主体和 Pagination 拆分。
3. 双语正文接入 `shared/forms`。
4. 图片字段通过 shared/media 稳定入口接入。

## 6. 测试补充

当前 reviews feature 没有专属测试，应覆盖：

- Review DTO 与表单模型双向转换。
- Schema 的必填、评分范围、媒体类型和双语正文规则。
- YouTube 各类支持 URL 与非法 URL。
- 创建和更新只走一套 mutation。
- 保存成功只失效 reviews list，不重复失效。
- 保存失败保留表单和 dirty 状态。
- 关闭脏表单需要确认。
- 列表 filters 与 Query key 一致，搜索/状态变化重置页码。
- 删除和状态切换的 pending、失败及缓存更新。
- 编辑记录切换时不会残留上一条表单数据。

## 7. 开发阶段测试脚本

本模块改进时应持续运行以下测试：

- `src/features/reviews/api/reviews.api.test.ts`：筛选参数、Query key 和 CRUD 请求。
- `src/features/reviews/model/review.mapper.test.ts`：DTO/Form 转换与默认值。
- `src/features/reviews/model/review.schema.test.ts`：客户、评分、媒体、双语正文和排序约束。
- `src/features/reviews/model/reviewMedia.test.ts`：YouTube URL 和缩略图解析。
- `src/features/reviews/model/useReviewEditor.test.tsx`：创建、编辑、校验、reset、错误和缓存失效。
- `src/features/reviews/model/useReviewsList.test.tsx`：列表 Query、搜索防抖、筛选、分页、删除和状态切换。

模块内快速验证：

```bash
npm test -- --run src/features/reviews
```

开发约束：

- DTO 字段、Schema 或媒体规则变化时，先调整纯函数测试。
- 表单或列表 UI 重构不得删除 controller 测试；UI 只需补关键交互测试。
- dirty 关闭保护和按项 pending 落地时，应在 hook/Container 层增加回归测试。

## 8. 完成标准

- View 中不出现 `client_name`、`review_text_zh` 等 API DTO 字段。
- 创建和更新只有一套 mutation。
- 表单校验、YouTube 解析和 DTO 转换可独立测试。
- model 不操作 `document`、Dialog 或 body scroll lock。
- UI 不直接持有 QueryClient 和 Query key。
- 关闭或切换评价不会静默丢弃脏草稿。
- 替换弹窗为抽屉或独立页面时，不修改 Schema、Mapper 和 mutation。
