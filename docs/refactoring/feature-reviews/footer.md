# 页脚模块改进指导

## 当前判断

数据操作已进入 controller，但 View 和公开入口仍承担过多组装职责。

## 主要偏差

- `FooterEditor.tsx` 同时包含预览、订阅表单、链接分组和链接项编辑，文件职责过多。
- 部分嵌套数组复制与修改仍在 View 中完成。
- `index.ts` 使用 `createElement` 创建 Container，不利于阅读和测试。
- 当前 Container 没有完整传递 loading、saving 和 error 状态。
- controller 依赖 navigation feature 获取页面索引，领域归属不合理。
- 仍使用旧 `BilingualInput`、`LinkSelector`，Zod schema 也未接入保存流程。

## 建议改进

1. 新建普通的 `FooterEditor` Container 文件，`index.ts` 只负责导出。
2. 拆为 `FooterPreview`、`NewsletterSection`、`LinkGroupsSection` 和 `FooterLinkItem`。
3. Container 统一处理加载、保存中、成功和失败反馈。
4. 所有链接组和链接项命令统一放在 model，不让 View 复制并修改嵌套数组。
5. 页面索引改从 pages feature 的公开入口获取，或抽成通用链接选项能力。
6. 双语字段迁入 `shared/forms`，保存前执行 footer schema。

## 完成标准

- 预览 UI 可以单独替换。
- `index.ts` 不包含 React 业务组装。
- Footer View 不负责生成 ID、迁移旧数据或修改嵌套结构。
