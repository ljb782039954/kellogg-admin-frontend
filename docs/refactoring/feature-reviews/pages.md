# 页面与 Page Builder 模块改进指导

## 当前判断

页面 API 已独立，但页面管理、草稿状态和积木编辑边界仍没有完全拆开。

## 主要偏差

- `PagesManager.tsx` 同时管理筛选、分组、弹窗表单、删除确认和页面卡片。
- `usePageList` 使用手写异步命令，没有使用 mutation 状态，error 也没有完整落地。
- `usePageEditor` 将 Query 数据复制到 `useState`，远端更新可能覆盖编辑草稿，且没有 dirty 保护。
- Page Builder 仍放在 pages feature，并直接依赖多个旧 `admin/pageBuilder` 组件。
- 页面索引类型依赖 `any` 获取 `blockCount`。

## 建议改进

1. 将列表拆为 Container、Toolbar、PageSection、PageCard 和 PageMetaDialog。
2. 页面创建、更新、删除改用独立 mutation，并由 mutation 管理 pending/error。
3. 页面详情草稿使用 RHF 或 reducer 初始化，明确 dirty 状态和远端 refetch 策略。
4. 把 block 增删、移动、显隐和属性更新提取为可测试的纯命令。
5. 后续建立独立 `features/page-builder`，逐步包住旧 admin/pageBuilder；不要修改 `components/blocks`。
6. 为页面索引定义明确类型，移除 `any`。

## 完成标准

- 页面列表 UI 不负责持久化流程。
- Query refetch 不覆盖脏页面草稿。
- Block 命令可以不渲染页面编辑器直接测试。
- pages 与 page-builder 的公开边界明确。
