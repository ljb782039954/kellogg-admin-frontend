# Kellogg 站点包说明

Kellogg 是当前启用的站点资源包，路径为：

```text
src/site-package/kellogg
```

项目通过 `@site` 别名接入当前站点包：

```text
@site -> src/site-package/kellogg
```

因此应用入口不需要直接写死 `kellogg` 路径。

## 目录结构

```text
site-package/kellogg/
├── assets/               当前站点资源，如 logo
├── components/           后台使用的输入组件、选择器、弹窗等
├── ui-display/            前台展示组件和页面 block 预览组件
│   ├── blocks/           页面搭建器可用的 block 组件
│   └── custom/           前台风格业务组件
├── Management/           后台管理页面
│   ├── blog/             博客管理
│   ├── companyInfo/      公司信息管理
│   ├── customerReviews/  客户评价管理
│   ├── footer/           页脚管理
│   ├── header/           导航和头部管理
│   ├── inquiry/          询盘管理
│   ├── media/            媒体库管理
│   ├── pageBuilder/      动态页面管理和页面布局编辑器
│   ├── product/          商品和分类管理
│   └── propsEditors/     block 属性编辑面板
├── metadata/             站点元信息、组件注册表、默认内容
├── types/                当前站点特有类型
├── views/                概览页、组件预览页
└── Dashboard.tsx         当前站点后台主布局
```

## 站点包职责

Kellogg 包中应保留当前站点专属内容：

- 后台页面布局。
- 后台编辑器界面。
- 当前站点的输入组件和弹窗组件。
- 当前站点的前台预览组件。
- 页面搭建器 block 组件。
- block 属性编辑面板。
- logo、favicon、站点标题等品牌资源。
- 组件注册表和默认内容。

通用业务逻辑不应继续堆在 Kellogg 包中，应优先迁移到 `src/core-adminApp`。

## 与 core-adminApp 的关系

Kellogg UI 组件可以依赖 `src/core-adminApp`：

```text
Kellogg UI -> core hook / core util / core type
```

但 `core-adminApp` 不应依赖 Kellogg 的 UI、图片、样式或品牌文案。

当前仍有少量页面 block 类型位于 Kellogg 包中，这是历史结构留下的过渡状态。因为 block 协议和当前站点 block 实现关系较近，暂时不强行抽象。

## App.tsx 接入方式

`src/App.tsx` 通过 `@site` 导入当前站点页面，例如：

```ts
import Dashboard from '@site/Dashboard';
import Overview from '@site/views/Overview';
import ProductsEditor from '@site/Management/product/ProductsEditor';
```

这样未来替换站点时，理论上只需要切换 `@site` 指向，而不是在整个应用里搜索 `kellogg` 路径。

## 文档元信息

`index.html` 保持通用，不直接写 Kellogg 的标题或 favicon。

当前站点的文档元信息由站点包提供：

```text
src/site-package/kellogg/metadata/documentMeta.ts
```

`src/main.tsx` 启动时读取该元信息，并应用到浏览器标题和 favicon。

## 替换成其它站点时通常要改什么

如果后续新增其它站点包，例如：

```text
src/site-package/new-site
```

通常需要准备或修改以下内容：

1. 站点基础信息

   ```text
   metadata/siteSettings.json
   metadata/documentMeta.ts
   assets/logo/
   ```

2. 后台页面和编辑器 UI

   ```text
   Management/
   Dashboard.tsx
   views/
   components/
   ```

3. 前台预览组件和页面 block

   ```text
   ui-display/
   metadata/componentRegistry.ts
   metadata/blocksContent.ts
   ```

4. 当前站点 alias

   同步修改：

   ```text
   vite.config.ts
   tsconfig.app.json
   ```

   将 `@site` 从 Kellogg 包切换到新站点包。

## 通常不需要改什么

如果只是替换站点，通常不需要改：

```text
src/cms
src/core-adminApp
src/components/ui
src/main.tsx
src/App.tsx
index.html
```

这些文件和目录应尽量保持通用。
