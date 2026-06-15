# adminApp 架构拆分与渐进重构设计

## 1. 背景与目标

当前 `adminApp` 中，多个编辑页面同时承担以下职责：

- 页面布局与视觉组件渲染
- 表单草稿和交互状态管理
- 数据校验与默认值处理
- API 调用及保存流程
- 领域模型与 API DTO 转换
- 脏数据判断、错误提示和成功反馈

典型案例包括：

- `src/admin/components/BilingualInput.tsx`
- `src/admin/components/BilingualInputAera.tsx`
- `src/admin/components/ImageInput.tsx`
- `src/admin/editors/CompanyInfoEditor.tsx`
- `src/admin/editors/ProductsEditor.tsx`
- `src/admin/editors/FooterEditor.tsx`
- `src/context/ContentContext.tsx`

这种组织方式导致 UI 与业务流程互相依赖。即使只替换输入框、布局或弹窗，也可能需要重写保存、上传、校验或 DTO 转换逻辑。

本次重构的目标不是简单缩短文件，而是建立稳定的依赖方向，使业务状态与持久化流程不依赖具体 UI。

重构完成后应具备以下能力：

- 更换表单 UI 时，不改动查询、校验、保存和 DTO 转换。
- 更换产品编辑布局时，不改动产品业务流程。
- 各业务域可以独立查询、保存、测试和演进。
- 服务端状态不再集中存放在一个大型 React Context 中。
- 新增编辑页面时可以复用清晰、统一的架构模板。

## 2. 范围

### 2.1 纳入范围

- 公司信息、产品、分类、导航、页脚等后台编辑模块
- 页面管理与页面编辑器中的编辑状态及持久化流程
- 博客、评价、询盘和媒体管理页面
- `ContentContext` 中的服务端数据及 CRUD 能力
- 双语表单字段、图片上传等后台编辑基础能力
- API client、错误模型、Query、Mutation、Schema 和 Mapper

### 2.2 明确排除

- `src/components/blocks/` 下由前端贡献的积木渲染组件
- 对现有后台视觉设计的整体重做
- 一次性重写所有后台页面
- 建设完整的低代码或 Schema 驱动表单平台
- 与本次前端架构拆分无关的后端 API 改造

`components/blocks` 可以继续被页面预览或编辑器消费，但不得为了本次重构修改其内部实现。

## 3. 现状诊断

### 3.1 表单组件只实现了固定 UI

`BilingualInput` 和 `BilingualInputAera` 分别写死了输入框与文本域的标签、布局和 Tailwind 样式，且包含大量重复代码。

它们没有复杂业务逻辑，但缺少清晰的表单适配边界。调用方只能直接依赖这套视觉实现，因此替换 UI 时需要批量修改业务页面。

`BilingualInputAera` 还存在命名拼写问题，应逐步迁移为 `BilingualTextareaField`，而不是直接全局改名造成大范围风险。

### 3.2 图片组件承担完整业务流程

`ImageInput` 同时负责：

- 文件选择和 DOM ref
- 图片尺寸读取与压缩
- 感知哈希计算
- 媒体列表加载
- 重复图片匹配
- 上传请求
- 重复图片决策状态
- 错误处理、预览和弹窗 UI

该组件既是展示组件，又是业务流程控制器，难以测试，也无法在不同 UI 中复用上传规则。

### 3.3 Editor 同时承担业务、状态和布局

例如 `CompanyInfoEditor` 同时维护草稿、同步 Context、执行保存、展示反馈并渲染全部页面布局。

`ProductsEditor` 的耦合更严重：

- 将完整产品列表复制为本地草稿
- 生成临时产品 ID
- 扫描所有产品并比较差异
- 在 UI 文件中拼装 API DTO
- 循环执行创建和更新请求
- 同时管理展开、选择、批量删除和反馈状态

这种全量编辑模式无法良好扩展到更多产品，也使表格、抽屉、独立编辑页等 UI 方案难以替换。

### 3.4 ContentContext 是跨业务域的全局数据中心

`ContentContext` 同时加载并维护产品、分类、博客、评价、公司信息、导航、页脚、页面和构建状态。

其主要问题包括：

- 不相关业务共享同一个加载与错误状态。
- 部分 CRUD 会触发全量 `refreshData()`。
- 页面既有通过 Context 调用 API 的模式，也有直接导入 `api` 的模式。
- Context 同时承担服务端缓存、命令入口和 UI 通知。
- 难以精确失效缓存，也难以单独测试某个业务域。

## 4. 方案比较

### 4.1 方案一：仅按视觉区域拆组件

将大型页面拆成 Header、Toolbar、Section、Dialog 等小组件。

优点：

- 改动较小，能够快速缩短文件。

缺点：

- API、草稿、Mapper 和保存流程仍在页面层。
- 容易形成大量 props 传递。
- 只能改善可读性，不能真正支持 UI 替换。

该方案可以作为实现细节，但不能作为主要架构方案。

### 4.2 方案二：业务域纵向拆分与 Headless Controller

每个业务域独立拥有 API、Query、Schema、Mapper、Controller 和 View。UI 只消费数据、表单对象与事件。

优点：

- 可以渐进迁移。
- 业务流程与视觉实现真正解耦。
- Query、表单和 UI 状态职责明确。
- 适合现有各模块差异较大的后台系统。

缺点：

- 初期需要建立目录规则和基础设施。
- 迁移期间旧架构与新架构会短期共存。

本设计采用该方案。

### 4.3 方案三：完全 Schema 驱动的通用编辑器

使用字段配置自动生成公司信息、产品、页脚等表单。

优点：

- 简单表单可获得较高复用度。

缺点：

- 产品、页脚和页面编辑器结构差异明显。
- 容易发展为复杂的低代码系统。
- 自定义交互最终仍需要大量逃生接口。

当前阶段不采用。未来可仅对结构简单、重复明显的字段局部使用配置驱动。

## 5. 总体架构

### 5.1 依赖方向

依赖方向固定为：

```text
路由页面
  ↓
Feature Container
  ↓
Form Controller / Use Case
  ↓
Query、Mutation、Schema、Mapper
  ↓
API Client

Feature View
  ↑
只接收 ViewModel、表单对象和事件
```

View 不得直接导入 API、`ContentContext` 或传输层 DTO。Controller 负责把业务能力组合为 View 可以直接消费的接口。

### 5.2 推荐目录结构

```text
src/
├─ app/
│  ├─ providers/
│  │  └─ QueryProvider.tsx
│  └─ queryClient.ts
│
├─ features/
│  ├─ company-info/
│  │  ├─ api/
│  │  │  ├─ companyInfo.api.ts
│  │  │  └─ companyInfo.keys.ts
│  │  ├─ model/
│  │  │  ├─ companyInfo.schema.ts
│  │  │  ├─ companyInfo.mapper.ts
│  │  │  └─ useCompanyInfoForm.ts
│  │  ├─ ui/
│  │  │  ├─ CompanyInfoEditor.tsx
│  │  │  ├─ CompanyInfoFormView.tsx
│  │  │  └─ sections/
│  │  └─ index.ts
│  ├─ products/
│  ├─ categories/
│  ├─ navigation/
│  ├─ footer/
│  ├─ pages/
│  ├─ page-builder/
│  ├─ blogs/
│  ├─ reviews/
│  ├─ inquiries/
│  ├─ media/
│  └─ build/
│
├─ shared/
│  ├─ api/
│  │  ├─ client.ts
│  │  └─ errors.ts
│  ├─ forms/
│  │  ├─ fields/
│  │  ├─ controls/
│  │  └─ FormFeedback.tsx
│  ├─ media/
│  └─ ui/
│
└─ types/
```

### 5.3 目录职责

- `app/`：应用级 Provider 和框架初始化。
- `features/<domain>/api`：领域请求函数、Query Key 和 Query/Mutation 定义。
- `features/<domain>/model`：Schema、Mapper、默认值、Controller 和领域纯函数。
- `features/<domain>/ui`：Container、纯 View 和业务专属视觉组件。
- `shared/`：不理解具体业务实体的通用能力。
- `types/`：迁移期间保留现有共享类型，后续逐步将领域专属类型移动到对应 feature。

任何依赖 `Product`、`FooterLink`、`CustomPage` 等具体领域类型的代码，原则上不能因为被多个页面使用就放入 `shared`。

`shared/media` 与 `features/media` 的边界如下：

- `shared/media` 只提供文件准备、压缩、哈希、重复度计算和单文件上传 Controller 等通用原语。
- `features/media` 负责媒体库列表、搜索、筛选、删除、分页及媒体管理页面。
- `shared/media` 不得依赖媒体管理页面的筛选条件、批量操作或具体布局。

## 6. 状态职责

采用以下清晰分工：

- TanStack Query：服务端事实及请求生命周期。
- React Hook Form：用户尚未提交的编辑草稿。
- Zod：表单结构、默认值约束和提交校验。
- 组件 state：展开项、选中项和弹窗开关等短期 UI 状态。
- URL：筛选、分页、当前 Tab 等需要刷新保留或分享的状态。

禁止将 Query 数据复制到普通 `useState` 后，通过 `useEffect` 无条件同步。需要编辑时，应使用 Query 数据初始化或 reset 表单，并在表单存在脏数据时阻止远端刷新静默覆盖用户输入。

## 7. 表单组件设计

### 7.1 三层结构

双语字段拆为：

```text
Translation 数据规则
        ↓
React Hook Form 字段适配器
        ↓
可替换的视觉 Control
```

推荐结构：

```text
shared/forms/
├─ fields/
│  ├─ BilingualTextField.tsx
│  └─ BilingualTextareaField.tsx
├─ controls/
│  ├─ BilingualTextControl.tsx
│  └─ BilingualTextareaControl.tsx
└─ types.ts
```

- `Field` 连接 React Hook Form，处理字段路径、错误和 touched 状态。
- `Control` 是纯展示组件，只接收值、变化事件、错误、禁用状态和必要的视觉配置。
- 字段文案、是否必填及业务提示由 feature 传入。
- UI 布局不是 Translation 数据规则的一部分。

### 7.2 迁移兼容

第一阶段保留现有 `BilingualInput` 和 `BilingualInputAera` 导出，并让其内部转调新的 Control，避免一次性修改全部调用方。

新代码只允许使用新命名：

- `BilingualTextField`
- `BilingualTextareaField`
- `BilingualTextControl`
- `BilingualTextareaControl`

旧导出在所有调用方迁移完成后删除。

### 7.3 避免万能组件

不创建拥有几十个 props 的通用输入框。只有数据行为相同且视觉差异可通过少量明确参数表达时才共享组件，否则允许 feature 提供自己的 Control。

## 8. 图片上传设计

### 8.1 拆分结构

```text
shared/media/
├─ domain/
│  ├─ findDuplicateImages.ts
│  └─ prepareImageUpload.ts
├─ api/
│  └─ media.api.ts
├─ model/
│  ├─ media.queries.ts
│  └─ useImageUploadController.ts
└─ ui/
   ├─ ImageUploadControl.tsx
   └─ DuplicateImageDialog.tsx
```

### 8.2 Controller 契约

`useImageUploadController()` 应提供类似以下接口：

```ts
{
  status,
  error,
  preview,
  duplicates,
  selectFile,
  reuseImage,
  forceUpload,
  clear
}
```

UI 不应知道：

- 感知哈希算法
- R2 存储细节
- API URL
- Query 缓存方式
- 图片压缩和查重流程

领域纯函数负责准备上传文件和筛选重复图片，Controller 编排查询与上传状态，View 只处理交互和视觉。

## 9. TanStack Query 设计

### 9.1 Query Key

Query Key 按领域定义，不使用整个后台共享的单一 key：

```ts
companyInfoKeys.detail()
productKeys.list(filters)
productKeys.detail(id)
categoryKeys.list()
pageKeys.list()
pageKeys.detail(id)
mediaKeys.list(filters)
```

### 9.2 缓存失效

Mutation 只更新或失效相关缓存。例如：

- 更新公司信息只更新公司信息缓存。
- 更新一件产品时优先更新详情缓存，并失效相关产品列表。
- 删除分类只失效分类列表和明确依赖分类的数据。
- 更新页面详情不应重新请求博客、评论或页脚。

禁止用全局 `refreshData()` 作为 Mutation 的默认收尾方式。

### 9.3 Query 与表单协作

- 首次 Query 成功后初始化表单。
- 切换编辑记录前检查 `formState.isDirty`。
- 保存成功后使用服务端返回值 reset 表单。
- 后台 refetch 不得自动覆盖脏表单。
- Query 错误和表单校验错误分别处理。

## 10. ContentContext 渐进退场

不一次性删除 `ContentContext`，按以下步骤缩小：

1. 接入 `QueryClientProvider`，新模块直接使用领域 Query。
2. 公司信息、产品、分类等模块逐个迁出。
3. `ContentContext` 暂时保留页面构建状态和未迁移模块。
4. 页面、导航和页脚迁移完成后，将构建状态拆入 `build` feature。
5. 删除 `refreshData()` 和全局实体集合。
6. 最终删除无引用的 `ContentContext`。

过渡期的硬性规则：新代码不得继续向 `ContentContext` 添加 CRUD、服务端实体或新的全局加载状态。

## 11. 业务域边界

```text
features/
├─ company-info/    公司资料
├─ products/        产品列表与产品编辑
├─ categories/      产品分类
├─ navigation/      Header 导航
├─ footer/          Footer 配置
├─ pages/           页面元数据与 CRUD
├─ page-builder/    积木编排与属性编辑
├─ blogs/           博客管理
├─ reviews/         客户评价
├─ inquiries/       询盘管理
├─ media/           媒体资源
└─ build/           前台构建发布
```

Feature 对外只通过 `index.ts` 暴露稳定入口。其他 feature 不得导入其内部目录。

示例：

```ts
// features/company-info/index.ts
export { CompanyInfoEditor } from './ui/CompanyInfoEditor';
export type { CompanyInfoFormValues } from './model/companyInfo.schema';
```

## 12. 产品编辑器专项设计

### 12.1 放弃全量草稿保存

产品模块改为“列表查询 + 单产品编辑会话”：

```text
ProductsPage
├─ ProductListToolbar
├─ ProductList
└─ ProductEditorContainer
   └─ ProductEditorView
```

数据流：

```text
产品列表 Query
    ↓ 选择产品 ID
产品详情 Query
    ↓ 初始化或 reset
useProductForm
    ↓ submit
create/update Mutation
    ↓
更新详情缓存 + 失效相关列表缓存
```

每件产品独立保存。批量操作只处理明确命令，例如批量删除、上下架或调整分类，不再扫描整个产品列表并猜测哪些产品发生变化。

### 12.2 产品目录

```text
products/
├─ api/
│  ├─ products.api.ts
│  └─ products.keys.ts
├─ model/
│  ├─ product.schema.ts
│  ├─ product.mapper.ts
│  ├─ product.defaults.ts
│  └─ useProductForm.ts
└─ ui/
   ├─ ProductEditorContainer.tsx
   ├─ ProductEditorView.tsx
   ├─ ProductSummarySection.tsx
   ├─ ProductMediaSection.tsx
   ├─ ProductVariantsSection.tsx
   ├─ ProductCustomFieldsSection.tsx
   └─ BulkPriceSection.tsx
```

产品 Section 通过 React Hook Form 的 `control`、`register`、`errors` 或 `useFormContext()` 访问草稿，不调用 API。

### 12.3 Mapper

DTO 转换集中在 `product.mapper.ts`：

```ts
toProductForm(product)
toCreateProductInput(form)
toUpdateProductInput(form)
```

UI 中不允许出现 `name_zh`、`bulk_prices`、`category_id` 等传输层字段名。

服务端创建产品后返回真实 ID。客户端不得以可能与服务端冲突的数字作为新产品永久标识。

## 13. 导航、页脚与页面编辑器

### 13.1 导航和页脚

需要从 UI 中抽离：

- 旧数据兼容转换
- 嵌套数组增删改
- 内部链接有效性判断
- 页面删除后的链接状态
- 默认值和 ID 生成

预览组件可以保留为独立 View，只接收规范化后的数据，不参与迁移、校验和保存。

### 13.2 页面与 Page Builder

页面管理拆为：

- 页面索引 Query
- 页面详情 Query
- 页面 CRUD Mutation
- 页面编辑草稿
- Block 编排命令
- 属性编辑表单

页面索引清洗与 `page:{id}` 详情存储规则应封装在 `pages` feature 的 API/Mapper 层，不能散落在 UI 或 Context 中。

`page-builder` 可以消费现有 `components/blocks` 进行预览，但积木渲染组件本身不进入重构范围。

## 14. 错误处理

统一错误模型：

```ts
type AppError = {
  code: string;
  message: string;
  fieldErrors?: Record<string, string>;
  cause?: unknown;
};
```

规则：

- API client 将 HTTP、网络和响应解析错误转换为 `AppError`。
- Zod 错误显示在对应字段附近。
- Mutation 错误由所属 feature 决定展示位置。
- Toast 只用于简短的操作结果，不承载需要持续阅读的信息。
- 批量操作必须返回逐项结果或明确的部分失败信息。
- 表单有未保存内容时，切换记录或离开页面需要确认。
- Query refetch 不得覆盖脏表单。

## 15. 测试策略

项目当前缺少业务测试，采用风险驱动策略。

### 15.1 纯函数单元测试

- DTO/Form Mapper
- Zod Schema
- 产品默认值
- 图片重复度筛选
- Footer 旧数据迁移
- 页面索引清洗
- 链接有效性判断

### 15.2 Hook 测试

- Query 成功、失败及缓存失效
- Mutation 后缓存更新
- 表单初始化与 reset
- 脏表单保护
- 新建与编辑两种提交路径

### 15.3 组件交互测试

- 双语字段显示校验错误
- 图片查重后的复用与强制上传
- 产品新增、编辑和删除
- Footer 嵌套链接编辑

### 15.4 端到端主流程

- 登录后编辑公司信息并保存
- 创建并编辑产品
- 修改页面积木并保存
- 触发前台构建

建议引入：

- Vitest
- Testing Library
- MSW

Playwright 可在核心迁移稳定后引入，第一批基础架构不强制加入。

## 16. 迁移批次

### 第一批：基础设施

- 安装并接入 TanStack Query。
- 建立 Query Provider 和 Query Client。
- 拆出 API client 与统一错误模型。
- 建立 feature 目录、公开入口和依赖规则。
- 补充 Vitest、Testing Library 与 MSW 基础配置。

完成标准：旧页面行为不变，新 feature 可以独立查询与测试。

### 第二批：公司信息样板

- 为公司信息建立 Query、Mutation、Zod Schema 和 Mapper。
- 使用 React Hook Form 管理草稿。
- 拆出 Container、View 和 Section。
- 建立双语字段新结构。
- 保持现有路由和视觉不变。

完成标准：更换 CompanyInfo View 或双语 Control 不影响保存流程。

### 第三批：媒体上传

- 拆出上传准备、查重、Query、Controller 和 View。
- 为旧 `ImageInput` 提供兼容封装。
- 覆盖重复图片复用和强制上传测试。

完成标准：上传流程能够脱离当前 Dialog 和 Tailwind UI 独立测试。

### 第四批：分类

- 建立分类列表 Query 与 CRUD Mutation。
- 验证列表编辑、创建、删除和缓存失效模式。
- 移除分类页面对 `ContentContext` 的依赖。

完成标准：分类变化只影响相关 Query。

### 第五批：产品

- 将产品改为列表与单产品编辑会话。
- 建立产品 Schema、默认值和 Mapper。
- 删除全量 `localProducts` 草稿。
- 删除 `JSON.stringify` 差异扫描。
- 将批量操作改为显式命令。

完成标准：单件产品独立保存，保存后只更新相关缓存。

### 第六批：导航与页脚

- 抽离旧数据转换、链接校验和嵌套数组操作。
- 拆分 Container、表单 View 和预览 View。
- 移除对 `ContentContext` 的依赖。

完成标准：预览 UI 可独立替换，迁移和保存规则不受影响。

### 第七批：页面管理与 Page Builder

- 分离页面索引与详情 Query。
- 封装 KV 存储规则和页面索引清洗。
- 将页面草稿和 Block 命令从页面 UI 中抽离。
- 保持 `components/blocks` 不变。

完成标准：页面保存不触发无关业务刷新，积木渲染组件无改动。

### 第八批：博客、评价与询盘

- 将直接调用 `api` 的页面迁入对应 feature。
- 统一错误、查询、Mutation 和表单模式。

完成标准：后台业务页面不再直接依赖底层 request client。

### 第九批：Context 清理

- 迁移构建状态到 `build` feature。
- 删除 `refreshData()` 和全局实体集合。
- 删除无引用的 `ContentContext`。
- 删除旧表单与上传兼容组件。

完成标准：服务端实体状态全部由领域 Query 管理。

## 17. 每批通用完成标准

每一批都必须满足：

- 页面视觉和路由保持不变。
- 新 UI 不直接导入 API。
- 服务端状态不进入普通 React Context。
- 旧调用方在迁移期间仍能构建。
- 当前 feature 的关键纯函数和流程有测试。
- 完成并验证当前 feature 后再迁移下一批。
- 不进行跨业务域的大爆炸式重写。

## 18. 强制架构规则

应通过 ESLint、路径约定和代码评审共同保证：

```text
shared        不得导入 features
feature A     不得导入 feature B 的内部文件
ui            不得导入底层 api client
api           不得导入 React 或 UI
model         不得依赖具体视觉组件
route/page    不得直接调用底层 request
```

代码警戒线：

- 文件超过约 250 行时检查是否承担多种职责。
- 组件拥有超过 8 个本地 state 时检查状态归属。
- API 调用、表单状态和大段 JSX 同时出现时必须拆分。
- 同一 DTO 转换出现第二次时立即提取 Mapper。
- 不以文件行数作为唯一拆分依据。

不为每个函数机械创建接口。抽象必须消除真实重复、隔离变化来源或建立明确依赖边界。

## 19. 验收指标

整体重构完成后应达到：

- 更换双语输入 UI 时，不修改业务 Hook、Schema 或 API。
- 更换产品编辑布局时，不修改保存和 DTO 转换逻辑。
- 更新产品不会刷新博客、页脚和页面数据。
- 单个 feature 可以独立测试。
- `ContentContext` 不再保存服务端实体数据。
- UI 文件中不出现 API DTO 字段名。
- 图片上传业务不依赖 Dialog 或 Tailwind 也可运行。
- 新增编辑页面时无需复制保存状态、DTO 转换和错误处理。
- `components/blocks` 不因本次重构产生改动。

## 20. 实施原则

- 优先建立一个完整样板，再横向迁移其他模块。
- 首个样板选择公司信息，而不是复杂度最高的产品模块。
- 保持路由、API 契约和视觉稳定，缩小每批风险。
- 允许旧新架构短期共存，但禁止继续扩展旧架构。
- 每批迁移都应可独立回归和交付。
- 产品、页脚、页面编辑器按各自领域特点设计，不强行套入万能表单抽象。
