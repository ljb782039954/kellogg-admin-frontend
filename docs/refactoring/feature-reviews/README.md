# adminApp 功能模块重构审查

本目录依据 `docs/refactoring/admin-architecture-refactor.md`，审查当前 `src/features/*` 的业务边界、UI/业务拆分和 shared 接入情况。

当前功能整体可以工作，本轮关注的是可维护性：业务规则是否仍绑定某套 UI、同一能力是否重复实现、未来更换表单或页面布局时是否需要重写保存流程。

每份文档都会说明：

- 该模块在后台承担的实际业务职责。
- 当前查询、草稿、校验和保存流程如何运行。
- 哪些代码虽然移动到了 feature，职责却仍未真正拆开。
- API、model、Container、View 和 shared 应分别负责什么。
- 可以逐步实施的改进顺序和完成标准。

## 总体结论

| 模块 | 当前情况 | 建议优先级 |
|---|---|---|
| company-info | 架构样板基本成立，主要需要继续拆 View | 低 |
| build | 体量小，但通知副作用仍在 model | 低 |
| categories | 仍是全量草稿扫描保存，且使用旧表单组件 | 中 |
| navigation | 嵌套数据命令仍写在 View，shared forms 未接入 | 中 |
| footer | View 过大，容器写在 `index.ts`，跨 feature 依赖不理想 | 高 |
| products | 基础分层已建立，但 controller 过重且存在内部跨 feature 导入 | 高 |
| pages | 页面列表、编辑器和 Page Builder 边界仍混在一起 | 高 |
| media | 重复实现 shared/media 的上传与查重能力 | 高 |
| reviews | 表单仍使用 DTO 字段和手写状态，UI 文件过大 | 高 |

## 共性改进顺序

1. 先把 API、DOM、Toast、确认框等副作用移出纯 View。
2. 再把 DTO 转换、嵌套数组命令和校验放入 model。
3. 新 UI 优先使用 `shared/forms`、`shared/media` 和 shadcn 组件。
4. 最后拆分过大的 View，不以文件行数作为唯一标准。

## 审查时采用的职责标准

```text
Route / App
  -> Feature Container：组合 controller 与页面状态
  -> Controller / Use Case：业务流程、Mutation、表单会话
  -> Mapper / Schema：数据转换与校验
  -> API：请求与响应

Feature View：只接收可直接展示的数据和事件
Shared：不理解 Product、Footer、Review 等具体业务实体
```

短期的弹窗开关、悬停项和选中项可以留在 UI；创建规则、DTO 字段、保存顺序、链接有效性和上传规则不能留在 UI。

## 模块文档

- [公司信息](company-info.md)
- [构建发布](build.md)
- [产品分类](categories.md)
- [导航](navigation.md)
- [页脚](footer.md)
- [产品](products.md)
- [页面与 Page Builder](pages.md)
- [媒体库](media.md)
- [客户评价](reviews.md)
