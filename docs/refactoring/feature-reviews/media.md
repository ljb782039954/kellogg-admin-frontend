# 媒体库模块改进指导

## 1. 审查结论

Media 已拆出 Header、Grid、Details 和 controller，页面结构比旧实现清晰；但它重新实现了 `shared/media` 已经提供的上传准备、上传 API 和查重原语，并把 DOM、确认框、Toast 等具体 UI 行为放进 model。

本模块最重要的改进不是继续拆 JSX，而是先建立两条清晰边界：

```text
shared/media：单文件准备、哈希、查重、上传等通用原语
features/media：媒体库列表、筛选、选中、使用情况、详情、删除
```

当前属于“视觉组件已拆分，但领域能力仍重复且 controller 不够 headless”。

## 2. 当前实现与数据流

```text
MediaManager
  -> useMediaManager
     -> getImagesList / uploadImage / deleteImage
     -> useImageUsage
     -> calculateHashSimilarity
     -> toast / window.confirm / Image / URL.createObjectURL
  -> MediaHeader
  -> MediaGrid
  -> MediaDetails
```

同时存在另一套上传链路：

```text
shared/media/useImageUploadController
  -> prepareImageUpload
  -> getImagesList
  -> findDuplicateImages
  -> uploadImage
```

这意味着上传请求、尺寸读取和相似度规则目前有两个实现中心。

## 3. 具体问题

### P0：重复实现 shared/media 上传能力

代码证据：

- `features/media/api/media.api.ts` 再次定义 `getImagesList` 和 `uploadImage`。
- `useMediaManager` 使用浏览器 `Image` 读取尺寸。
- `shared/media` 已有 `prepareImageUpload`、`findDuplicateImages`、上传 API 和 `useImageUploadController`。

影响：

- 两条上传链路可能使用不同的压缩、哈希、尺寸和查重规则。
- 修复上传竞态或错误处理时需要修改两处。
- 媒体库上传目前没有复用 shared controller 的 selection token，快速连续选文件时更容易出现旧请求覆盖新操作。

目标：

- `shared/media/api` 成为列表与上传请求的唯一实现。
- 媒体库上传复用 `prepareImageUpload`；是否在媒体库中弹查重决策，可以由 feature 自己编排。
- `features/media/api` 只保留媒体库专属命令，例如删除、批量删除或后续元数据更新。

### P0：对象 URL 没有释放

代码证据：

- `useMediaManager` 通过 `URL.createObjectURL(file)` 给临时 `Image` 读取尺寸。
- 加载成功或失败后都没有调用 `URL.revokeObjectURL`。

影响：

- 连续上传会保留 Blob URL 及对应内存，形成浏览器会话级泄漏。

目标：

- 不在 feature 内继续维护此实现，统一复用会正确管理临时资源的 `prepareImageUpload`。
- 若保留任何本地预览 URL，必须定义创建、替换和卸载时的释放策略。

### P1：model 依赖 DOM 与通知 UI

代码证据：

- `useMediaManager` 持有 `HTMLInputElement` ref。
- `handleFileUpload` 接收 `React.ChangeEvent<HTMLInputElement>`。
- 删除流程调用 `window.confirm`。
- Mutation 回调直接调用 `toast.success/error`。

影响：

- controller 无法脱离浏览器控件测试。
- 文件选择按钮、拖放上传或批量选择需要改写 model。
- 删除确认的文案与展示方式无法由 View 替换。

目标 controller 契约：

```ts
selectFile(file: File | null)
requestDelete(): DeleteRisk | null
confirmDelete()
refresh()
```

其中 `DeleteRisk` 只描述图片、引用数量和风险级别；Dialog、Toast、input ref 与下载动作由 UI/Container 负责。

### P1：刷新使用整页 reload

代码证据：

- `MediaManager` 将 `onRefresh` 实现为 `window.location.reload()`。

影响：

- 丢失选中项、搜索条件及其他应用状态。
- 绕过 TanStack Query 的加载、错误和缓存模型。

目标：

- controller 暴露 Query `refetch` 或对 `mediaKeys.lists()` 执行 invalidate。
- 区分初次加载 `isLoading` 与手动刷新 `isFetching`，避免刷新时清空已有列表。

### P1：相似图片规则与上传查重规则不一致

代码证据：

- shared 上传查重默认阈值为 `0.95`。
- 媒体详情将 `>= 0.85` 视为高度相似。
- 媒体详情还混合尺寸相同、大小相同和大小接近等启发式规则。

这两套规则可以有不同目的，但必须显式命名：

- 上传查重：判断是否应阻止或提示重复上传。
- 媒体审计：帮助管理员发现可能重复存储的资源。

目标：

- 提取 `findSimilarMediaAssets(selected, images, policy)` 纯函数。
- Policy 明确阈值、排序和 match type。
- ViewModel 提供结构化 `similarity` 与 `reasonCode`，中文文案由 UI 格式化，不在领域函数中硬编码。

### P1：使用情况属于派生数据，却保留为全局 hook

`useImageUsage` 只是把后端 `img.usages` 重组为 map，没有跨领域查询行为。

建议：

- 改为 media model 中的纯函数 `indexMediaUsages(images)`。
- `UsageInfo` 与 `SimilarImage` 由 media feature 公开或在内部统一定义。
- `MediaGrid`、`MediaDetails` 不再从 `@/hooks/useImageUsage` 导入类型。

### P1：错误信息被吞掉

当前上传和删除的 `onError` 都只显示固定文案，没有保留 `AppError` 的 message、code 或可恢复信息。

目标：

- controller 暴露标准化错误。
- UI 可显示用户友好文案，同时保留可诊断信息。
- 删除冲突、资源正在使用、网络失败应能区分，而不是统一为“删除失败”。

### P2：选择状态在数据刷新后可能悬空

如果选中资源被其他操作删除，或 refetch 后列表中已不存在该 key，`selectedKey` 仍可能保留旧值，`selectedImage` 变为 `undefined`。

建议在列表变化后规范化选择：

- 当前 key 不存在时清空选择。
- 删除成功后仅在删除的正是当前项时清空。
- 可选地在删除后选择相邻资源，但该行为应属于明确的 UI 策略。

### P2：移动端没有详情入口

详情栏使用 `hidden lg:block`，小屏下选中图片后没有对应详情面板或抽屉。该问题属于产品交互，不是核心架构阻塞项，但在拆分 View 时应补充明确方案。

## 4. 目标职责边界

| 层级 | 职责 |
|---|---|
| `shared/media/domain` | 文件准备、压缩、哈希、通用重复度计算 |
| `shared/media/api` | 列表与单文件上传请求 |
| `features/media/api` | 删除及媒体库专属请求 |
| `features/media/model` | 搜索、选中、使用情况、相似资源、删除风险、Query/Mutation |
| Container | 文件 input、Dialog、Toast、下载/打开窗口 |
| View | Header、Grid、Details、移动端详情展示 |

建议目录：

```text
features/media/
├─ api/
│  ├─ media.api.ts
│  └─ media.keys.ts
├─ model/
│  ├─ media.types.ts
│  ├─ indexMediaUsages.ts
│  ├─ findSimilarMediaAssets.ts
│  └─ useMediaManager.ts
└─ ui/
   ├─ MediaManager.tsx
   ├─ MediaHeader.tsx
   ├─ MediaGrid.tsx
   ├─ MediaDetails.tsx
   └─ MediaDeleteDialog.tsx
```

## 5. 分阶段改进顺序

### 第一阶段：消除重复实现

1. 列表和上传统一使用 `shared/media` API。
2. 上传准备统一使用 `prepareImageUpload`。
3. 删除保留在 media feature API。
4. 删除 feature 内的尺寸读取和 Blob URL 逻辑。

### 第二阶段：使 controller headless

1. controller 改为接收 `File`，不接收 input event。
2. 将 file ref、确认框、Toast、下载窗口移到 Container。
3. 暴露 `refetch/isFetching`，移除整页 reload。
4. 暴露结构化 query/mutation error。

### 第三阶段：提取媒体库领域规则

1. 提取使用情况索引纯函数。
2. 提取相似资源匹配纯函数与 policy。
3. 统一 feature 内类型来源。
4. 根据需要补充移动端详情抽屉。

## 6. 测试补充

当前 media feature 没有专属测试，应至少覆盖：

- `indexMediaUsages` 对无引用、多引用和缺失 usages 的处理。
- 相似资源匹配的阈值、排序、尺寸/大小规则及零字节边界。
- 快速连续选择文件时旧上传结果不会覆盖新选择。
- 上传成功只失效媒体列表缓存。
- 删除风险正确反映引用数量。
- 删除成功清空正确的选中项并刷新列表。
- 上传、删除失败保留可诊断错误。
- 手动刷新使用 Query，不丢失搜索与选中状态。

## 7. 开发阶段测试脚本

本模块改进时应持续运行以下测试：

- `src/features/media/api/media.api.test.ts`：删除请求、key 编码和 Query key。
- `src/features/media/model/indexMediaUsages.test.ts`：引用索引与数据不可变性。
- `src/features/media/model/findSimilarMediaAssets.test.ts`：哈希、尺寸、大小、策略和排序规则。
- `src/features/media/model/useMediaManager.test.tsx`：列表 Query、选择、上传、删除风险、错误和缓存失效。
- `src/shared/media/domain/prepareImageUpload.test.ts`：图片准备和临时 Object URL 释放。
- `src/shared/media/domain/findDuplicateImages.test.ts`：通用上传查重规则。

模块内快速验证：

```bash
npm test -- --run src/features/media src/shared/media
```

开发约束：

- 调整相似度阈值或 match type 时，先修改纯函数测试明确新规则。
- 调整上传流程时，media feature 与 shared/media 测试必须同时运行。
- controller 测试只验证业务状态和命令，不绑定 Toast、Dialog 或文件 input DOM。

## 8. 完成标准

- 上传准备、上传 API 和通用哈希查重只有 `shared/media` 一套实现。
- media model 不持有 DOM ref，不接收 React input event，不调用 `window` 或 Toast。
- 刷新不再整页 reload。
- 相似资源和使用情况规则可脱离 React 独立测试。
- 删除确认 UI 可以替换而不修改 mutation。
- feature 内组件不再依赖全局 `hooks/useImageUsage` 类型。
