# 构建发布模块改进指导

## 业务职责

构建模块负责读取前台是否存在待发布改动、显示上次部署时间，并调用 Deploy Hook 触发前台重新构建。它是全局命令能力，当前主要由后台侧边栏消费。

## 当前业务流程

1. Query 每 30 秒读取一次 `build_status`。
2. 用户点击构建按钮后执行 trigger mutation。
3. 成功后更新 build status 缓存，并显示 Toast。
4. `BuildTrigger` 根据 `hasChanges`、`isBuilding` 和上次构建时间渲染按钮。

## 审查发现

- `useBuildManager` 直接调用 Toast，业务 controller 绑定了具体反馈方式。
- `isBuilding` 与 mutation 的 `isPending` 表达同一个请求生命周期。
- error 使用 `any`，没有统一转换为 `AppError`。
- 当前默认响应失败只展示 Toast，没有向调用页面暴露稳定错误状态。

## 推荐职责边界

- `api/`：读取构建状态、触发构建。
- `model/`：组合 Query/Mutation，输出 `status`、`isBuilding` 和 `error`。
- `ui/BuildTrigger`：只根据 props 展示状态和按钮。
- Dashboard 或应用级反馈层：决定使用 Toast、Banner 或其他提示。

## 渐进改进顺序

1. 移除额外 `isBuilding` state，直接使用 mutation pending。
2. 使用 `toAppError` 暴露稳定 error。
3. 将 Toast 移到调用侧或统一 mutation feedback 适配器。
4. 保留现有轮询策略，不需要为小模块增加更多抽象。

## 完成标准

- 更换 Toast 或按钮 UI 时不修改 model。
- 构建状态只有一个可信来源。
- build feature 不依赖 Dashboard 的具体布局。
- 触发失败可以由任何调用方按自己的方式展示。
