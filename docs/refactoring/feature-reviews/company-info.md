# 公司信息模块改进指导

## 当前判断

该模块最接近目标架构，可继续作为其他表单模块的参考样板。

## 主要偏差

- `CompanyInfoFormView.tsx` 仍集中渲染三个大区块，更换布局时改动面较大。
- React Hook Form 与双语 Control 的连接仍在 View 中重复编写。
- `companyInfo.api.ts` 导入 model mapper，使 API 层承担了数据规范化职责。
- 图片字段仍通过旧 `admin/components/ImageInput` 兼容入口使用。

## 建议改进

1. 将基本信息、联系方式、社交媒体拆成独立 section View。
2. 在 `shared/forms/fields` 增加 RHF 字段适配器，减少 View 中的 `Controller` 模板代码。
3. API 只返回服务端数据；默认值和 Form/DTO 转换统一留在 mapper 或 controller。
4. ImageInput 兼容入口可以暂时保留，不需要为了形式直接依赖 shared/media 内部文件。

## 完成标准

- 更换任意 section 的 UI 不影响查询、保存和 mapper。
- API 层不再导入表单 model。
- 表单校验错误可以落到对应字段附近。
