# claude 会话要点

(claude可忽略)

## 项目总结

核心目标：一套通用内核 + 可替换项目包

  一句话： 让 adminApp 变成一个通用后台内核，切换到另一个项目时只需替换 src/package/ 目录——不动通用代码、不动 package.json。


  三层架构与依赖方向
  main.tsx  ──→ core + package   （唯一同时装配两者的点）
  package   ──→ core/contracts + shared
  core      ──→ core/contracts + shared
  shared    ──→ 第三方依赖

  ┌─────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────────────────────────────────────────────────────────────────────────┐
  │   层    │                                                               职责                                                                │                                   关键约束                                   │
  ├─────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────┤
  │ core    │ 通用业务逻辑：CRUD/分页/搜索、TanStack Query 缓存与失效、表单草稿、Page Builder 编辑会话与历史、路由生命周期、鉴权                │ 禁止出现项目名、具体实体名（Product/Blog）、具体 BlockType；不得导入 package │
  ├─────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────┤
  │ shared  │ 无业务语义的技术能力：API client、上传/哈希/媒体、通用表单辅助、Translation 等值对象                                              │ 不得导入 core/package                                                        │
  ├─────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────┤
  │ package │ 项目专属的全部内容：品牌、数据类型/DTO、菜单路由、实体定义、Block 类型与默认值、DTO Adapter，以及集中在 package/ui 的所有视觉组件 │ 只能导入 core 公开入口和 shared                                              │
  └─────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────────────────────────────────────────────────────────────────────────┘

  两级可替换性

  1. 整项目替换 → 换掉整个 src/package/
  2. 仅换皮肤 → 只换 src/package/ui/，保留实体、路由、DTO、缓存、业务配置不变

  关键设计点

  - 唯一出口：src/package/index.ts 导出 ProjectPackage 对象，通过 defineProjectPackage({ identity, shell, routes, entities, pageBuilder }) 定义（编译期校验，非运行时插件）。
  - UI 单独出口：package/ui/index.ts 导出 ProjectUiDefinition（shell / screens / blockViews / blockEditors）。所有 React 视觉组件必须在 package/ui 内。
  - 稳定 id 解耦：routes/entities/page-builder 只引用 screenId / previewId / editorId 字符串，不直接 import 具体 UI 文件——这样换 UI 时不动业务定义。
  - 数据流：core EntityController → core API/缓存/Mutation → package adapter → package screen（ViewModel + Actions）→ core 保存刷新。package UI 永不直接调 API。
  - Page Builder：core 只认 CoreBlock { id, type, content, isVisible } 最小结构；具体 Block 联合类型、Preview、Editor 全在 package。
  - Blocks 分离：package/blocks/（纯数据类型+registry，无 React）与 package/ui/blocks/（前端展示）+ package/ui/editors/（后台编辑器）分开。