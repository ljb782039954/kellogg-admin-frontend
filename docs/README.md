# adminApp — 后台管理端

React 19 + TypeScript + Vite 7 + Tailwind CSS v3 + shadcn/ui。

## 当前目录导航

```text
src/
├─ admin/
│  ├─ Dashboard.tsx       后台主布局
│  ├─ Overview.tsx        概览仪表盘
│  └─ BlocksPreview.tsx   页面区块预览
├─ app/
│  ├─ providers/          应用级 Provider
│  ├─ adapters/           业务能力与默认 UI 的装配层
│  └─ queryClient.ts      TanStack Query 配置
├─ components/
│  ├─ blocks/             前台区块预览组件
│  ├─ custom/             现有业务展示组件
│  └─ ui/                 待迁移到 src/ui/primitives 的 shadcn/ui
├─ config/
│  ├─ componentRegistry.ts
│  └─ blocksContentPreview/
├─ context/
│  ├─ ContentContext.tsx  待本轮重构移除
│  └─ LanguageContext.tsx
├─ features/              按业务领域组织的 API、model 与可替换 View
├─ shared/                不依赖具体业务领域的技术能力
├─ ui/                    本轮将建立的默认 UI 实现根目录
├─ test/                  Vitest、Testing Library 与 MSW 基础设施
├─ types/                 跨项目共享类型
└─ App.tsx                路由与应用装配
```

## 架构边界

- `features/<domain>` 保存业务查询、Mutation、Controller、ViewModel 和公共契约。
- `ui` 保存默认视觉实现，不直接请求业务 API，也不读取全局业务 Context。
- `app/adapters` 组合多个 feature 的公共能力，并将数据注入默认 UI。
- `shared` 不依赖 `features` 或 `ui`。
- 跨业务数据由 Container 或 Adapter 注入，不新增全局业务 Context。
- UI 替换应通过稳定的 props、ViewModel、Actions 和资源契约完成。

## 当前权威重构文档

- [设计说明](superpowers/specs/2026-06-19-ui-context-cleanup-design.md)
- [实施计划](superpowers/plans/2026-06-19-ui-context-cleanup.md)

历史迁移与阶段性改进文档已移除，避免与当前目标结构产生冲突。

## 环境变量

- `.env`：生产环境配置。
- `.env.local`：本地开发配置；通过 `PUBLIC_IS_LOCAL_DEV` 决定是否访问本地服务。
