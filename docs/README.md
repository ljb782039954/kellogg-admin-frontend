# adminApp — 后台管理端

React 19 + TypeScript + Vite 7 + Tailwind CSS v3 + shadcn/ui。

当前项目正在按“可替换项目 Package”架构重构：目标是替换 `src/package` 即可切换业务项目，替换 `src/package/ui` 即可切换视觉实现。

## 当前目录导航

```text
src/
├─ main.tsx                 唯一浏览器入口：createAdminApp(projectPackage).mount()
├─ core/                    通用内核，不包含 Kellogg 项目语义
│  ├─ app/                  AdminApp、createAdminApp、QueryProvider、LanguageContext
│  ├─ contracts/            ProjectPackage、routes、shell、entity、block 等契约
│  ├─ entities/             通用查询、详情、集合与 mutation controller
│  ├─ page-builder/         通用 Page Builder 会话、历史、命令、保存流程
│  ├─ routing/              根据 package routes 构建路由与菜单
│  └─ shell/                Shell 菜单模型与路由装配辅助
├─ shared/                  技术共享层，不包含业务领域语义
│  ├─ api/                  apiClient 与统一错误模型
│  ├─ forms/                无主题双语表单控件
│  ├─ i18n/                 Language、Translation
│  ├─ media/                图片上传准备、哈希、查重、R2Image 类型
│  └─ utils/                cn、previewUrl 等通用工具
├─ package/                 Kellogg 项目包；未来替换项目时主要替换这里
│  ├─ index.ts              projectPackage 聚合入口
│  ├─ identity/             品牌、站点资料、默认身份信息
│  ├─ routes/               路由、菜单分组与 screenId 声明
│  ├─ types/                产品、博客、页面、Block、Review 等业务类型
│  ├─ adapters/             DTO ↔ 领域模型转换
│  ├─ entities/             各业务实体定义与能力声明
│  ├─ blocks/               Block 元数据、默认内容、preview/editor 稳定 id
│  ├─ page-builder/         Kellogg Page Builder definition 与资源装配
│  └─ ui/                   默认视觉实现，可被 UI-only 包替换
│     ├─ shell/             AdminLayout、LoginPage、ErrorPage
│     ├─ screens/           业务页面与 Page Builder 页面
│     ├─ primitives/        shadcn/ui 基础组件
│     ├─ hooks/             UI 专用 hooks，例如 use-mobile
│     ├─ forms/             主题化表单控件
│     ├─ media/             AdminImage、ImageInput 等媒体 UI
│     ├─ blocks/            前台 Block 预览组件
│     └─ editors/           Page Builder 属性编辑器
├─ features/                迁移中的业务 API/model 层；UI 已迁往 package/ui
├─ test/                    Vitest、Testing Library、架构边界测试
└─ App.tsx / app / admin / components / ui / hooks / types / context / config / lib
   已删除或不再作为新架构入口使用
```

## 入口

应用入口与 Provider 均由 `src/core/app` 驱动。


## 功能模块

| 模块 | 主要职责 |
|---|---|
| Dashboard | 后台首页概览，作为 `package/ui/screens/dashboard` 的默认 screen |
| company-info | 公司资料配置，类型归属 `package/types/company-info` |
| products / categories | 产品、分类 CRUD，支持批发价、图片、双语字段、预览数据 |
| navigation / footer | Header/Footer 导航编辑，使用页面索引生成内部链接选项 |
| pages | 自定义页面列表、复制、删除与页面详情保存 |
| page-builder | Block 增删改、排序、撤销重做、SEO/页面设置、属性编辑器 |
| media | 图片上传、重复图片检测、引用统计、相似资源提示 |
| reviews | 客户评价列表、编辑、状态切换与媒体字段 |
| blogs / blog-categories | 博客与分类管理 |
| inquiries | 询盘收件箱、状态管理、导出与询盘页面设置 |
| components preview | Block 组件预览与演示数据 |

## 架构特性

- `main.tsx` 只负责挂载：`createAdminApp(projectPackage).mount()`。
- `core` 只认契约和泛型流程，不出现 Product、Blog、Kellogg、BlockType 字面量等项目语义。
- `package` 承载 Kellogg 业务定义：identity、routes、types、entities、adapters、blocks、page-builder、ui。
- `package/ui` 是唯一默认视觉实现区域；业务页面、Shell、Blocks、Editors 均集中在这里。
- UI 专用 hooks 位于 `package/ui/hooks`，不再使用顶层 `src/hooks`。
- `shared` 只放技术能力：API client、错误模型、i18n、无主题控件、媒体算法与通用工具。
- routes / blocks / editors 通过稳定 id 装配，避免非 UI 层直接 import 具体 UI 文件。
- 迁移期保留 `features/*/api|model`，但 feature UI 已迁入 `package/ui/screens`。
- `src/types` 旧兼容类型目录已删除，类型应从 `package/types`、`shared/i18n`、`shared/media` 获取。

## 边界规则

- `core` 不得导入 `package`、`features`、`package/ui` 或任何项目业务类型。
- `shared` 不得导入 `core`、`package`、`features` 或 UI。
- `package` 可以使用 `core/contracts`、`core` 公开装配能力与 `shared`，但不新增 `package.json` 依赖。
- `package/ui` 不应导入 feature 内部路径（如 `features/*/model/*`）；需要能力时走 `package/*` 或 feature public index。
- `features/api` 与 `features/model` 不得依赖 UI。
- 视觉组件应位于 `package/ui`；非 UI 层只通过 props、ViewModel、Actions、resources 或稳定 id 与 UI 交互。
- `LanguageContext` 的正式位置是 `core/app/LanguageContext`。
- TanStack Query 的正式配置位于 `core/app/queryClient` 与 `core/app/QueryProvider`。


## 环境变量

- `.env`：生产环境配置。
- `.env.local`：本地开发配置；通过 `PUBLIC_IS_LOCAL_DEV` 决定是否访问本地服务。
