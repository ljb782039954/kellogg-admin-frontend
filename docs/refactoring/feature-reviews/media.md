# 媒体库模块改进指导

## 当前判断

页面已迁入 feature，但重复实现了第三批已经建立的 shared/media 能力。

## 主要偏差

- feature API 重复定义 `getImagesList` 和 `uploadImage`。
- `useMediaManager` 再次实现图片尺寸读取，未使用 `prepareImageUpload`。
- 相似图片计算直接调用 `calculateHashSimilarity`，没有复用或扩展 shared/media domain。
- model 持有文件 input ref、`window.confirm` 和 Toast，仍依赖具体 UI/DOM。
- 刷新按钮使用 `window.location.reload()`，没有使用 Query refetch。
- 图片使用情况仍依赖全局 `hooks/useImageUsage`，归属不清晰。

## 建议改进

1. 列表和上传复用 `shared/media/api`；feature API 只保留媒体库专属删除等操作。
2. 上传准备复用 `prepareImageUpload`，相似度规则提取为 feature domain 纯函数。
3. file input ref 留在 `MediaManager` View，controller 只接收 `File`。
4. controller 暴露删除风险信息，由 View 负责确认框和 Toast。
5. 刷新改为 Query `refetch` 或 invalidate。
6. 将 `useImageUsage` 移入 media model；只有真正跨业务通用时才放 shared。

## 完成标准

- shared/media 是单文件上传和查重原语的唯一实现。
- media model 不访问 DOM、`window` 或具体 Toast。
- 相似图片与使用情况规则可以独立单测。
