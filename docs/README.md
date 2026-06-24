# adminApp — 后台管理端

React 19 + TypeScript + Vite 7 + Tailwind CSS v3 + shadcn/ui。

所有重构计划完成后，务必更新此文档。

## 当前目录导航

```text
src/
├─ admin/                   后台外壳页面
│  ├─ Dashboard.tsx         后台主布局
│  ├─ Overview.tsx          概览仪表盘（使用 useProductsSummary）
│  └─ BlocksPreview.tsx     页面区块预览
├─ app/
│  ├─ providers/            应用级 Provider
│  ├─ adapters/             业务能力与默认 UI 的装配层
│  │  └─ page-builder/      默认 Page Builder Adapter
│  └─ queryClient.ts        TanStack Query 配置
├─ ui/                      默认视觉实现
│  ├─ primitives/           基础组件库（原 shadcn/ui）
│  ├─ forms/                富文本、双语输入等表单控件
│  ├─ media/                AdminImage、ImageInput 等媒体控件
│  └─ themes/default/       默认主题
│     └─ page-builder/      Page Builder 属性编辑器
├─ features/                按业务领域组织的 API、model 与可替换 View
├─ shared/                  不依赖具体业务领域的技术能力
│  ├─ api/                  API client 与统一错误模型
│  ├─ forms/                双语表单控件（无主题）
│  └─ media/                上传准备、哈希、查重
├─ test/                    Vitest、Testing Library 与 MSW 基础设施
├─ types/                   跨项目共享类型
└─ App.tsx                  路由与应用装配
```

## 架构边界

- `features/api` 与 `features/model` 不得依赖 `ui`。
- `ui` 不得导入 feature 内部路径、apiClient 或 QueryClient。
- `shared` 不得依赖 `features` 或 `ui`。
- `app/adapters` 组合跨 feature 的公共能力，将数据注入 UI。
- `LanguageContext` 是唯一保留的应用级 Context。
- 跨业务数据由 Container 或 Adapter 显式注入，不新增全局业务 Context。
- UI 替换应通过稳定的 props、ViewModel、Actions 和资源契约完成。
- `src/admin/components`、`src/admin/pageBuilder`、`ContentContext`、`lib/api` 均已删除。

## 已迁移路由

| 路由 | 模块 |
|---|---|
| `/company` | `features/company-info` |
| `/products` | `features/products` |
| `/categories` | `features/categories` |
| `/header` | `features/navigation` |
| `/footer` | `features/footer` |
| `/pages` / `/pages/:pageId/edit` | `features/pages` / `features/page-builder` |
| `/media` | `features/media` |
| `/reviews` | `features/reviews` |
| `/blog` / `/blog/new` / `/blog/:id/edit` | `features/blogs` |
| `/blog-categories` | `features/blog-categories` |

## 环境变量

- `.env`：生产环境配置。
- `.env.local`：本地开发配置；通过 `PUBLIC_IS_LOCAL_DEV` 决定是否访问本地服务。

