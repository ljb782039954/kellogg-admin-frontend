# 公司信息模块改进指导

## 业务职责

公司信息维护站点级资料，包括公司名称、Logo、简介、联系电话、邮箱、地址和社交媒体链接。保存后的数据会被 Header、Footer 和联系信息区域共同消费，因此它属于单例配置，而不是普通列表实体。

## 当前业务流程

1. `useCompanyInfoForm` 通过 Query 加载 `site_settings`。
2. Mapper 将服务端数据补全为表单默认值。
3. React Hook Form 管理用户草稿，脏表单不会被后台 refetch 覆盖。
4. 保存时 Mapper 转换为持久化结构，Mutation 更新缓存并 reset 表单。
5. `CompanyInfoFormView` 渲染基本信息、联系方式和社交媒体三个区域。

该流程已经体现了 Query、RHF、Schema、Mapper 和 View 的基本分工，是当前较好的参考样板。

## 审查发现

- `CompanyInfoFormView.tsx` 仍集中渲染全部业务区域，替换布局时需要理解完整表单。
- 双语字段反复手写 `Controller + Label + Control`，尚未使用 `shared/forms/fields` 适配层。
- `companyInfo.api.ts` 导入 mapper 并做规范化，API 与表单 model 形成反向耦合。
- View 只展示顶层错误，Zod 字段错误没有完整传递到 Control。
- Logo 使用旧 ImageInput 兼容入口是合理的过渡方案，不需要为了目录纯洁直接依赖 shared/media 内部实现。

## 推荐职责边界

- `api/`：只负责读取和保存站点配置，不补默认值、不理解 RHF。
- `model/`：负责默认值、Schema、Form/DTO Mapper 和提交 controller。
- `ui/CompanyInfoEditor`：处理 loading、query error 和页面级反馈。
- `ui/sections/`：分别渲染基本信息、联系方式和社交媒体。
- `shared/forms/fields`：负责 RHF 与双语 Control 的通用连接。

## 渐进改进顺序

1. 先补齐字段级错误展示，不改变页面布局。
2. 建立 `BilingualTextField`、`BilingualTextareaField` 后替换重复 Controller。
3. 将三个业务区块拆成 section View。
4. 最后让 API 返回原始领域数据，把规范化完全移回 mapper/controller。

## 完成标准

- 更换任意 section 的 UI 不影响查询、保存和 mapper。
- API 层不再导入表单 model。
- 表单校验错误可以落到对应字段附近。
- refetch 不会覆盖存在未保存修改的表单。
