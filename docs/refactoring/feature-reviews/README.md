# adminApp 功能模块重构审查

本目录依据 `docs/refactoring/admin-architecture-refactor.md`，审查当前 `src/features/*` 的职责拆分与 shared 接入情况。

本轮只给出改进方向，不要求立即重写，也不评价现有功能是否可用。

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
