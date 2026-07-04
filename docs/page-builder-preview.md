# PageBuilder 预览策略调整

本文描述页面搭建器接下来要做的一次轻量重构：舍弃旧的 `components-web`，改用 `ui-display` 作为真实展示组件来源，并移除手写缩略图体系。

## 背景

当前页面搭建器中存在一个独立的 `BlockThumbnail.tsx`，用于在添加弹窗和左侧积木块列表中展示小缩略图。

这个方案有几个问题：

- 缩略图是手写的抽象图形，不是真实组件效果。
- 组件样式、图片、布局和动效无法准确展示。
- 每新增一个 block，都需要在 `BlockThumbnail.tsx` 中硬编码一份缩略图。
- 缩略图逻辑会和真实展示组件逐渐漂移，维护成本越来越高。

因此后续不再维护手写缩略图，而是直接使用站点展示包中的真实组件进行预览。

## 新方向

Kellogg 站点的展示组件统一来自：

```text
src/site-package/kellogg/ui-display
```

旧目录：

```text
src/site-package/kellogg/components-web
```

应逐步废弃，不再作为 pageBuilder 的预览和类型来源。

## 目标结构

```text
site-package/kellogg/
├── Management/
│   └── pageBuilder/          后台页面搭建器 UI
├── metadata/
│   └── componentRegistry.ts  后台可添加 block 注册表
├── types/                    Kellogg 后台 pageBuilder 类型约束
└── ui-display/
    ├── components/blocks/    真实展示组件
    ├── block-adapters/       将 CMS 内容转换为展示组件 props
    ├── blockComponentMap.ts  block type -> 展示组件
    └── types/blocks.ts       展示层 block content map
```

## 交互调整

### 添加组件弹窗

添加弹窗仍然保留组件分类、名称、描述、是否唯一等信息。

但弹窗中的预览应使用真实展示组件生成，而不是使用 `BlockThumbnail.tsx` 的手写图形。

也就是说，组件卡片中的预览来源应逐步改为：

```text
componentRegistry 默认内容
        ↓
ui-display block adapter
        ↓
ui-display 真实 block 组件
        ↓
缩放后的真实预览
```

### 左侧积木块列表

左侧列表主要负责页面结构管理，不再展示缩略图。

它只需要展示：

- block 名称
- block 类型或简短描述
- 显示 / 隐藏状态
- 拖拽排序入口
- 上移、下移、删除等操作

这样左侧列表会更清爽，也不会因为预览图过小导致展示失真。

### 右侧编辑器顶部

真实组件样式应在当前 block 的编辑区域顶部展示。

当用户在左侧选中某个 block 时，右侧编辑器顶部先展示该 block 的真实预览，下方再展示属性编辑表单。

推荐结构：

```text
右侧编辑区
├── 当前 block 信息
├── 真实组件预览
└── 属性编辑表单
```

这样用户在编辑字段时，可以直接看到该组件的实际展示效果。

## 边界规则

### pageBuilder 可以依赖

- `@site/metadata/componentRegistry`
- `@site/types`
- `@site/ui-display/blockComponentMap`
- `@site/ui-display/block-adapters`
- `@site/ui-display/types`

### pageBuilder 不应继续依赖

- `@site/components-web/blocks`
- `@site/components-web/custom`
- 手写缩略图组件 `BlockThumbnail.tsx`

## 推荐迁移顺序

1. 先让 `componentRegistry` 的类型和默认内容与 `ui-display` 的 block content map 对齐。
2. 新增一个真实 block 预览组件，用于根据 block type 和 content 渲染 `ui-display` 组件。
3. 将添加弹窗中的 `BlockThumbnail` 替换为真实预览组件。
4. 简化左侧 `BlockItem`，去掉缩略图区域，只保留结构和操作信息。
5. 在 `BlockPropsEditor` 顶部加入当前 block 的真实预览。
6. 确认 `components-web` 不再被 pageBuilder 引用后，再删除旧目录。

## 注意事项

- 真实预览应使用受控尺寸容器，避免大组件撑爆弹窗或编辑器。
- 弹窗中的预览可以使用缩放容器展示，不要求完整交互。
- 编辑器顶部的预览应优先表现真实视觉效果，交互可以适当弱化。
- `ui-display` 不应依赖 `core-adminApp`，需要宿主能力时应通过 `runtime` 提供。
- `cms` 只提供跨项目契约，不定义 Kellogg 的具体 block union。
