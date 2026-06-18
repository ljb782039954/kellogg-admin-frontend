# 构建发布模块改进指导

## 当前判断

模块体量较小，Container/Controller/View 边界基本清晰。

## 主要偏差

- `useBuildManager` 内直接调用 Toast，model 仍知道具体反馈 UI。
- `isBuilding` 与 mutation 的 pending 状态重复。
- error 使用 `any`，没有统一转换为 `AppError`。

## 建议改进

1. Controller 返回 `error`、`successMessage` 或 mutation 状态，由调用侧决定 Toast 展示。
2. 优先直接使用 `triggerMutation.isPending`，避免重复 loading state。
3. 使用 `toAppError` 统一错误信息。

## 完成标准

- 更换 Toast 或按钮 UI 时不修改 model。
- 构建状态只有一个可信来源。
- build feature 不依赖 Dashboard 的具体布局。
