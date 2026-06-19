# Inquiries 模块重构设计

## 1. 背景

`inquiries` 是 `adminApp` 尚未迁入 `features/` 的最后一个主要业务模块，目前由两个旧页面组成：

```text
src/admin/InquiryManagement.tsx
src/admin/editors/InquiryEditor.tsx
```

它们分别承担：

- 客户询盘收件箱：列表、搜索、状态筛选、详情、状态更新、删除和导出。
- 询盘页面配置：编辑 `system-inquiry` 页面的双语标题与描述。

当前实现仍存在典型旧架构问题：

- UI 直接调用 `@/lib/api`。
- 列表服务端状态复制到组件 `useState`。
- 查询、Mutation、筛选、选区、导出和大段 JSX 集中在一个文件。
- Inquiry DTO 类型定义在 UI 文件中。
- 页面配置编辑器同时依赖 `ContentContext` 和 `lib/api`。
- 页面配置保存依赖仅为该编辑器保留的 `findPage/updatePage`。
- 询盘列表接口实际分页，但旧 UI 只读取默认第一页后进行本地搜索。

本次重构将两个能力迁入同一个 `features/inquiries`，同时保持各自边界清晰。

## 2. 目标

重构完成后应具备以下能力：

- 更换询盘收件箱布局时，不修改查询、状态更新、删除和导出规则。
- 搜索、状态筛选和分页由服务端查询驱动。
- 列表缓存由 TanStack Query 管理，不复制为普通服务端状态。
- 选中询盘只保存 ID，详情始终从当前 Query 数据派生。
- TXT/CSV 内容生成可以脱离浏览器 UI 独立测试。
- 更换页面配置表单 UI 时，不修改页面读取和保存流程。
- `InquirySettingsEditor` 不再依赖 `ContentContext`。
- 两条现有路由与当前视觉行为保持稳定。

## 3. 范围

### 3.1 纳入范围

- `/inquiries` 客户询盘管理页面。
- `/inquiry-editor` 询盘页面配置编辑器。
- 询盘列表 API adapter、Query Key、Query 和 Mutation。
- 服务端搜索、状态筛选和分页在 adminApp 中的接入。
- 询盘 DTO 到领域模型的 Mapper。
- 当前选区、筛选和分页 Controller。
- 状态更新与删除后的精确缓存处理。
- 单条 TXT 和当前筛选页 CSV 导出。
- `system-inquiry.content` 的读取、规范化、表单和保存。
- 询盘相关旧 API 与 `ContentContext` 能力清理。
- 纯函数、Hook 和 View 交互测试。

### 3.2 明确排除

- 前台公开询盘提交表单。
- Turnstile、限流和重复提交防护。
- 修改 D1 表结构。
- 批量删除或批量更新状态。
- 导出全部匹配结果的后端接口。
- 询盘回复、邮件发送、负责人分配或内部备注。
- 重做当前后台视觉设计。
- 在迁移文档中安排 worker-api 开发任务。

## 4. 已确认的服务端契约

adminApp 按以下接口契约接入：

```http
GET /api/inquiries
  ?page=1
  &pageSize=20
  &status=pending|processed
  &search=keyword
```

响应：

```ts
interface PaginatedInquiriesDto {
  data: InquiryDto[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
```

搜索范围为：

- `name`
- `email`
- `company`

其他接口保持现有契约：

```http
PATCH /api/inquiries/:id
Body: { "status": "pending" | "processed" }

DELETE /api/inquiries/:id
```

本设计只描述 adminApp 如何消费这些接口。

## 5. 方案选择

### 5.1 方案一：只迁移询盘收件箱

优点：

- 改动较小。

缺点：

- `InquiryEditor` 继续依赖 `ContentContext`。
- 无法完成旧页面架构清理。

不采用。

### 5.2 方案二：一个 inquiries feature，两个子能力

```text
features/inquiries/
├─ inbox/
└─ settings/
```

优点：

- 业务归属一致。
- 收件箱与页面配置仍可独立演进。
- 可以一次移除两个旧路由实现。
- 页面配置通过 pages 公共能力持久化，不复制 KV 规则。

采用该方案。

### 5.3 方案三：配置编辑器放入 pages feature

优点：

- 与页面持久化距离较近。

缺点：

- 询盘业务能力被拆散。
- `pages` 会开始理解具体页面内容语义。

不采用。

## 6. 模块结构

```text
src/features/inquiries/
├─ api/
│  ├─ inquiries.api.ts
│  ├─ inquiries.api.test.ts
│  └─ inquiries.keys.ts
├─ model/
│  ├─ inquiry.types.ts
│  ├─ inquiry.mapper.ts
│  ├─ inquiry.mapper.test.ts
│  ├─ inquiry.schema.ts
│  ├─ inquiry.exports.ts
│  ├─ inquiry.exports.test.ts
│  ├─ useInquiriesList.ts
│  ├─ useInquiriesList.test.tsx
│  ├─ useInquirySettings.ts
│  └─ useInquirySettings.test.tsx
├─ ui/
│  ├─ inbox/
│  │  ├─ InquiriesManager.tsx
│  │  ├─ InquiriesView.tsx
│  │  ├─ InquiriesView.test.tsx
│  │  ├─ InquiryList.tsx
│  │  └─ InquiryDetail.tsx
│  └─ settings/
│     ├─ InquirySettingsEditor.tsx
│     ├─ InquirySettingsView.tsx
│     └─ InquirySettingsView.test.tsx
└─ index.ts
```

职责：

- `api/`：只处理 HTTP 请求和传输类型。
- `model/`：领域类型、Mapper、Schema、导出纯函数和 Controller。
- `ui/inbox/`：当前收件箱视觉实现。
- `ui/settings/`：当前页面配置视觉实现。
- `index.ts`：只暴露路由入口和确有需要的公共类型。

## 7. 依赖方向

```text
Inquiries 路由
  ↓
InquiriesManager
  ↓
useInquiriesList
  ↓
inquiries API
  ↓
shared/api/client

Inquiry Settings 路由
  ↓
InquirySettingsEditor
  ↓
useInquirySettings
  ↓
features/pages 公共能力
```

硬性规则：

- `features/inquiries/ui` 不得导入 API 或 QueryClient。
- `features/inquiries/model` 不得依赖具体视觉组件。
- `features/inquiries/api` 不得导入 React。
- settings 只能通过 `@/features/pages` 使用页面能力。
- `features/pages` 不得依赖 inquiries。
- `shared` 不得依赖 inquiries。

## 8. 领域类型与 Mapper

API DTO 保留后端字段：

```ts
interface InquiryDto {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  company: string | null;
  product_type: string | null;
  quantity: string | null;
  message: string | null;
  status: string;
  created_at: string;
  updated_at?: string;
}
```

UI 使用领域模型：

```ts
type InquiryStatus = 'pending' | 'processed';

interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  company: string | null;
  productType: string | null;
  quantity: string | null;
  message: string | null;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string | null;
}
```

Mapper 提供：

```ts
toInquiry(dto: InquiryDto): Inquiry
toPaginatedInquiries(dto): PaginatedInquiries
```

规则：

- UI 不出现 `product_type`、`created_at` 等 DTO 字段。
- 未知 status 不静默传入 UI，应由 Mapper 拒绝或转成明确错误。
- 日期保留 ISO 字符串，格式化属于 View。

## 9. 收件箱查询状态

```ts
interface InquiryListFilters {
  page: number;
  pageSize: number;
  search: string;
  status: 'all' | InquiryStatus;
}
```

Query Key：

```ts
inquiryKeys.all
inquiryKeys.lists()
inquiryKeys.list(filters)
```

状态职责：

- TanStack Query：列表、分页信息和请求生命周期。
- Controller state：搜索词、状态筛选、页码和 selectedId。
- View state：仅动画或纯视觉开关。

规则：

- 搜索词或状态变化时 page 重置为 1。
- 搜索请求保留上一页数据，避免列表闪空。
- `selectedInquiry` 根据 `selectedId + query data` 派生。
- 当前页切换后若 selectedId 不在新数据中，清空选区。
- 不把 Query data 复制到 `useState<Inquiry[]>`。

## 10. Mutation 与缓存

### 10.1 状态更新

```ts
updateStatus(id, status)
```

成功后：

- 更新所有已缓存 inquiry list 中对应 ID 的 status。
- 保留当前选区。
- 不全局刷新其他业务 Query。

失败后：

- 不修改缓存。
- 保留原状态。
- 显示操作错误。

### 10.2 删除

```ts
removeInquiry(id)
```

删除确认由 `InquiriesManager` 编排，纯 View 只发送删除意图。

成功后：

- 从相关 inquiry list 缓存移除记录。
- 更新当前页 total。
- 删除当前选中项时清空 selectedId。
- 当前页删除最后一项且 page > 1 时回到上一页。

失败后保留列表与选区。

## 11. ViewModel 与 View

Controller 对 View 提供：

```ts
interface InquiriesViewModel {
  inquiries: Inquiry[];
  selectedInquiry: Inquiry | null;
  pendingCount: number;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  search: string;
  status: 'all' | InquiryStatus;
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;
}
```

Actions：

```ts
interface InquiriesActions {
  changeSearch(value: string): void;
  changeStatus(value): void;
  changePage(page: number): void;
  selectInquiry(id: number | null): void;
  updateStatus(id: number, status: InquiryStatus): Promise<void>;
  requestDelete(inquiry: Inquiry): Promise<void>;
  exportInquiry(inquiry: Inquiry): void;
  exportCurrentPage(): void;
  retry(): void;
}
```

`InquiriesView` 不知道 API、Query Key、Blob 内容或删除后的缓存策略。

## 12. 导出设计

纯函数：

```ts
buildInquiryText(inquiry: Inquiry): string
buildInquiriesCsv(inquiries: Inquiry[]): string
buildInquiryTextFilename(inquiry: Inquiry): string
buildInquiriesCsvFilename(date: Date): string
```

规则：

- TXT 导出单条详情。
- CSV 只导出当前服务端筛选页。
- CSV 所有单元格统一处理双引号、逗号和换行。
- 空值输出为空字符串或稳定占位符。
- 纯函数不访问 `document`、`URL` 或 Toast。

浏览器下载由 Controller 调用一个小型下载 helper，View 只发送导出事件。

## 13. 页面配置编辑

配置模型：

```ts
interface InquirySettings {
  title: Translation;
  description: Translation;
}
```

默认值保持当前文案不变。

数据流：

```text
pages 公共页面详情 Query
  ↓
读取 system-inquiry.content
  ↓
Mapper + Zod
  ↓
React Hook Form
  ↓
pages 公共保存能力
```

保存时必须：

- 保留 `system-inquiry` 的 id、path、title、type、blocks、seo 等字段。
- 只替换 `content`。
- 使用保存后的服务端页面 reset 表单。
- 不调用 `ContentContext.updatePage`。

`InquirySettingsView` 只接收表单能力、错误和提交事件。

## 14. 错误处理

- 列表首次加载失败：显示持久错误和重试入口。
- 后台 refetch 失败：保留已有列表。
- 状态更新失败：不做乐观缓存写入。
- 删除失败：保留记录和选区。
- 导出失败：显示简短 Toast。
- 配置加载失败：显示持久错误。
- 配置校验错误：显示在对应字段附近。
- 配置保存失败：保留脏表单。
- Toast 只承载短暂操作结果，不替代持久错误区域。

## 15. 测试策略

### API 测试

- 正确编码 `page/pageSize/status/search`。
- `status=all` 不发送 status 参数。
- PATCH 与 DELETE 使用正确路径和方法。

### Mapper 与导出测试

- DTO 字段转换。
- 非法 status 处理。
- null 字段。
- CSV 引号、逗号、换行和空值。
- TXT 内容与安全文件名。

### Controller 测试

- 搜索和状态变化重置页码。
- Query 使用完整 filters。
- selectedInquiry 从 Query 数据派生。
- 翻页后清理失效选区。
- 状态更新后的缓存变化。
- 删除当前项和当前页最后一项。
- 导出当前筛选页。

### Settings 测试

- 缺失 content 使用默认值。
- 非法 content 规范化。
- 保存只替换页面 content。
- 保存成功 reset。
- 保存失败保留草稿。

### View 测试

- 使用伪造 ViewModel 与 Actions。
- 搜索、状态、分页、选择、状态按钮、删除和导出事件。
- Settings 字段错误、提交、loading 和 saving。
- 不启动真实 API。

## 16. 迁移批次

### 第一批：API、类型与纯函数

- 建立 API、Query Keys、DTO、领域类型和 Mapper。
- 建立 TXT/CSV 导出纯函数。
- 补齐单元测试。

完成标准：无 UI 也能完成查询参数构建、DTO 转换和导出内容生成。

### 第二批：收件箱 Controller

- 建立列表 Query、筛选、分页和选区。
- 建立状态更新与删除 Mutation。
- 实现精确缓存更新。

完成标准：Hook 测试可完成完整收件箱流程。

### 第三批：收件箱 UI

- 拆分 Manager、View、List 和 Detail。
- 保持当前视觉。
- 接入服务端搜索与分页。

完成标准：View 不导入 API 或 Query。

### 第四批：页面配置

- 建立 Settings Schema、Mapper 和表单 Controller。
- 通过 pages 公共能力读取和保存。
- 迁移当前配置 UI。

完成标准：配置编辑器不依赖 ContentContext。

### 第五批：路由与清理

- 切换两条路由。
- 删除旧页面。
- 删除 `lib/api` 中询盘方法。
- 删除 ContentContext 中询盘遗留能力。
- 更新文档。

完成标准：所有 inquiries 能力由独立 feature 提供。

## 17. 强制架构规则

```text
inquiries/ui        不得导入 api 或 QueryClient
inquiries/api       不得导入 React
inquiries/model     不得依赖具体 View
settings            只能通过 pages 公共入口保存页面
pages               不得依赖 inquiries
View                不得使用 DTO 字段
导出纯函数           不得访问浏览器 API
```

## 18. 验收指标

- `/inquiries` 支持服务端搜索、状态筛选和分页。
- 搜索范围为姓名、邮箱和公司。
- CSV 导出明确为当前筛选页。
- selectedInquiry 不作为独立实体副本保存。
- 状态更新与删除只影响 inquiries 缓存。
- `/inquiry-editor` 使用 pages 公共能力保存配置。
- Settings View 可替换而不修改保存流程。
- UI 不直接调用 `lib/api` 或 `shared/api/client`。
- 旧 `InquiryManagement.tsx` 和 `InquiryEditor.tsx` 删除。
- `lib/api` 不再包含询盘管理方法。
- `ContentContext` 不再为 InquiryEditor 提供 `findPage/updatePage`。
- 两条路由与当前视觉主流程保持稳定。
- 关键 API、Mapper、导出、Hook 和 View 测试通过。

## 19. 后续方向

以下能力不进入本次迁移：

- 全量筛选结果导出。
- 询盘回复和邮件模板。
- 内部备注、负责人和标签。
- 批量操作。
- 询盘统计报表。

这些能力应在当前 Query、领域模型和 View 边界稳定后另立设计。
