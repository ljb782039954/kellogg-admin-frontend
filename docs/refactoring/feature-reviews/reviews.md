# 客户评价模块改进指导

## 当前判断

列表查询已使用 TanStack Query，但表单仍基本是旧组件逻辑的搬迁。

## 主要偏差

- `useReviewForm` 直接调用 API，与 `useReviewsManager` 中的 mutation 重复。
- 表单使用普通 `useState` 和手写 validate，没有 Schema、Mapper 或 RHF。
- View 直接使用 `client_name`、`review_text_zh` 等 DTO 字段。
- model 操作 `document.body`，包含具体 Dialog 行为。
- `ReviewFormView` 与 `ReviewsListView` 文件过大。
- 双语评价文本没有使用 shared/forms；图片仅通过旧 ImageInput 入口接入。

## 建议改进

1. 增加 review schema、defaults 和 mapper，将 DTO 字段隔离在 API/mapper。
2. 使用 RHF 管理评价表单，创建和更新统一走 manager 提供的 mutation。
3. body scroll lock 移到 Dialog UI 或通用 dialog hook。
4. 双语评价建立 `Translation` 表单字段，使用 `BilingualTextareaControl`。
5. 将表单拆为基本信息、评分、媒体、评价正文几个 section。
6. 将列表拆为 Toolbar、ReviewCard/Table 和 Pagination。

## 完成标准

- View 中不出现 API DTO 字段名。
- 表单校验、YouTube 解析和 DTO 转换可独立测试。
- 替换评价弹窗 UI 不影响创建和更新 mutation。
