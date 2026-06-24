# package/ui/primitives 未使用组件清单

重要：这个文档一般开发不需要阅读！！！
生成日期：2026-06-24

## 统计口径

本清单只统计 `src/package/ui/primitives` 下的基础 UI primitive 文件。

“未使用”定义为：从 `src` 下运行时代码出发，没有任何非 `primitives` 文件直接导入该 primitive，且也不能通过其他已使用 primitive 间接到达。

未纳入统计：

- `src/test` 下的测试引用。
- 文档、注释或字符串中的路径。
- 位于 `src/package/ui/hooks` 的 UI hooks，例如 `use-mobile`。

## 汇总

| 项目 | 数量 |
|---|---:|
| primitive 文件总数 | 53 |
| 被运行时代码直接使用 | 14 |
| 当前未使用 / 不可达 | 39 |

## 当前未使用的 primitive 文件

这些文件当前没有被业务页面、Shell、Blocks、Editors、Media/Form 等运行时代码使用。后续可以按需删除；删除前建议再跑一次同样的引用扫描，因为 shadcn/ui 组件经常会被新页面临时启用。

| 文件 | 说明 |
|---|---|
| `src/package/ui/primitives/accordion.tsx` | 当前未被运行时代码导入 |
| `src/package/ui/primitives/alert-dialog.tsx` | 当前未被运行时代码导入 |
| `src/package/ui/primitives/aspect-ratio.tsx` | 当前未被运行时代码导入 |
| `src/package/ui/primitives/avatar.tsx` | 当前未被运行时代码导入 |
| `src/package/ui/primitives/breadcrumb.tsx` | 当前未被运行时代码导入 |
| `src/package/ui/primitives/button-group.tsx` | 当前未被运行时代码导入 |
| `src/package/ui/primitives/calendar.tsx` | 当前未被运行时代码导入 |
| `src/package/ui/primitives/carousel.tsx` | 当前未被运行时代码导入 |
| `src/package/ui/primitives/chart.tsx` | 当前未被运行时代码导入 |
| `src/package/ui/primitives/checkbox.tsx` | 当前未被运行时代码导入 |
| `src/package/ui/primitives/command.tsx` | 当前未被运行时代码导入 |
| `src/package/ui/primitives/context-menu.tsx` | 当前未被运行时代码导入 |
| `src/package/ui/primitives/drawer.tsx` | 当前未被运行时代码导入 |
| `src/package/ui/primitives/dropdown-menu.tsx` | 当前未被运行时代码导入 |
| `src/package/ui/primitives/empty.tsx` | 当前未被运行时代码导入 |
| `src/package/ui/primitives/field.tsx` | 当前未被运行时代码导入 |
| `src/package/ui/primitives/form.tsx` | 当前未被运行时代码导入 |
| `src/package/ui/primitives/hover-card.tsx` | 当前未被运行时代码导入 |
| `src/package/ui/primitives/input-group.tsx` | 当前未被运行时代码导入 |
| `src/package/ui/primitives/input-otp.tsx` | 当前未被运行时代码导入 |
| `src/package/ui/primitives/item.tsx` | 当前未被运行时代码导入 |
| `src/package/ui/primitives/kbd.tsx` | 当前未被运行时代码导入 |
| `src/package/ui/primitives/menubar.tsx` | 当前未被运行时代码导入 |
| `src/package/ui/primitives/navigation-menu.tsx` | 当前未被运行时代码导入 |
| `src/package/ui/primitives/pagination.tsx` | 当前未被运行时代码导入 |
| `src/package/ui/primitives/popover.tsx` | 当前未被运行时代码导入 |
| `src/package/ui/primitives/progress.tsx` | 当前未被运行时代码导入 |
| `src/package/ui/primitives/radio-group.tsx` | 当前未被运行时代码导入 |
| `src/package/ui/primitives/resizable.tsx` | 当前未被运行时代码导入 |
| `src/package/ui/primitives/sheet.tsx` | 仅被当前未使用的 `sidebar.tsx` 依赖，因此运行时不可达 |
| `src/package/ui/primitives/sidebar.tsx` | 当前未被运行时代码导入 |
| `src/package/ui/primitives/skeleton.tsx` | 仅被当前未使用的 `sidebar.tsx` 依赖，因此运行时不可达 |
| `src/package/ui/primitives/slider.tsx` | 当前未被运行时代码导入 |
| `src/package/ui/primitives/sonner.tsx` | 当前未被运行时代码导入 |
| `src/package/ui/primitives/spinner.tsx` | 当前未被运行时代码导入 |
| `src/package/ui/primitives/table.tsx` | 当前未被运行时代码导入 |
| `src/package/ui/primitives/tabs.tsx` | 当前未被运行时代码导入 |
| `src/package/ui/primitives/toggle.tsx` | 仅被当前未使用的 `toggle-group.tsx` 依赖，因此运行时不可达 |
| `src/package/ui/primitives/toggle-group.tsx` | 当前未被运行时代码导入 |

## 当前仍在使用的 primitive

这些文件有运行时代码直接导入，不应作为本轮清理对象：

- `alert.tsx`
- `badge.tsx`
- `button.tsx`
- `card.tsx`
- `collapsible.tsx`
- `dialog.tsx`
- `input.tsx`
- `label.tsx`
- `scroll-area.tsx`
- `select.tsx`
- `separator.tsx`
- `switch.tsx`
- `textarea.tsx`
- `tooltip.tsx`
