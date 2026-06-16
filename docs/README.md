# adminApp — 后台管理端

React 19 + Vite 7 + Tailwind v3 + shadcn/ui。

---

## src/ 目录导航

```
admin/
├── pageBuilder/       积木页面编辑器（核心功能）
│   ├── PageLayoutEditor.tsx  左右两栏编辑器
│   ├── DynamicPagesManager.tsx  页面列表管理（三类页面）
│   ├── BlockList + BlockItem + AddBlockDialog  积木块 CRUD
│   ├── BlockPropsEditor  属性面板分发器
│   ├── BlockThumbnail + PageSettingsEditor + SEOEditor
│   └── propsEditors/    每种组件对应的属性编辑面板（21个）
├── editors/           各数据板块
│   ├── product/       产品仓库（展开式编辑：信息/媒体/变体/字段/价格）
│   ├── headerEditor/  导航管理（一级最多5个+二级子菜单）
│   ├── CompanyInfoEditor + FooterEditor + CategoriesEditor
│   └── InquiryEditor + ProductsEditor
├── components/        通用编辑组件
│   ├── BilingualInput 中英文双输入框
│   ├── ImageInput     纯上传图片（支持视觉查重）
│   └── LinkSelector + MediaLibraryDialog
├── media/             图片管理（上传/查重/搜索/删除）
├── Dashboard.tsx      主布局（侧边栏 + 发布按钮 + Outlet）
├── Overview.tsx       概览仪表盘
├── BlocksPreview.tsx  21种组件预览
├── Blog* / InquiryManagement / CustomerReviews* / MediaManager
app/
├── providers/QueryProvider.tsx  TanStack Query 根 Provider
└── queryClient.ts               Query 默认缓存与重试策略
components/
├── blocks/            21种积木块预览渲染组件
├── custom/            业务组件（ProductCard, Pagination等）
└── ui/                shadcn/ui 组件库
config/
├── componentRegistry.ts   21种组件注册表（名称/分类/单例/默认属性）
└── blocksContentPreview/  示例数据
context/
├── ContentContext.tsx  全局数据状态中心
└── LanguageContext.tsx 中英文切换
features/                        新业务模块目录（后续按领域渐进迁入）
shared/
└── api/                         API client、环境配置与统一错误模型
test/                            Vitest、Testing Library 与 MSW 测试底座
types/                 与 webApp-astro 和 worker-api 共享类型
lib/api.ts             API 封装（自动附带 Admin Token）
App.tsx                路由配置
```

---

### 渐进重构约束

新业务代码按 `features/<domain>/{api,model,ui}` 组织，并通过 feature 根部 `index.ts` 暴露公共能力。`shared` 不得依赖 `features`，新 feature UI 不得直接调用 `lib/api`、`shared/api/client` 或新增对 `ContentContext` 的依赖。旧模块在迁移完成前继续保持现状。

## 架构要点

### 全局数据流（ContentContext）
启动时 `refreshData()` 并发加载：商品/分类/博客/评价（D1）+ 站点配置/导航/页脚/页面索引/构建状态（KV）。所有编辑器通过 `useContent()` 读写数据，CRUD 后自动调用 `refreshData()` 或直接更新本地状态。

### 页面分片存储策略
页面数据分为两层存于 KV：`page:{id}` 存完整数据（含 blocks），`pages_index` 存轻量索引（仅 id/path/title/isFixed）。保存时同时更新两者，读取时优先查 `page:{id}` 详情。

### 图片查重上传
`ImageInput` 组件在上传图片前先计算 aHash 感知哈希值，与已有图片对比。当相似度 >= 95% 时弹窗提示用户选择"使用已有图片"或"继续上传"，避免冗余存储。

### 积木块编辑器
基于 `@dnd-kit` 实现拖拽排序。`BlockPropsEditor` 根据 `BlockType` 动态渲染对应的属性编辑面板。`AddBlockDialog` 中检查 `singleton` 标记，确保单例组件只能添加一个。`componentRegistry` 以 `hasGlobalData` 区分数据是来自全局（D1 实体）还是局部（block.content）。

### 构建发布流程
侧边栏"发布"按钮 → `ContentContext.triggerBuild()` → POST `/api/system/trigger-build` → worker-api 调用 CF Pages Deploy Hook 异步重建前台。

## 环境变量

`.env`: 生产环境所需要的环境变量
`.env.local`: 本地开发环境所需的环境变量，由`PUBLIC_IS_LOCAL_DEV`值来决定项目是否访问本地开发环境。
