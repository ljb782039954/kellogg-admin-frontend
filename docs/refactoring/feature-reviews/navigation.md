# 导航模块改进指导

## 业务职责

导航模块维护 Header 的一级菜单和二级子菜单。一级菜单最多五个，每个菜单包含双语名称、链接类型、目标地址和可选子菜单；内部链接还需要感知目标页面是否已被删除。

## 当前业务流程

1. controller 同时查询 Header 配置和页面索引。
2. Mapper 将旧配置补全为可编辑结构。
3. View 直接生成菜单 ID，并执行嵌套数组的增删改。
4. controller 接收完整 `navItems` 草稿，计算失效页面并保存 Header。
5. Preview 读取同一份草稿展示中文或英文效果。

## 审查发现

- `NavigationFormView` 知道 ID 生成、菜单数量限制和嵌套修改规则。
- `MAX_MAIN_NAV` 在 mapper 与 View 中重复，规则可能漂移。
- 修改子菜单时存在浅复制后直接修改父对象的写法，难以独立测试。
- `pagesIndex.api.ts` 被放在 navigation 内，实际数据属于 pages 领域。
- `headerSchema` 未参与保存，链接和名称规则没有统一入口。
- 仍使用旧 BilingualInput 和 LinkSelector，未来换 UI 时仍需改业务 View。

## 推荐职责边界

- `api/navigation.api`：Header 配置读写。
- `model/navigation.commands`：新增、删除、更新和移动菜单的纯函数。
- `model/navigation.validation`：数量限制和内部链接有效性。
- `model/useNavigationEditor`：Query、草稿会话和保存。
- `ui/NavigationFormView`：渲染规范化后的菜单并发出命令。
- `ui/NavigationPreview`：只接收 Header ViewModel。

## 渐进改进顺序

1. 将所有嵌套数组操作和 ID 生成移到 model 纯函数。
2. 保留唯一的 `MAX_MAIN_NAV` 常量，并补命令测试。
3. 保存前执行 Header schema。
4. 页面索引改从 pages 公开入口获取。
5. 双语字段迁入 shared/forms，再处理 LinkSelector 的 Control 拆分。

## 完成标准

- NavigationFormView 只接收数据和事件。
- View 中不生成业务 ID、不修改嵌套对象。
- 页面链接校验可以脱离当前导航 UI 单独测试。
- 预览组件不参与迁移、校验或保存。
