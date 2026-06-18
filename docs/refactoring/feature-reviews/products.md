# 产品模块改进指导

## 当前判断

已经完成“列表 + 单产品编辑”的关键方向，但 controller 仍聚合了过多职责。

## 主要偏差

- `useProductsManager` 同时管理列表、详情表单、批量选择、删除和即时开关 mutation。
- 直接导入 `features/categories/api` 内部文件，违反 feature 公开入口规则。
- Product schema 没有作为 RHF resolver，提交时可能绕过校验。
- 切换或关闭产品编辑器时没有脏表单确认。
- Container 与 `ProductEditorView` 都创建遮罩和抽屉布局，UI 层次重复。
- 媒体 section 仍依赖旧 ImageInput；当前可用，但新 UI 不应继续扩展旧 admin 组件。

## 建议改进

1. 拆成 `useProductList`、`useProductEditor` 和 `useProductBulkActions`。
2. 分类数据只通过 categories feature 的公开入口消费，或由 Container 注入。
3. 为 RHF 接入 `zodResolver(productSchema)`，保存只走 `handleSubmit`。
4. 增加切换产品、关闭抽屉前的 dirty 检查。
5. 抽屉只由 Container 或 View 中的一层负责。
6. 新增产品媒体 UI 时，优先消费 shared/media controller 或稳定的 ImageInput wrapper。

## 完成标准

- 单产品编辑 controller 不理解列表批量选择。
- feature 之间只通过根 `index.ts` 交互。
- 表单无效时不会发出保存请求。
- 更换抽屉为独立页面时不修改 mapper 和 mutation。
