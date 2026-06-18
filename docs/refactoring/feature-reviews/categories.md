# 产品分类模块改进指导

## 当前判断

虽然已迁出 `ContentContext`，但保存模式仍接近旧的“全量草稿比较”实现。

## 主要偏差

- `useCategoriesEditor` 保存时遍历整个列表，比较并猜测创建、更新和删除。
- DTO 字段 `name_zh`、`name_en` 在 controller 中拼装，应由 mapper 负责。
- 已创建的 Zod schema 没有参与表单或提交校验。
- `CategoryListItem` 仍使用旧 `BilingualInput`，未接入 `shared/forms`。
- Container 与纯 View 尚未明确分开。

## 建议改进

1. 改为显式命令：新增、编辑、删除分别触发对应 mutation，不再全量扫描。
2. 增加 category mapper，集中处理 Translation 与 API DTO 转换。
3. 简单列表编辑可使用 RHF field array，或保留 controller，但必须在提交前执行 schema 校验。
4. 将双语输入迁到 `BilingualTextControl` 或后续的 RHF Field；图片继续使用 ImageInput 兼容入口。
5. 把页面标题、提示和列表布局提取为 `CategoriesView`。

## 完成标准

- 修改一个分类只发送一次明确 mutation。
- UI 中不出现 `name_zh`、`name_en`。
- 更换分类卡片布局不影响 CRUD 流程。
