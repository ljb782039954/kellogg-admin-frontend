# 导航模块改进指导

## 当前判断

查询和保存已迁入 controller，但嵌套导航编辑规则仍主要存在于 View。

## 主要偏差

- `NavigationFormView` 负责 ID 生成、增删主菜单和增删子菜单，业务命令与 JSX 混合。
- View 内再次声明 `MAX_MAIN_NAV`，与 mapper 中规则重复。
- 仍依赖旧 `BilingualInput` 和 `LinkSelector`。
- `pagesIndex.api.ts` 由 navigation 持有，页面索引归属不清晰。
- Zod schema 已存在但未参与编辑或保存。

## 建议改进

1. 将 `addNavItem`、`addSubItem`、更新和删除操作移到 model 的纯函数或 controller。
2. `MAX_MAIN_NAV` 保留单一来源，由 model 向 View 暴露。
3. 双语输入接入 `shared/forms`；LinkSelector 后续拆成 shared Control 与 feature 适配器。
4. 页面索引通过 `features/pages` 的公开入口获取，避免 navigation 自己复制页面 API。
5. 保存前使用 schema 校验规范化导航数据。

## 完成标准

- NavigationFormView 只接收数据和事件。
- View 中不生成业务 ID、不修改嵌套对象。
- 页面链接校验可以脱离当前导航 UI 单独测试。
