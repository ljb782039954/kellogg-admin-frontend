# 页脚模块改进指导

## 1. 审查结论

Footer 已经具备独立 API、Query、Mapper、Schema 和 controller，旧数据迁移、默认值与 ID 生成也已从 View 移入 model，方向基本正确。

当前主要问题不是“代码还在旧目录”，而是业务表单会话尚未真正建立：

- `useFooterEditor` 使用普通 `useState` 保存草稿，没有 schema 驱动的提交和 dirty 状态。
- 保存成功后只失效 Query，没有用服务端事实重置草稿；本地草稿会长期优先于新 Query 数据。
- `FooterEditorView` 仍直接操作领域实体和嵌套数组，且依赖旧表单组件。
- Container 写在 `index.ts`，没有传递完整的加载、保存和错误状态。
- Footer 通过 navigation feature 的内部语义获取页面索引，领域边界不准确。

因此本模块当前属于“基础分层已建立，但 ViewModel 契约和表单生命周期不完整”。

## 2. 当前实现与数据流

```text
FooterEditor（index.ts 中临时 Container）
  -> useFooterEditor
     -> getFooter / updateFooter
     -> navigation.getPagesIndex
     -> toFooterForm
     -> useState draft
  -> FooterEditorView
     -> BilingualInput
     -> LinkSelector
     -> FooterPreview
```

关键文件：

- `src/features/footer/index.ts`
- `src/features/footer/model/useFooterEditor.ts`
- `src/features/footer/model/footer.mapper.ts`
- `src/features/footer/model/footer.schema.ts`
- `src/features/footer/ui/FooterEditor.tsx`

当前已做好的部分：

- `toFooterForm` 负责缺省值、旧 `linkType` 迁移及缺失 ID 补全。
- 新建分组和链接使用 `nanoid`，不再由 View 生成持久化标识。
- Query 与 Mutation 只作用于 footer 缓存，没有触发全局刷新。
- API、Mapper 和基础 controller 已有测试。

## 3. 具体问题

### P0：草稿不会在保存后与服务端事实重新对齐

代码证据：

- `useFooterEditor.ts` 通过 `draft ?? toFooterForm(query.data)` 决定当前数据。
- 一旦发生任何编辑，`draft` 就不再为 `null`。
- Mutation 成功后仅执行 `invalidateQueries(footerKeys.detail())`，没有清空或 reset `draft`。

影响：

- 后台 refetch 得到的新数据不会再进入当前表单。
- 如果服务端做了规范化、补字段或并发修改，页面仍显示旧草稿。
- “保存成功”只表示请求成功，不代表当前 UI 已与服务端响应一致。

目标：

- `updateFooter` 应返回保存后的 Footer 数据，或保存后显式 refetch。
- controller 应使用返回值重置表单基线，使 `isDirty` 回到 `false`。
- 后台 refetch 只在表单不脏时更新表单；脏表单不得被静默覆盖。

### P0：Schema 已存在但没有参与保存

代码证据：

- `footer.schema.ts` 定义了 `footerSchema`。
- `useFooterEditor.save()` 直接把 `FooterContent` 传给 `updateFooter`。
- `FooterEditorView` 继续使用非 RHF 的 `BilingualInput`。

影响：

- 空标题、空链接、非法外链等数据是否可提交完全取决于旧 UI。
- Schema 与实际运行规则可能逐渐分叉。
- 无法提供字段级错误，也无法可靠判断 dirty/touched。

目标：

- 使用 `useForm<FooterFormValues>` 与 `zodResolver(footerSchema)`。
- 明确最小业务约束，例如分组标题、链接名称、内部页面选择、外部 URL 格式。
- 保存只能通过 `handleSubmit` 进入 mutation。

### P1：View 仍理解 Footer 嵌套数据结构

代码证据：

- `FooterEditorView` 的 `updateGroupTitle` 会复制 `footer.linkGroups`。
- 更新链接名称时，View 直接访问并替换 `linkGroups[groupIndex].links[linkIndex]`。
- View props 暴露 `FooterContent`、`FooterLinkGroup` 和 `FooterLink`。

影响：

- 更换为表格、拖拽列表或独立链接编辑弹窗时，仍需重写嵌套更新逻辑。
- model 和 View 同时拥有数组命令，职责边界不稳定。

目标：

- model 提供基于稳定 ID 的命令，而不是让 View 按数组索引重建实体。
- 推荐命令：

```ts
addGroup()
removeGroup(groupId)
updateGroupTitle(groupId, title)
addLink(groupId)
removeLink(groupId, linkId)
updateLinkName(groupId, linkId, name)
updateLinkTarget(groupId, linkId, target)
```

- View 只提交用户意图，不负责复制领域树。

### P1：Container 契约不完整且放置位置不合理

代码证据：

- `src/features/footer/index.ts` 使用 `createElement` 组装 controller 与 View。
- controller 已暴露 `isLoading`、`isSaving` 和 `error`，Container 未传给 View。
- `index.ts` 同时承担实现与公共导出。

影响：

- 初次加载时会短暂显示默认空 Footer，可能被用户误认为真实数据。
- 保存中按钮无法禁用，错误也没有展示。
- 公共入口难以保持稳定、简洁。

目标：

```text
ui/FooterEditor.tsx          Container
ui/FooterEditorView.tsx      纯 View
ui/FooterPreview.tsx
ui/NewsletterSection.tsx
ui/LinkGroupsSection.tsx
ui/FooterLinkItem.tsx
index.ts                     只导出稳定入口
```

Container 必须处理 loading、query error、saving、submit error 和 success feedback。

### P1：页面索引依赖指向 navigation 领域

代码证据：

- `useFooterEditor` 从 `@/features/navigation` 导入 `getPagesIndex` 与 `navigationKeys.pages()`。
- 页面索引实际由 pages 领域维护。

影响：

- Footer 对 navigation 的缓存 key 和 API 语义形成不必要耦合。
- pages 与 navigation 可能分别维护同一份页面索引缓存。

目标：

- 页面索引 Query 由 pages feature 的公开入口提供。
- 更理想的长期接口是 `useInternalLinkOptions()`，返回 LinkSelector 所需的稳定选项，不向 Footer 暴露完整 `CustomPage`。
- 禁止导入其他 feature 的 `api/`、`model/`、`ui/` 内部路径。

### P2：失效链接状态没有形成提交规则

当前 `hasDeletedPage` 只产生页面级警告，`pageDeleted` 又可能来自持久化数据或旧组件行为，两种状态来源没有统一。

应明确：

- `pageDeleted` 是派生 ViewModel，不应作为 Footer 持久化字段。
- 内部链接有效性由当前页面选项实时计算。
- 保存时是禁止提交失效链接，还是允许提交并警告，需要选择一个明确策略。建议禁止新增失效链接，但允许加载旧脏数据并要求用户修复。

### P2：短时反馈计时器分散在 controller

`saved` 使用裸 `setTimeout`，组件卸载时没有清理。该问题风险较低，但多个 feature 都在重复实现。

建议由统一反馈组件、Toast 或可清理的 `useTransientFlag` 负责，不继续在领域 controller 中复制计时器。

## 4. 目标职责边界

| 层级 | 职责 | 不应负责 |
|---|---|---|
| API | 读取和保存 Footer DTO | 默认 UI 文案、表单状态 |
| Mapper | 旧数据迁移、DTO/Form 转换、派生失效链接状态 | Query、Toast、DOM |
| Schema | Footer 表单结构与提交约束 | 页面布局 |
| Controller | Query、表单初始化、dirty 保护、mutation、命令组合 | 具体 Card/Input 布局 |
| Container | 组合 controller 与页面级反馈 | DTO 转换 |
| View | 展示字段、预览和触发命令 | API、ID 生成、嵌套数组业务规则 |

建议 controller 对 View 暴露：

```ts
{
  form,
  linkOptions,
  preview,
  isInitialLoading,
  isSaving,
  isDirty,
  submitError,
  submit,
  reset,
  commands
}
```

## 5. 分阶段改进顺序

### 第一阶段：修正数据生命周期

1. 让保存 API 返回规范化后的 Footer。
2. 保存成功后使用服务端结果更新 Query，并 reset 表单。
3. 增加 Query error、saving 和 submit error 展示。
4. 明确 refetch 与 dirty 草稿的冲突策略。

### 第二阶段：接入 Schema 表单

1. 将 `footerSchema` 接入 RHF resolver。
2. 将 DTO 与 `FooterFormValues` 分开，补充双向 mapper。
3. 替换为 `shared/forms` 字段适配器。
4. 为失效内部链接和外部 URL 增加字段级校验。

### 第三阶段：收窄 UI 和 feature 边界

1. 把 Container 从 `index.ts` 移至 `ui/FooterEditor.tsx`。
2. 按预览、订阅、分组、链接项拆分 View。
3. 将嵌套数组操作统一改为 model 命令。
4. 页面选项改从 pages 公共入口或内部链接选项能力获得。

## 6. 测试补充

现有测试覆盖 API、基础 Mapper 和基本保存流程；仍需补充：

- 脏表单期间 Query refetch 不覆盖用户输入。
- 保存成功后使用服务端结果 reset，`isDirty` 归零。
- 保存失败后保留草稿并显示错误。
- footer schema 拒绝非法外链和缺失双语必填值。
- 基于 ID 的分组、链接增删改命令不修改原对象。
- 页面删除后内部链接被标记为失效。
- Container 正确传递 loading、saving、error，并阻止重复提交。

## 7. 开发阶段测试脚本

本模块改进时应持续运行以下测试：

- `src/features/footer/api/footer.api.test.ts`：API 请求、404 默认值与保存契约。
- `src/features/footer/model/footer.mapper.test.ts`：旧数据迁移、默认值、ID 和页面链接判断。
- `src/features/footer/model/footer.schema.test.ts`：Footer、分组、链接和双语字段结构。
- `src/features/footer/model/useFooterEditor.test.tsx`：Query、草稿命令与保存流程。

模块内快速验证：

```bash
npm test -- --run src/features/footer
```

开发约束：

- 修改 Mapper、Schema、API 或 controller 后，至少运行对应测试文件。
- Footer 表单接入 RHF 后，应先扩充 schema 与 controller 测试，再修改 View。
- dirty 保护和服务端结果 reset 落地后，应在 `useFooterEditor.test.tsx` 增加回归测试。

## 8. 完成标准

- `index.ts` 只保留公开导出。
- Footer 保存必须经过 schema，非法表单不会发出请求。
- 保存成功后当前草稿与服务端返回值一致。
- 后台 refetch 不会覆盖脏草稿。
- View 不生成 ID、不迁移旧数据、不直接修改嵌套数组。
- Footer 不依赖 navigation 的内部页面索引实现。
- 替换预览、链接列表或表单控件时，不需要修改 API、Mapper 和 mutation。
