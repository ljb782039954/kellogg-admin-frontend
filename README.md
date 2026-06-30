# adminApp

这是一个服装类外贸网站的后台管理系统，用来维护商品、分类、博客、询盘、客户评价、媒体资源、导航、页脚、公司信息和动态页面。

它不是前台网站本身，而是给站点内容管理人员使用的后台。后台保存的数据会被前台网站、Worker API、Cloudflare KV / D1 / R2 等服务使用。

## 项目特点

- 支持中英文内容管理。
- 支持商品、分类、博客、询盘、客户评价等常见外贸网站内容。
- 支持图片上传、媒体库管理和相似图片检查。
- 支持动态页面搭建，可以通过积木块组合页面。
- 支持站点导航、页脚、公司信息等基础内容维护。
- 当前站点资源与通用后台能力已经开始拆分，方便后续接入其它站点。

## 如果要替换成另一个站点

通常需要准备一个新的站点资源包，例如：

```text
src/site-package/new-site
```

然后把当前项目中与 Kellogg 相关的站点专属资源替换为新站点资源。

主要需要处理这些内容：

1. 站点包目录

   复制或新建一个站点包：

   ```text
   src/site-package/new-site
   ```

2. 站点基础信息

   修改新站点包里的元信息，例如：

   ```text
   metadata/siteSettings.json
   metadata/documentMeta.ts
   assets/logo/
   ```

   这些内容决定后台显示的站点名称、浏览器标题、favicon 和品牌资源。

3. 后台页面和编辑器

   根据新站点需要调整：

   ```text
   Management/
   Dashboard.tsx
   views/
   components/
   ```

   如果新站点的数据结构和 Kellogg 类似，大部分管理页面可以复用，只替换文案、样式和少量字段。

4. 前台预览组件和页面积木块

   根据新站点前台视觉调整：

   ```text
   components-web/
   metadata/componentRegistry.ts
   metadata/blocksContent.ts
   ```

   这些内容决定页面搭建器里有哪些积木块，以及这些积木块如何预览。

5. 切换当前站点入口

   将项目中的 `@site` 指向新的站点包。

   需要同步修改：

   ```text
   vite.config.ts
   tsconfig.app.json
   ```

   例如从：

   ```text
   src/site-package/kellogg
   ```

   改为：

   ```text
   src/site-package/new-site
   ```

完成以上内容后，后台入口仍然可以保持不变，因为应用通过 `@site` 读取“当前站点包”。

## 哪些内容通常不需要改

如果只是替换站点，通常不需要改这些通用能力：

```text
src/core
src/components/ui
src/main.tsx
src/App.tsx
index.html
```

其中：

- `src/core` 是通用业务逻辑。
- `src/components/ui` 是基础 UI 组件。
- `src/App.tsx` 只负责装配当前站点包。
- `src/main.tsx` 负责启动应用并读取当前站点的文档信息。
- `index.html` 保持通用，不直接写某个站点的 logo 或标题。

## 本地运行

安装依赖后运行：

```bash
npm run dev
```

默认开发端口是：

```text
http://localhost:3000
```

如果要连接本地 Worker API，通常需要在本地环境变量中配置：

```text
VITE_API_BASE_URL=http://localhost:8787
VITE_ADMIN_TOKEN=dev-admin-token
```

更详细的开发结构说明请看：

```text
docs/README.md
```
