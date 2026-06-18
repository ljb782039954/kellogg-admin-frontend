# 产品分类模块改进指导

## 业务职责

分类模块维护产品分类名称与分类主图。分类 ID 会被产品绑定，删除分类可能使已有产品失去有效筛选条件，因此新增、编辑和删除应是明确的业务命令。

## 当前业务流程

1. Query 一次加载全部分类。
2. 用户的新增、修改和删除先写入 `draft: Category[]`。
3. 点击保存后，controller 遍历原始列表和草稿列表。
4. controller 根据 ID 和字段比较推断 create、update、delete。
5. 分类名称在 controller 内转换成 `name_zh`、`name_en` 后调用 API。

该模式功能可用，但仍然继承了旧全量编辑器的思路：用户执行的是一个明确动作，系统却在保存时重新猜测动作。

## 审查发现

- controller 同时管理草稿、差异算法和 DTO 转换，业务职责过重。
- 新分类使用临时 ID，并依靠“原列表中不存在”判断 create。
- 批量保存中任何一步失败时，前面已成功的请求无法清晰反馈。
- `categorySchema` 只定义未使用，空名称等无效数据仍可进入 API。
- `CategoryListItem` 使用旧 `BilingualInput`，未接入 shared/forms。
- `CategoriesEditor` 同时是 Container 和 View，错误关闭按钮也没有实际行为。

## 推荐职责边界

- `api/`：分类 CRUD 请求和 DTO 类型。
- `model/category.mapper`：Translation 与 `name_zh/name_en` 的转换。
- `model/useCategoryList`：分类列表 Query。
- `model/useCategoryCommands`：create、update、delete mutation。
- `ui/CategoriesEditor`：组合列表和反馈。
- `ui/CategoryListItem`：只接收 category ViewModel 与明确事件。

## 渐进改进顺序

1. 先提取 category mapper，移除 controller 中的 DTO 字段。
2. 接入 schema 校验和 shared 双语 Control。
3. 将删除改为点击确认后立即执行 delete mutation。
4. 将新增和编辑改为单分类保存，或使用明确的批量命令结果。
5. 最后删除全量 draft 差异扫描。

## 完成标准

- 修改一个分类只发送一次明确 mutation。
- UI 中不出现 `name_zh`、`name_en`。
- 更换分类卡片布局不影响 CRUD 流程。
- 删除失败时不会误报整个列表保存成功。
