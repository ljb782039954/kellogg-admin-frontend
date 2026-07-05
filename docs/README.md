# adminApp 开发速览


## 项目特点

- React + Vite 后台应用。
- 支持多站点切换
- 支持多语言内容管理。
- 支持商品、分类、博客、询盘、客户评价、媒体资源、导航、页脚、公司信息和动态页面。
- 支持图片上传、媒体库管理和相似图片检查。
- 支持页面搭建器，通过 block 组合动态页面。
- 通用业务逻辑逐步沉淀到 `src/core-adminApp`，站点 UI、样式、素材和 block 实现留在站点包。

## 核心分层

```text
src/
├── cms/              跨项目的契约内容资源、类型、API、工具函数
├── core-adminApp/    通用业务逻辑、上下文、类型、API、工具函数
├── components/ui/    通用基础 UI primitive
├── runtime/          解决跨项目组件宿主依赖问题，
├── site-package/     站点资源包，
├── App.tsx           后台路由装配入口
└── main.tsx          React 启动入口
```

路径别名：

```text
@      -> src
@site  -> 当前启用的站点包
```

`App.tsx` 和 `main.tsx` 应通过 `@site` 接入当前站点资源，不应直接写死具体站点目录。

## 依赖约束

1. cms/作为跨项目契约资源，不应该依赖其它的组件和内容，只能在cms内部依赖。
2. 站点资源的blocks和adapters 也需要跨项目使用，所以不应依赖`core-{name}`项目的核心业务逻辑，以免出现复杂依赖问题，但是可以依赖runtime/ 中的组件，以适配项目宿主。


## 通用业务逻辑

`src/core-adminApp` 是当前项目的通用层，主要包含：

```text
core-adminApp/
├── app/              应用级工具，例如标题、favicon 元信息应用
├── config/           登录、账号设置、管理员配置
├── context/          全局数据上下文、语言上下文
├── hooks/            通用 hooks
├── items/            各业务模块的通用逻辑 hooks
├── lib/              API、图片处理、链接处理、工具函数
├── markdown/         Markdown 编辑行为
├── rich-text/        富文本格式化工具
```

核心思路是：业务状态、数据转换、保存流程、校验逻辑尽量放在 `core-adminApp`；界面结构、视觉样式、站点文案和素材留在站点包。

## 主要业务模块

### 全局数据状态

`ContentContext` 是后台数据中心，负责加载和刷新商品、分类、博客、评价、媒体资源、公司信息、导航、页脚、动态页面、构建状态等数据。

页面组件通常不直接重复实现请求流程，而是调用 `core-adminApp/items/**` 中的 hook，再通过 `ContentContext` 读取或刷新全局状态。

### 商品与分类

通用逻辑位于 `src/core-adminApp/items/product`。

包含商品基础信息、媒体、变体、自定义字段、批量价格和分类管理相关逻辑。

### 博客

通用逻辑位于 `src/core-adminApp/items/blog`。

Markdown 编辑行为位于 `src/core-adminApp/markdown`。站点包负责保留具体编辑器界面和样式。

### 询盘

通用逻辑位于 `src/core-adminApp/items/inquiry`。

包含询盘列表、筛选、状态处理、导出和询盘页面配置相关逻辑。

### 媒体

通用逻辑位于 `src/core-adminApp/items/media`。

包含媒体库状态、图片上传、图片压缩、hash 计算和相似图片检测。

### 导航、页脚、公司信息

通用逻辑位于 `src/core-adminApp/items/site`。

包含链接编辑、页面链接校验、导航项处理、页脚链接组处理、公司信息保存等逻辑。

### 客户评价

通用逻辑位于 `src/core-adminApp/items/review`。

包含评价表单、评价列表、状态更新、YouTube 缩略图处理等逻辑。

### 页面搭建器

通用逻辑位于 `src/core-adminApp/items/page-builder`。

页面搭建器负责动态页面列表、页面设置、SEO、block 增删改、拖拽排序和保存流程。具体 block 的视觉实现和属性编辑面板属于站点包。

页面搭建器的展示预览策略见 [page-builder-preview.md](./page-builder-preview.md)。

样式主题的站点包管理策略见 [style-theme-management.md](./style-theme-management.md)。

## 边界规则

### 推荐

- 通用业务逻辑放入 `src/core-adminApp`。
- 站点页面调用 `core-adminApp/items/**` 暴露的 hook。
- 站点 UI、样式、品牌素材、前台 block 和默认内容放在站点包。
- 应用入口通过 `@site` 接入当前站点。

### 避免

- 在通用逻辑中导入站点图片、站点文案、站点 UI 组件。
- 在 `App.tsx`、`main.tsx` 中写死具体站点目录。
- 为了“看起来通用”把站点专属 UI 搬进 `core-adminApp`。
- 为当前小项目引入复杂插件系统或过度抽象。

## 开发约定

- 重构优先小步进行，避免一次性大规模移动文件。
- 不运行生产构建作为常规验证。
- 不运行全量测试；只运行与当前改动相关的检查。
- 业务逻辑优先通过 hook 拆出，UI 样式保留在站点包中。

## 环境变量

常用环境变量：

```text
VITE_API_BASE_URL   后端 API 地址，本地开发通常指向 worker-api 本地服务
VITE_API_ASSETS   数据库资产，本地开发通常指向
VITE_ADMIN_TOKEN    管理端请求使用的 token
```

`.env` 通常用于正式或共享配置，`.env.local` 通常用于本地开发配置。
