# 产品模块改进指导

## 1. 审查结论

Products 已完成本轮重构中最关键的方向转换：不再维护全量产品草稿，而是采用“列表 + 单产品详情 + 单产品保存”。Schema、Mapper、API、Query key 和基础测试也已经建立。

当前问题集中在 `useProductsManager`：它把列表查询、分类查询、批量选择、详情查询、表单、保存、删除和即时开关全部聚合在一个 hook 中。虽然文件已经进入 feature，但不同业务会话还没有真正分开。

本模块属于“核心数据模式正确，需要继续拆 controller、补表单安全和缓存一致性”。

## 2. 当前实现与数据流

```text
ProductEditorContainer
  -> useProductsManager
     -> 产品列表 Query（pageSize: 1000）
     -> 分类 Query
     -> 产品详情 Query
     -> RHF form
     -> create/update/delete mutation
     -> featured/active mutation
     -> 批量选择与串行删除
  -> ProductListSection
  -> ProductEditorView
     -> ProductMediaSection
     -> ProductVariantsSection
     -> ProductCustomFieldsSection
     -> BulkPriceSection
```

当前已做好的部分：

- API DTO 转换集中在 `product.mapper.ts`。
- 产品创建后使用服务端返回的真实 ID。
- 保存后 reset 表单并失效产品列表。
- 产品表单 sections 不直接调用 API。
- API、Mapper、controller 基本流程和 Container 有测试。

## 3. 具体问题

### P0：Schema 未接入 RHF resolver，外层保存可绕过校验

代码证据：

- `productSchema` 已定义价格、评分等约束。
- `useForm` 只设置 `defaultValues`，没有 `zodResolver(productSchema)`。
- 浮动保存按钮调用 `saveProduct()`。
- `saveProduct` 使用 `form.getValues()` 直接发起 mutation。
- `ProductEditorView` 内部 form 虽使用 `form.handleSubmit(onSave)`，但传入的 `onSave` 又会重新 `getValues()`。

影响：

- 外层浮动按钮必然绕过 RHF 校验。
- 内层 submit 的有效 values 没有真正传到保存函数，契约混乱。
- 用户可以提交负数、缺失必填值或结构不完整的数据。

目标：

- `useForm({ resolver: zodResolver(productSchema) })`。
- controller 暴露由 `form.handleSubmit` 包装后的 `submit`。
- View 不再调用一个会自行 `getValues()` 的保存函数。
- 所有保存入口共用同一个 validated submit。

### P0：切换和关闭编辑器会无提示丢弃草稿

代码证据：

- `openEditor(id)` 直接切换 `editingId`。
- `closeEditor()` 直接 reset 默认值。
- 点击遮罩会直接执行 `closeEditor`。
- 没有检查 `form.formState.isDirty`。

影响：

- 用户误点列表、遮罩或关闭按钮时，未保存编辑立即丢失。
- 后续改成路由详情页时仍需重新设计离开保护。

目标：

- controller 提供 `requestOpenEditor`、`requestCloseEditor`，返回是否需要确认。
- Container/Dialog 负责展示确认 UI。
- 保存成功后 reset，dirty 归零。
- 详情 Query refetch 不得覆盖脏表单。

### P1：controller 聚合了三个独立业务会话

建议拆分：

```text
useProductList(filters)
  列表 Query、筛选、分页、即时状态更新

useProductEditor(productId)
  详情 Query、RHF、Mapper、保存、dirty 保护

useProductBulkActions(selection, listContext)
  选择与批量命令
```

Container 组合这三者。单产品编辑 controller 不应理解列表全选，批量 controller 不应持有产品表单。

### P1：产品列表通过 `pageSize: 1000` 规避分页

代码证据：

- API 已支持 page、pageSize、category、sort 和 search。
- controller 固定请求 `{ pageSize: 1000 }`。
- Query key 使用 `productKeys.lists()`，没有包含实际参数。

影响：

- 产品数量增长后请求和渲染成本不可控。
- 后续加入筛选时容易继续共享一个不准确的缓存 key。
- “全选”语义不清：是当前页、当前筛选结果还是所有产品。

目标：

- 列表状态包含 page、pageSize、search、category、sort。
- 使用 `productKeys.list(filters)`。
- 明确批量选择只针对当前已加载页，或后端提供跨页批量命令。
- 不通过加载 1000 条记录模拟完整数据集。

### P1：跨 feature 导入违反公开入口规则

代码证据：

- `useProductForm.ts` 直接导入 `@/features/categories/api/categories.api`。
- Query key 手写为 `['categories', 'list']`。
- 测试也必须 mock categories 内部 API 路径。

影响：

- categories 内部目录调整会破坏 products。
- categories 的 key 发生变化时，products 会维护第二套缓存语义。

目标：

- categories 根入口公开只读 Query options/hook 或稳定的选择项能力。
- Products 只从 `@/features/categories` 导入。
- 如果产品编辑器只需要选项，优先消费 `CategoryOption[]`，而不是完整分类管理模型。

### P1：详情切换存在旧数据短暂显示和覆盖风险

切换 `editingId` 后，表单在新详情返回前仍可能保留上一产品数据；当前 UI 用统一的 `isDetailLoading` 覆盖编辑区，但需要明确以下行为：

- 新 ID 的 Query 开始时是否清空旧表单。
- 快速切换 A/B 时，A 的响应不能 reset B 的表单。
- 后台 refetch 不能覆盖 B 的脏草稿。
- 详情 404/失败时不能继续展示上一个产品。

目标：

- editor session 绑定明确的 productId。
- 初始化 effect 校验响应与当前 session 一致。
- 暴露独立 detail error。
- 仅在 session 初始载入或显式放弃草稿时 reset。

### P1：批量删除没有表达部分失败

代码证据：

- `deleteSelected` 逐个 `await deleteMutation.mutateAsync(id)`。
- 任一删除失败后立即进入 catch。
- 已删除项、失败项和未执行项没有分别反馈。
- `deleteMutation.onSuccess` 每成功一次都失效列表，并可能关闭当前编辑器。

影响：

- 用户只看到“批量删除失败”，无法知道哪些产品已经删除。
- N 个产品会触发 N 次列表失效。
- 删除任意产品时，只要当前正在编辑某项，都会关闭编辑器；没有确认被删的是不是当前项。

目标：

- 优先增加后端批量删除端点。
- 过渡期使用独立 bulk mutation，返回 `succeededIds`、`failed`。
- 一批结束后只刷新一次列表。
- 只有被删除 ID 等于当前编辑 ID 时才关闭编辑器。

### P1：即时开关更新缺少并发与回滚策略

`toggleFeatured` 和 `toggleActive` 共用一个 mutation，仅在成功后失效列表：

- 没有 optimistic update，反馈滞后。
- 同一产品连续切换可能出现响应顺序覆盖。
- 无法按产品 ID 展示 pending。
- 失败时没有恢复可见状态的明确策略。

目标：

- mutation 变量包含字段与目标值。
- 按产品 ID/字段管理 pending。
- 可采用 optimistic update + rollback，或禁用该项直到请求完成。
- 更新成功后同步 detail cache，并精确更新或失效相关 list cache。

### P1：缓存写入的数据形态需要统一

保存成功后将 API 返回 `Product` 写入 detail cache，这是正确方向；但 key 使用 `variables.id || result.id`，应避免依赖表单 ID 的真值语义。

目标：

- 始终使用 `result.id` 写详情缓存。
- 创建成功后移除任何临时的新建会话状态。
- 更新即时字段时同步 detail cache，避免列表与详情短时分叉。

### P2：抽屉布局与页面反馈存在重复

Container 负责遮罩和抽屉外壳，`ProductEditorView` 又承担 form 页面和关闭/保存交互。应明确：

- Container：选择哪种载体（抽屉、路由页、Dialog）。
- Editor View：产品表单内容与编辑操作。

这样后续把抽屉替换为独立路由时，不需要修改表单 controller、Mapper 和 sections。

### P2：媒体 UI 仍依赖旧 admin 组件

`ProductMediaSection` 与 `ProductVariantsSection` 使用旧 `ImageInput`。迁移期可以保留，但：

- 不应继续向旧组件增加产品专属规则。
- 新能力应通过稳定 wrapper 或 `shared/media` controller 接入。
- 产品 section 只保存 URL/媒体值，不理解上传 API、查重或 R2。

## 4. 目标职责边界

| 单元 | 职责 |
|---|---|
| `useProductList` | 参数化列表 Query、列表状态、单项即时命令 |
| `useProductEditor` | 单产品详情、表单、schema、保存和 dirty 会话 |
| `useProductBulkActions` | 选择与批量命令、部分失败结果 |
| Mapper | Product API DTO 与表单模型转换 |
| ProductEditorView | 组合 sections，展示字段错误 |
| Container | 组合列表与编辑载体，显示确认和页面级反馈 |

## 5. 分阶段改进顺序

### 第一阶段：保证表单安全

1. 接入 `zodResolver(productSchema)`。
2. 所有保存入口统一走 validated submit。
3. 增加打开、切换、关闭和离开前的 dirty 保护。
4. 增加详情错误与 session 绑定。

### 第二阶段：拆 controller

1. 提取 `useProductList`。
2. 提取 `useProductEditor`。
3. 提取 `useProductBulkActions`。
4. Container 只组合 ViewModel，不再消费一个巨型 hook。

### 第三阶段：修正列表与 mutation

1. 使用真实分页、筛选和参数化 Query key。
2. 明确全选语义。
3. 为即时开关增加并发和回滚策略。
4. 为批量删除提供部分失败结果并减少重复失效。

### 第四阶段：收窄依赖

1. 分类只通过 feature 根入口消费。
2. 统一分类 Query key。
3. 媒体 section 逐步切换到 shared/media 稳定接口。
4. 抽屉载体与 Editor View 分离。

## 6. 测试补充

现有测试基础较好，建议补充：

- 无效 schema 数据不会调用 create/update。
- 浮动保存按钮与表单 submit 使用同一校验路径。
- 切换、关闭、点击遮罩时脏表单需要确认。
- A/B 产品快速切换不会用 A 的响应重置 B。
- 详情 refetch 不覆盖脏表单。
- 参数变化生成不同列表 Query key。
- 批量删除部分成功时返回准确结果，只刷新一次列表。
- 删除非当前产品不会关闭编辑器。
- featured/active 快速切换的 pending、成功、失败回滚。
- 创建成功后以 `result.id` 写入详情缓存并 reset 表单。

## 7. 开发阶段测试脚本

本模块改进时应持续运行以下测试：

- `src/features/products/api/products.api.test.ts`：列表参数和产品 CRUD 请求。
- `src/features/products/model/product.mapper.test.ts`：DTO/Form 双向转换。
- `src/features/products/model/product.schema.test.ts`：数值边界、集合默认值和变体结构。
- `src/features/products/model/useProductForm.test.tsx`：列表、详情、新建、更新和选择状态。
- `src/features/products/ui/ProductEditorContainer.test.tsx`：页面加载与打开编辑器主流程。

模块内快速验证：

```bash
npm test -- --run src/features/products
```

开发约束：

- 接入 `zodResolver` 时，先补充“非法表单不调用 API”的 controller 测试。
- 拆分 list/editor/bulk hooks 时，应迁移测试职责，不删除现有回归场景。
- 批量删除、即时开关和 dirty 保护落地时，应各自增加成功、失败和并发测试。

## 8. 完成标准

- 产品保存只能通过 schema 校验后的 submit。
- 单产品编辑 controller 不理解批量选择和列表全选。
- 列表不再固定加载 1000 条产品。
- 切换或关闭编辑器不会静默丢弃脏草稿。
- feature 之间只通过根 `index.ts` 或稳定公共能力交互。
- 批量删除能说明部分失败，且不会为每条结果重复刷新列表。
- 更换抽屉为独立页面时，不修改 Mapper、Schema 和 mutation。
- 产品媒体 section 不包含上传、哈希或 R2 业务。
