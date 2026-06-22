# Phase 2c-1 — reviews 域试点（建立 package types/entities/adapters/screens 完整模式）实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 以 reviews 单域为试点，建立并验证 Phase 2c 的完整模式——`package/types`(业务类型) + `package/adapters`(EntityAdapter) + `package/entities`(EntityDefinition) + `package/ui/screens`(屏幕真身)，并把 `reviewEntity` 接入 `ProjectPackage.entities` 经 `defineProjectPackage` 校验；旧路径留兼容 shim，消费端零破坏。

**Architecture:** 沿用 2b 的「搬迁 + 兼容垫片」机制。reviews 的业务类型迁入 `package/types`（旧 `@/types` 留 `export *` shim）；新建自包含的 `reviewAdapter`(EntityAdapter) 与 `reviewEntity`(EntityDefinition)；reviews 的 4 个 UI 组件迁入 `package/ui/screens/reviews/`，其内部对 `@/ui/*`/`@/types` 的引用改指 `@/package/*`，对 model hooks 的引用改为临时 `@/features/reviews/model/*`(P4 前允许)；`screens.reviews` 由薄包装器换为真身；`entities: [reviewEntity]` 接入并校验。**core 在 P4 才消费 EntityDefinition，本期为「已定义 + 完整性校验、未接线驱动」。**

**Tech Stack:** React 19 + TS + Vite 7 + Vitest，别名 `@/*`→`src/*`，`verbatimModuleSyntax: true`。Windows + git bash。

## Global Constraints

- 别名 `@`→`./src`；JSX 文件必须 `.tsx`；纯类型/逻辑用 `.ts`。
- `verbatimModuleSyntax: true`：类型再导出用 `export type`，默认导出再导出用 `export { default }`。
- **不修改 `package.json`**（不新增依赖）。
- 依赖方向：`package` 可引 `@/core` 公开入口、`@/shared`；**迁移期临时允许** `package → @/features`（仅 reviews 的 model hooks）与 `package → @/types`(shim)，统一 P5 删。`core` 不得引 `package`。
- **本期范围仅 reviews 单域** + `package/{types,entities,adapters}` 目录脚手架。**不碰**其它 12 个域（后续 2c 批次）。
- reviews 的 `api/`、`model/`（hooks、schema、mapper、defaults、reviewMedia、review.types 的 `ReviewFormValues`）**留在 `@/features/reviews`**（P4 提取）；本期只搬 UI 与业务类型。
- 旧路径留兼容 re-export shim；消费端不改动。
- 每个 Task 结束跑 `npx tsc -b` + `npx vitest run`，全绿才提交。
- **提交只 `git add` 目标文件，严禁 `git add -A`**（会误提交 `.claude/`、`CLAUDE.md`、`docs/claudeChat.md`）。
- **避免 "too large"**：用 `git mv` + `sed`/精确编辑，不要把大批文件读入上下文；命令用 `-q`/`--stat`。

---

## 现状事实（实现者必读）

- **类型**（`src/types/review.ts`，经 `@/types` barrel 暴露）：
  - `CustomerReview`（Model）：`id:number; client_name:string; country:string|null; rating:number; media_type:'video'|'image'; media_url:string; review_text_zh:string; review_text_en:string; sort_order:number; status:'published'|'draft'; created_at:string; updated_at:string`。
  - `ReviewInput`（Input）：`client_name:string; country?:string; rating?:number; media_type:'video'|'image'; media_url:string; review_text_zh:string; review_text_en:string; sort_order?:number; status?:'published'|'draft'`。
  - `ReviewListFilters`（Filters，现在 `src/features/reviews/model/review.types.ts`，与 `ReviewFormValues` 同住）：`page:number; pageSize:number; search?:string; status?:'published'|'draft'`。
- **无独立 DTO**：`/api/admin/reviews` 直接返回 `CustomerReview` 形（列表包在 `{ data: CustomerReview[]; pagination:{...} }`）。`fromDto` 为恒等。
- **api**（`src/features/reviews/api/`）：`reviews.api.ts`（getReviews/createReview/updateReview/deleteReview）、`reviews.keys.ts`（reviewKeys）。端点 `/api/admin/reviews`。**留在 features**。
- **model**（`src/features/reviews/model/`）：`useReviewsList.ts`、`useReviewEditor.ts`、`review.mapper.ts`、`review.schema.ts`、`review.defaults.ts`、`reviewMedia.ts`、`review.types.ts`。**留在 features**。
- **UI**（`src/features/reviews/ui/`，本期搬迁）4 文件 + 各自 import：
  - `ReviewsManager.tsx`（具名 `ReviewsManager`，无 props/无路由参数）：`@/types`(CustomerReview)、`../model/useReviewsList`、`./ReviewsListView`、`./ReviewFormDialog`。
  - `ReviewsListView.tsx`（具名）：`framer-motion`、`lucide-react`、`@/types`(CustomerReview)。
  - `ReviewFormDialog.tsx`（具名）：`@/types`(CustomerReview)、`../model/useReviewEditor`、`./ReviewFormView`。
  - `ReviewFormView.tsx`（具名）：`lucide-react`、`react-hook-form`、`@/ui/primitives/{button,input,textarea,label}`、`@/ui/media/ImageInput`(default)、`../model/reviewMedia`、`../model/review.types`(ReviewFormValues type)。
- **barrel**：`src/features/reviews/index.ts` 仅 `export { ReviewsManager } from './ui/ReviewsManager';`。其唯一消费者是 `src/package/ui/screens/index.tsx`。
- **路由**（`src/package/routes/index.ts`）：`reviews` → path `reviews`，screenId `reviews`，menu group `misc`。单页，无独立 editor 路由。
- **契约**（`@/core/contracts`）：`AdminScreenProps = { routeId: string }`；`EntityAdapter<Model,Dto,Input>{ fromDto(dto):Model; toInput(model):Input; toRequest(input):unknown }`；`EntityDefinition<Model,Dto,Input,Filters>{ key; endpoint; adapter; capabilities:{list?,create?,update?,delete?}; defaultFilters?; screens:{list?,editor?} }`；`ProjectPackage.entities: EntityDefinition[]`，当前 `src/package/index.ts` 为 `entities: []`。`defineProjectPackage` 校验 entity.key 唯一且 `screens.list/editor` 引用的 id 存在于 `ui.screens`。

---

## Task 1: 脚手架 + reviews 业务类型迁入 `package/types`

**Files:**
- Create: `src/package/types/review.ts`、`src/package/types/index.ts`
- Create: `src/package/entities/index.ts`、`src/package/adapters/index.ts`（空 barrel，占位后续 Task 填充）
- Modify: `src/types/review.ts`（改为 `export *` shim）
- Modify: `src/features/reviews/model/review.types.ts`（`ReviewListFilters` 移出后改为从 package 再导出；保留 `ReviewFormValues`）
- Create: `src/package/types/review.test.ts`

**Interfaces:**
- Produces: `@/package/types` 暴露 `CustomerReview`、`ReviewInput`、`ReviewListFilters`。后续 Task 2/3 消费。

- [ ] **Step 1: 建 `src/package/types/review.ts`**（逐字）

```ts
export interface CustomerReview {
  id: number;
  client_name: string;
  country: string | null;
  rating: number;
  media_type: 'video' | 'image';
  media_url: string;
  review_text_zh: string;
  review_text_en: string;
  sort_order: number;
  status: 'published' | 'draft';
  created_at: string;
  updated_at: string;
}

export interface ReviewInput {
  client_name: string;
  country?: string;
  rating?: number;
  media_type: 'video' | 'image';
  media_url: string;
  review_text_zh: string;
  review_text_en: string;
  sort_order?: number;
  status?: 'published' | 'draft';
}

export interface ReviewListFilters {
  page: number;
  pageSize: number;
  search?: string;
  status?: 'published' | 'draft';
}
```

- [ ] **Step 2: 建 `src/package/types/index.ts`**

```ts
export * from './review';
```

- [ ] **Step 3: 建空 barrel 占位** — `src/package/entities/index.ts` 与 `src/package/adapters/index.ts`，各写：

```ts
export {};
```

- [ ] **Step 4: 改 `src/types/review.ts` 为 shim**

将文件内 `CustomerReview` 与 `ReviewInput` 的声明整体替换为：

```ts
export * from '@/package/types/review';
```

（若 `src/types/review.ts` 还含其它声明，一并迁入 `package/types/review.ts` 后此处仍用 `export *` 覆盖。）

- [ ] **Step 5: 改 `src/features/reviews/model/review.types.ts`** — 移除 `ReviewListFilters` 声明，改为再导出；`ReviewFormValues` 保留原样。在文件顶部加：

```ts
export type { ReviewListFilters } from '@/package/types';
```

并删除原 `ReviewListFilters` 的本地 `interface`/`type` 声明（保留 `ReviewFormValues`）。

- [ ] **Step 6: 写测试** — `src/package/types/review.test.ts`（类型存在性 + 结构守卫）

```ts
import { describe, it, expectTypeOf } from 'vitest';
import type { CustomerReview, ReviewInput, ReviewListFilters } from '@/package/types';

describe('package/types/review', () => {
  it('CustomerReview 含服务端字段', () => {
    expectTypeOf<CustomerReview>().toHaveProperty('id').toEqualTypeOf<number>();
    expectTypeOf<CustomerReview>().toHaveProperty('created_at').toEqualTypeOf<string>();
  });
  it('ReviewInput 为可创建子集', () => {
    expectTypeOf<ReviewInput>().toHaveProperty('client_name').toEqualTypeOf<string>();
  });
  it('ReviewListFilters 含分页', () => {
    expectTypeOf<ReviewListFilters>().toHaveProperty('page').toEqualTypeOf<number>();
  });
});
```

- [ ] **Step 7: 门禁**

Run: `npx tsc -b && npx vitest run`
Expected: tsc 无错（`@/types` 经 shim 仍解析 CustomerReview/ReviewInput；features 的 `ReviewListFilters` 经再导出仍可用）；vitest 全绿。

- [ ] **Step 8: 提交**

```bash
git add src/package/types src/package/entities/index.ts src/package/adapters/index.ts src/types/review.ts src/features/reviews/model/review.types.ts
git commit -q -m "feat(p2c-1): reviews 业务类型迁入 package/types + 脚手架 entities/adapters barrel"
```

---

## Task 2: `reviewAdapter`（EntityAdapter）

**Files:**
- Create: `src/package/adapters/review.adapter.ts`
- Create: `src/package/adapters/review.adapter.test.ts`
- Modify: `src/package/adapters/index.ts`（导出 reviewAdapter）

**Interfaces:**
- Consumes: `@/package/types` 的 `CustomerReview`、`ReviewInput`（Task 1）；`@/core/contracts` 的 `EntityAdapter`。
- Produces: `reviewAdapter: EntityAdapter<CustomerReview, CustomerReview, ReviewInput>`。Task 3 消费。

- [ ] **Step 1: 写失败测试** — `src/package/adapters/review.adapter.test.ts`

```ts
import { describe, it, expect } from 'vitest';
import { reviewAdapter } from '@/package/adapters/review.adapter';
import type { CustomerReview } from '@/package/types';

const model: CustomerReview = {
  id: 7, client_name: 'Acme', country: null, rating: 5,
  media_type: 'image', media_url: 'u', review_text_zh: 'z', review_text_en: 'e',
  sort_order: 2, status: 'published', created_at: 't1', updated_at: 't2',
};

describe('reviewAdapter', () => {
  it('fromDto 恒等返回（api 直返 Model 形）', () => {
    expect(reviewAdapter.fromDto(model)).toBe(model);
  });
  it('toInput 取可创建子集，country null→undefined', () => {
    expect(reviewAdapter.toInput(model)).toEqual({
      client_name: 'Acme', country: undefined, rating: 5,
      media_type: 'image', media_url: 'u', review_text_zh: 'z', review_text_en: 'e',
      sort_order: 2, status: 'published',
    });
  });
  it('toRequest 恒等返回 input 作为请求体', () => {
    const input = reviewAdapter.toInput(model);
    expect(reviewAdapter.toRequest(input)).toBe(input);
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `npx vitest run src/package/adapters/review.adapter.test.ts`
Expected: FAIL（无法解析 review.adapter）

- [ ] **Step 3: 实现 `src/package/adapters/review.adapter.ts`**

```ts
import type { EntityAdapter } from '@/core/contracts';
import type { CustomerReview, ReviewInput } from '@/package/types';

export const reviewAdapter: EntityAdapter<CustomerReview, CustomerReview, ReviewInput> = {
  fromDto(dto: CustomerReview): CustomerReview {
    return dto;
  },
  toInput(model: CustomerReview): ReviewInput {
    return {
      client_name: model.client_name,
      country: model.country ?? undefined,
      rating: model.rating,
      media_type: model.media_type,
      media_url: model.media_url,
      review_text_zh: model.review_text_zh,
      review_text_en: model.review_text_en,
      sort_order: model.sort_order,
      status: model.status,
    };
  },
  toRequest(input: ReviewInput): unknown {
    return input;
  },
};
```

- [ ] **Step 4: 导出** — `src/package/adapters/index.ts` 改为

```ts
export { reviewAdapter } from './review.adapter';
```

- [ ] **Step 5: 跑测试确认通过**

Run: `npx vitest run src/package/adapters/review.adapter.test.ts`
Expected: PASS（3/3）

- [ ] **Step 6: 门禁**

Run: `npx tsc -b && npx vitest run`
Expected: 全绿

- [ ] **Step 7: 提交**

```bash
git add src/package/adapters/review.adapter.ts src/package/adapters/review.adapter.test.ts src/package/adapters/index.ts
git commit -q -m "feat(p2c-1): reviewAdapter (EntityAdapter)"
```

---

## Task 3: `reviewEntity`（EntityDefinition）

**Files:**
- Create: `src/package/entities/review.entity.ts`
- Create: `src/package/entities/review.entity.test.ts`
- Modify: `src/package/entities/index.ts`（导出 reviewEntity）

**Interfaces:**
- Consumes: `reviewAdapter`（Task 2）、`@/package/types`（Task 1）、`@/core/contracts` 的 `EntityDefinition`。
- Produces: `reviewEntity: EntityDefinition<CustomerReview, CustomerReview, ReviewInput, ReviewListFilters>`，`key:'reviews'`，`screens.list:'reviews'`。Task 5 接入 ProjectPackage。

- [ ] **Step 1: 写失败测试** — `src/package/entities/review.entity.test.ts`

```ts
import { describe, it, expect } from 'vitest';
import { reviewEntity } from '@/package/entities/review.entity';
import { reviewAdapter } from '@/package/adapters/review.adapter';

describe('reviewEntity', () => {
  it('键、端点、能力、屏幕 id 正确', () => {
    expect(reviewEntity.key).toBe('reviews');
    expect(reviewEntity.endpoint).toBe('/api/admin/reviews');
    expect(reviewEntity.capabilities).toEqual({ list: true, create: true, update: true, delete: true });
    expect(reviewEntity.screens.list).toBe('reviews');
    expect(reviewEntity.adapter).toBe(reviewAdapter);
  });
  it('defaultFilters 含分页', () => {
    expect(reviewEntity.defaultFilters).toEqual({ page: 1, pageSize: 20 });
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `npx vitest run src/package/entities/review.entity.test.ts`
Expected: FAIL

- [ ] **Step 3: 实现 `src/package/entities/review.entity.ts`**

```ts
import type { EntityDefinition } from '@/core/contracts';
import type { CustomerReview, ReviewInput, ReviewListFilters } from '@/package/types';
import { reviewAdapter } from '@/package/adapters/review.adapter';

export const reviewEntity: EntityDefinition<
  CustomerReview,
  CustomerReview,
  ReviewInput,
  ReviewListFilters
> = {
  key: 'reviews',
  endpoint: '/api/admin/reviews',
  adapter: reviewAdapter,
  capabilities: { list: true, create: true, update: true, delete: true },
  defaultFilters: { page: 1, pageSize: 20 },
  screens: { list: 'reviews' },
};
```

- [ ] **Step 4: 导出** — `src/package/entities/index.ts` 改为

```ts
export { reviewEntity } from './review.entity';
```

- [ ] **Step 5: 跑测试确认通过 + 门禁**

Run: `npx vitest run src/package/entities/review.entity.test.ts && npx tsc -b && npx vitest run`
Expected: 全绿

- [ ] **Step 6: 提交**

```bash
git add src/package/entities/review.entity.ts src/package/entities/review.entity.test.ts src/package/entities/index.ts
git commit -q -m "feat(p2c-1): reviewEntity (EntityDefinition)"
```

---

## Task 4: reviews 屏幕真身迁入 `package/ui/screens/reviews`

**Files:**
- Move: `src/features/reviews/ui/{ReviewsManager,ReviewsListView,ReviewFormDialog,ReviewFormView}.tsx` → `src/package/ui/screens/reviews/`
- Modify: 被搬 4 文件的内部引用（见 Step 2 规则）
- Create: `src/package/ui/screens/reviews/index.ts`（导出 `ReviewsManager` + `ReviewsScreen`）
- Modify: `src/features/reviews/index.ts`（改为从 package 再导出 `ReviewsManager` 的 shim）

**Interfaces:**
- Consumes: `@/package/ui/primitives/*`、`@/package/ui/media/ImageInput`、`@/package/types`(CustomerReview)、临时 `@/features/reviews/model/*`(hooks/reviewMedia/review.types 的 ReviewFormValues)。
- Produces: `@/package/ui/screens/reviews` 暴露 `ReviewsManager`(具名组件) 与 `ReviewsScreen: ComponentType<AdminScreenProps>`。Task 5 注册到 screens map。

- [ ] **Step 1: 搬迁 4 个 UI 文件**

```bash
mkdir -p src/package/ui/screens/reviews
git mv src/features/reviews/ui/ReviewsManager.tsx src/features/reviews/ui/ReviewsListView.tsx src/features/reviews/ui/ReviewFormDialog.tsx src/features/reviews/ui/ReviewFormView.tsx src/package/ui/screens/reviews/
```

- [ ] **Step 2: 重写被搬文件内部引用**（同级 `./X` 不变；外部按下表 sed 批改）

```bash
find src/package/ui/screens/reviews -name '*.tsx' -exec sed -i \
  -e "s#@/ui/primitives/#@/package/ui/primitives/#g" \
  -e "s#'@/ui/media/ImageInput'#'@/package/ui/media/ImageInput'#g" \
  -e "s#'@/types'#'@/package/types'#g" \
  -e "s#\.\./model/#@/features/reviews/model/#g" {} +
```

（说明：`../model/useReviewsList`→`@/features/reviews/model/useReviewsList` 等，临时跨引 features model，P4 提取。`@/types`→`@/package/types` 因 reviews 类型已迁入；`@/ui/*`→`@/package/ui/*` 直指真身免经 shim。）

- [ ] **Step 3: 建屏幕 barrel** — `src/package/ui/screens/reviews/index.ts`

```ts
import type { ComponentType } from 'react';
import type { AdminScreenProps } from '@/core/contracts';
import { ReviewsManager } from './ReviewsManager';

export { ReviewsManager } from './ReviewsManager';

/** core 注入 AdminScreenProps；reviews 为无参单页，忽略 routeId。 */
export const ReviewsScreen: ComponentType<AdminScreenProps> = function ReviewsScreen() {
  return <ReviewsManager />;
};
```

注意：此文件含 JSX，**必须命名 `index.tsx`**（非 `.ts`）。请创建 `src/package/ui/screens/reviews/index.tsx`。

- [ ] **Step 4: 旧 features barrel 改为 shim** — `src/features/reviews/index.ts`

```ts
export { ReviewsManager } from '@/package/ui/screens/reviews';
```

- [ ] **Step 5: 门禁**

Run: `npx tsc -b && npx vitest run`
Expected: tsc 无错（被搬文件引用全部解析；`@/features/reviews` 经 shim 仍导出 ReviewsManager，screens/index.tsx 暂时仍引旧 barrel，下一 Task 切换）；vitest 全绿。

- [ ] **Step 6: 提交**

```bash
git add src/package/ui/screens/reviews src/features/reviews/ui src/features/reviews/index.ts
git commit -q -m "refactor(p2c-1): reviews 屏幕真身迁入 package/ui/screens，features 留 shim"
```

---

## Task 5: 接入 ProjectPackage——注册屏幕真身 + entities

**Files:**
- Modify: `src/package/ui/screens/index.tsx`（`reviews` 改用真身 `ReviewsScreen`，移除经 `@/features/reviews` 的 wrap）
- Modify: `src/package/index.ts`（`entities: [reviewEntity]`）
- Create: `src/package/index.test.ts`（projectPackage 完整性 + reviews entity 接入）

**Interfaces:**
- Consumes: `ReviewsScreen`(Task 4)、`reviewEntity`(Task 3)。
- Produces: `projectPackage.entities` 含 reviews；`screens.reviews` 为真身。

- [ ] **Step 1: 切换 screens 注册** — 编辑 `src/package/ui/screens/index.tsx`：
  - 删除第 18 行 `import { ReviewsManager } from '@/features/reviews';`
  - 在其它 screen import 处增加 `import { ReviewsScreen } from './reviews';`
  - 将 map 中 `reviews: wrap(ReviewsManager),` 改为 `reviews: ReviewsScreen,`

- [ ] **Step 2: 接入 entities** — 编辑 `src/package/index.ts`：

```ts
import { defineProjectPackage } from '@/core/app/defineProjectPackage';
import { identity } from './identity/config';
import { routes, menuGroups } from './routes';
import { projectUi } from './ui';
import { reviewEntity } from './entities';

export const projectPackage = defineProjectPackage({
  identity,
  menuGroups,
  routes,
  entities: [reviewEntity],
  ui: projectUi,
});

export default projectPackage;
```

- [ ] **Step 3: 写测试** — `src/package/index.test.ts`

```ts
import { describe, it, expect } from 'vitest';
import { projectPackage } from '@/package';

describe('projectPackage', () => {
  it('通过 defineProjectPackage 完整性校验（不抛错即已通过）', () => {
    expect(projectPackage.routes.length).toBeGreaterThan(0);
  });
  it('reviews entity 已接入且引用存在的 screen', () => {
    const reviews = projectPackage.entities.find((e) => e.key === 'reviews');
    expect(reviews).toBeDefined();
    expect(reviews!.screens.list).toBe('reviews');
    expect(projectPackage.ui.screens.reviews).toBeDefined();
  });
});
```

- [ ] **Step 4: 门禁**

Run: `npx tsc -b && npx vitest run`
Expected: tsc 无错；vitest 全绿（`defineProjectPackage` 不抛错——reviews entity 的 `screens.list:'reviews'` 在 `ui.screens` 存在）。

- [ ] **Step 5: 提交**

```bash
git add src/package/ui/screens/index.tsx src/package/index.ts src/package/index.test.ts
git commit -q -m "feat(p2c-1): 注册 reviews 屏幕真身 + reviewEntity 接入 projectPackage"
```

---

## Task 6: 验证、架构守卫与文档

**Files:**
- Create: `src/test/architecture/package-2c-reviews.test.ts`
- Modify: `docs/superpowers/plans/HANDOFF.md`（2c-1 完成 + 下一步）

**Interfaces:**
- Produces: 架构断言——reviews 屏幕真身在 `package/ui/screens/reviews`，旧 `features/reviews/ui` 已无非测试 UI 真身，`@/features/reviews` barrel 为 shim。

- [ ] **Step 1: 架构守卫测试** — `src/test/architecture/package-2c-reviews.test.ts`

```ts
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const SRC = join(process.cwd(), 'src');

describe('Phase 2c-1: reviews 已迁入 package', () => {
  it('屏幕真身落在 package/ui/screens/reviews', () => {
    for (const f of ['ReviewsManager.tsx', 'ReviewsListView.tsx', 'ReviewFormDialog.tsx', 'ReviewFormView.tsx']) {
      expect(existsSync(join(SRC, 'package/ui/screens/reviews', f)), f).toBe(true);
    }
  });
  it('reviews 业务类型与契约工件就位', () => {
    expect(existsSync(join(SRC, 'package/types/review.ts'))).toBe(true);
    expect(existsSync(join(SRC, 'package/adapters/review.adapter.ts'))).toBe(true);
    expect(existsSync(join(SRC, 'package/entities/review.entity.ts'))).toBe(true);
  });
  it('旧 features/reviews/index.ts 为 re-export shim', () => {
    const body = readFileSync(join(SRC, 'features/reviews/index.ts'), 'utf8').trim();
    expect(/^export \{[^}]*\} from '@\/package\/ui\/screens\/reviews';$/.test(body), body).toBe(true);
  });
});
```

- [ ] **Step 2: 跑架构测试 + 完整门禁（含 build）**

Run: `npx vitest run src/test/architecture/package-2c-reviews.test.ts && npx tsc -b && npx vitest run && npm run build`
Expected: 四者全绿。

- [ ] **Step 3: 更新 `HANDOFF.md`** — 「当前进度」加一行 **Phase 2c-1 完成**（reviews 试点：types/adapters/entities/screen 模式打通，reviewEntity 接入 projectPackage，旧址 shim）；「下一步」指向 **Phase 2c 后续批次**（按依赖：独立 CRUD → 枢纽 pages/navigation → 配置单例 company/footer → 特殊 page-builder/inquiries/admin），并记录模式模板：`package/types/<e>.ts` + `package/adapters/<e>.adapter.ts` + `package/entities/<e>.entity.ts` + `package/ui/screens/<e>/` + features barrel shim + 接入 entities。

- [ ] **Step 4: 提交**

```bash
git add src/test/architecture/package-2c-reviews.test.ts docs/superpowers/plans/HANDOFF.md
git commit -q -m "test(p2c-1): reviews 迁移架构守卫 + 更新交接文档"
```

---

## Self-Review

- **Spec 覆盖**：设计 §9（EntityDefinition/EntityAdapter）、§13（业务类型属 package）、§4（package/ui/screens）→ Task 1–5 全覆盖；路线图 2c「薄包装器→真身 + package/{types,entities,adapters}」→ reviews 单域完整打通。
- **Placeholder 扫描**：新文件均逐字给出；UI 搬迁用 sed 规则（非占位）；唯一条件分支（src/types/review.ts 若含额外声明）给出确定处理（`export *` 覆盖）。
- **类型一致**：`reviewAdapter` 的 `EntityAdapter<CustomerReview,CustomerReview,ReviewInput>` 与 `reviewEntity` 的 `EntityDefinition<...,ReviewListFilters>` 泛型贯穿一致；`ReviewsScreen: ComponentType<AdminScreenProps>` 与 screens map 值类型一致；`screens.list:'reviews'` 与 routes/screens 键一致。
- **边界**：package→features 仅限 reviews model hooks（迁移期临时，P4 提取）；package/ui/screens/reviews 的 `@/ui/*`→`@/package/ui/*` 直指真身；`@/types`→`@/package/types`。core 不被 package 污染。
- **JSX 命名**：`package/ui/screens/reviews/index.tsx`（含 JSX，非 `.ts`）——已在 Task 4 Step 3 标注。

## Execution Handoff

计划已保存。两种执行方式：
1. **Subagent-Driven（推荐）**：每 Task 派新 subagent（implementer→review→fix），Task 间复核。
2. **Inline Execution**：本会话按 executing-plans 批量执行 + 检查点。
