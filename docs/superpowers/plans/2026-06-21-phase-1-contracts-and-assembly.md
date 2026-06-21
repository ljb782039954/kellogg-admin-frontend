# Phase 1 — 契约与稳定装配点 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立 `core/contracts` 全部 TypeScript 契约、`defineProjectPackage`/`defineProjectUi` 开发期校验、`createAdminApp` 路由装配引擎，并用 test fixture 包驱动；新增 core 依赖边界测试——全部为纯新增，现有 App 继续运行。

**Architecture:** 三层 `core / shared / package`。本阶段只建 `core` 与 `shared/i18n`，不建 `package`（真实 Kellogg 包在 P2）。契约为纯类型，用 fixture 包做编译期验证；装配引擎用 React Router + Testing Library 做运行期验证。应用级 Provider（Query/Language）迁入 `core/app` 并在旧路径留兼容 re-export，使现有 `App.tsx`/`main.tsx` 不受影响。

**Tech Stack:** React 19、TypeScript 5.9（`verbatimModuleSyntax: true`、`strict: false`）、Vite 7、Vitest 4、Testing Library、react-router-dom 7、TanStack Query 5、sonner。

## Global Constraints

- 路径别名：`@/*` → `./src/*`（`@/` import 一律用别名，不用相对跨目录）。
- `verbatimModuleSyntax: true`：仅类型的导入/导出必须用 `import type` / `export type`。
- 依赖方向：`core` 只能导入 `@/core/*`、`@/shared/*` 与第三方 npm 包；**禁止** `core` 导入 `@/package|@/features|@/components|@/ui|@/app|@/context|@/types`。
- `core` 中禁止出现项目名（Kellogg）、具体实体名（Product/Blog）、具体 BlockType 字面量。
- 不新增 `package.json` 依赖。
- 双语文本类型统一 `Translation { zh: string; en: string }`。
- 测试命令：`npx vitest run <path>`；类型检查：`npx tsc -b`；构建：`npm run build`。
- 每个 Task 完成后 `npx tsc -b` 与 `npx vitest run`（全量）必须全绿。

## 已知遗留（不在本阶段处理，勿因其失败而修改无关代码）

- `src/shared/media/*` 仍依赖 `@/ui/*` 与 `@/types`(R2Image)；`src/shared/forms/controls/*` 仍依赖 `@/types`(Translation)。这些违反"shared 不依赖 ui/项目类型"，属于 **P4/P5** 清理。**本阶段的边界测试因此只全量约束 `core`，对 `shared` 仅约束新建的 `shared/i18n`。**

## 文件结构（本阶段创建/修改）

**创建：**
```text
src/shared/i18n/translation.ts            Translation / Language 规范定义
src/shared/i18n/translation.test.ts
src/core/contracts/icon.ts                IconName
src/core/contracts/identity.ts            ProjectIdentity
src/core/contracts/routing.ts             AdminRouteDefinition / AdminMenuPlacement
src/core/contracts/entity.ts              EntityDefinition / EntityAdapter / EntityCapabilities
src/core/contracts/page-builder.ts        CoreBlock / BlockDefinition / PageBuilderDefinition
src/core/contracts/ui.ts                  AdminScreenProps / BlockPreviewProps / BlockEditorProps / AdminShellDefinition / ProjectUiDefinition
src/core/contracts/package.ts             ProjectPackage
src/core/contracts/index.ts              （契约 barrel，唯一对外出口）
src/core/contracts/contracts.test.ts
src/test/fixtures/fakeProjectPackage.tsx  测试用最小合法 ProjectPackage
src/core/app/defineProjectUi.ts
src/core/app/defineProjectPackage.ts      validateProjectPackage + defineProjectPackage
src/core/app/defineProjectPackage.test.ts
src/core/app/queryClient.ts              （从 src/app/queryClient.ts 迁入）
src/core/app/QueryProvider.tsx           （从 src/app/providers/QueryProvider.tsx 迁入）
src/core/app/LanguageContext.tsx         （从 src/context/LanguageContext.tsx 迁入）
src/core/app/queryClient.test.ts          锁定新公共出口
src/core/routing/createAdminRouteElements.tsx
src/core/routing/createAdminRouteElements.test.tsx
src/core/app/AdminApp.tsx
src/core/app/AdminApp.test.tsx
src/core/app/createAdminApp.tsx
src/core/app/createAdminApp.test.tsx
src/test/architecture/dependency-boundaries.test.ts
```

**修改（改为兼容 re-export，保持现有 import 不变）：**
```text
src/types/common.ts                        Translation/Language 改为 re-export 自 shared/i18n
src/app/queryClient.ts                      re-export 自 core/app/queryClient
src/app/providers/QueryProvider.tsx         re-export 自 core/app/QueryProvider
src/context/LanguageContext.tsx             re-export 自 core/app/LanguageContext
```

---

## Task 1：Translation / Language 移入 shared/i18n

**Files:**
- Create: `src/shared/i18n/translation.ts`
- Create: `src/shared/i18n/translation.test.ts`
- Modify: `src/types/common.ts:1-8`

**Interfaces:**
- Produces: `Translation { zh: string; en: string }`、`type Language = 'zh' | 'en'`，导出自 `@/shared/i18n/translation`，并经 `@/types` re-export 保持向后兼容。

- [ ] **Step 1: 写失败测试**

`src/shared/i18n/translation.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import type { Translation } from '@/shared/i18n/translation';
import type { Translation as TranslationFromTypes } from '@/types';

describe('shared/i18n translation', () => {
  it('Translation 在 @/types 与 @/shared/i18n 之间结构一致（re-export 生效）', () => {
    const a: Translation = { zh: '你好', en: 'Hello' };
    const b: TranslationFromTypes = a; // 双向可赋值 → 同一类型
    expect(b).toEqual({ zh: '你好', en: 'Hello' });
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/shared/i18n/translation.test.ts`
Expected: FAIL（`Cannot find module '@/shared/i18n/translation'`）

- [ ] **Step 3: 创建规范定义**

`src/shared/i18n/translation.ts`:
```ts
/** 界面支持的语言。 */
export type Language = 'zh' | 'en';

/** 双语文本值对象。 */
export interface Translation {
  zh: string;
  en: string;
}
```

- [ ] **Step 4: 改 types/common.ts 为 re-export**

将 `src/types/common.ts` 顶部第 1-8 行（`Language` 与 `Translation` 的定义）替换为：
```ts
export type { Language, Translation } from '@/shared/i18n/translation';
```
保留文件其余内容（`LinkType`、`NavLink`、`R2Image`）不变。

- [ ] **Step 5: 运行测试确认通过 + 类型检查**

Run: `npx vitest run src/shared/i18n/translation.test.ts && npx tsc -b`
Expected: PASS；tsc 无错误。

- [ ] **Step 6: 跑全量测试确保未破坏既有引用**

Run: `npx vitest run`
Expected: 全绿（所有从 `@/types` 取 `Translation`/`Language` 的现有模块照常工作）。

- [ ] **Step 7: 提交**

```bash
git add src/shared/i18n/translation.ts src/shared/i18n/translation.test.ts src/types/common.ts
git commit -m "refactor(p1): 将 Translation/Language 规范定义移入 shared/i18n"
```

---

## Task 2：core/contracts 契约类型 + fixture 包

**Files:**
- Create: `src/core/contracts/{icon,identity,routing,entity,page-builder,ui,package,index}.ts`
- Create: `src/core/contracts/contracts.test.ts`
- Create: `src/test/fixtures/fakeProjectPackage.tsx`

**Interfaces:**
- Consumes: `Translation`、`Language`（`@/shared/i18n/translation`）。
- Produces（全部经 `@/core/contracts` barrel 导出）：`IconName`、`ProjectIdentity`、`AdminMenuPlacement`、`AdminRouteDefinition`、`EntityCapabilities`、`EntityAdapter<Model,Dto,Input>`、`EntityDefinition<Model,Dto,Input,Filters>`、`CoreBlock<Type,Content>`、`BlockDefinition<Block,Resources>`、`PageBuilderDefinition<Block,Resources>`、`AdminScreenProps`、`BlockPreviewProps<Content,Resources>`、`BlockEditorProps<Content,Resources>`、`AdminShellDefinition`、`ProjectUiDefinition`、`ProjectPackage`。
- Produces：`fakeProjectPackage: ProjectPackage`（`@/test/fixtures/fakeProjectPackage`）。

- [ ] **Step 1: 写失败的编译期 + 运行期测试（先建 fixture 与 smoke 测试）**

`src/test/fixtures/fakeProjectPackage.tsx`:
```tsx
import type { ReactNode } from 'react';
import type { ProjectPackage } from '@/core/contracts';

function Screen() {
  return <div>screen</div>;
}
function BlockView() {
  return <div>view</div>;
}
function BlockEditor() {
  return <div>editor</div>;
}
function Layout({ children }: { children: ReactNode }) {
  return <div data-testid="layout">{children}</div>;
}
function LoginPage() {
  return <div>login</div>;
}
function ErrorPage() {
  return <div>error</div>;
}

/** 测试用最小合法项目包：所有 screenId/previewId/editorId 均可解析。 */
export const fakeProjectPackage: ProjectPackage = {
  identity: {
    key: 'fake',
    name: { zh: '测试', en: 'Fake' },
    languages: ['zh', 'en'],
    defaultLanguage: 'zh',
  },
  routes: [
    {
      id: 'dashboard',
      path: 'dashboard',
      title: { zh: '概览', en: 'Dashboard' },
      menu: { group: 'main', order: 1 },
      screenId: 'dashboard',
    },
  ],
  entities: [
    {
      key: 'widget',
      endpoint: '/widgets',
      adapter: {
        fromDto: (dto) => dto,
        toInput: (model) => model,
        toRequest: (input) => input,
      },
      capabilities: { list: true },
      screens: { list: 'widget-list' },
    },
  ],
  pageBuilder: {
    blocks: [
      {
        type: 'hero',
        title: { zh: '英雄', en: 'Hero' },
        category: 'content',
        icon: 'Square',
        create: () => ({ id: 'b1', type: 'hero', content: {}, isVisible: true }),
        previewId: 'hero',
        editorId: 'hero',
      },
    ],
  },
  ui: {
    shell: { Layout, LoginPage, ErrorPage },
    screens: { dashboard: Screen, 'widget-list': Screen },
    blockViews: { hero: BlockView },
    blockEditors: { hero: BlockEditor },
  },
};
```

`src/core/contracts/contracts.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { fakeProjectPackage } from '@/test/fixtures/fakeProjectPackage';

describe('core/contracts', () => {
  it('fixture 包满足 ProjectPackage 契约', () => {
    expect(fakeProjectPackage.identity.key).toBe('fake');
    expect(fakeProjectPackage.routes).toHaveLength(1);
    expect(fakeProjectPackage.ui.screens.dashboard).toBeTypeOf('function');
    expect(fakeProjectPackage.pageBuilder?.blocks[0]?.type).toBe('hero');
  });
});
```

- [ ] **Step 2: 运行确认失败**

Run: `npx vitest run src/core/contracts/contracts.test.ts`
Expected: FAIL（`Cannot find module '@/core/contracts'`）

- [ ] **Step 3: 创建契约类型文件**

`src/core/contracts/icon.ts`:
```ts
/** Lucide 图标名称。运行期为字符串，package 构建期校验有效性。 */
export type IconName = string;
```

`src/core/contracts/identity.ts`:
```ts
import type { Language, Translation } from '@/shared/i18n/translation';

export interface ProjectIdentity {
  /** 项目唯一标识，如 'kellogg'。 */
  key: string;
  /** 品牌名称。 */
  name: Translation;
  /** Logo 资源路径或 URL。 */
  logo?: string;
  /** 支持的语言。 */
  languages: Language[];
  /** 默认语言。 */
  defaultLanguage: Language;
}
```

`src/core/contracts/routing.ts`:
```ts
import type { Translation } from '@/shared/i18n/translation';
import type { IconName } from './icon';

export interface AdminMenuPlacement {
  group: string;
  order: number;
}

export interface AdminRouteDefinition {
  id: string;
  path: string;
  title: Translation;
  icon?: IconName;
  menu?: AdminMenuPlacement;
  /** 指向 ProjectUiDefinition.screens 的注册 id。 */
  screenId: string;
}
```

`src/core/contracts/entity.ts`:
```ts
export interface EntityCapabilities {
  list?: boolean;
  create?: boolean;
  update?: boolean;
  delete?: boolean;
}

export interface EntityAdapter<Model, Dto, Input> {
  fromDto(dto: Dto): Model;
  toInput(model: Model): Input;
  toRequest(input: Input): unknown;
}

export interface EntityDefinition<
  Model = unknown,
  Dto = unknown,
  Input = unknown,
  Filters = unknown,
> {
  key: string;
  endpoint: string;
  adapter: EntityAdapter<Model, Dto, Input>;
  capabilities: EntityCapabilities;
  defaultFilters?: Filters;
  screens: {
    list?: string;
    editor?: string;
  };
}
```

`src/core/contracts/page-builder.ts`:
```ts
import type { Translation } from '@/shared/i18n/translation';
import type { IconName } from './icon';

/** core 对 Block 的唯一认知；具体 Block 联合类型由 package 定义。 */
export interface CoreBlock<Type extends string = string, Content = unknown> {
  id: string;
  type: Type;
  content: Content;
  isVisible: boolean;
}

export interface BlockDefinition<
  Block extends CoreBlock = CoreBlock,
  Resources = unknown,
> {
  type: Block['type'];
  title: Translation;
  category: string;
  icon: IconName;
  singleton?: boolean;
  create(): Block;
  /** 指向 ProjectUiDefinition.blockViews 的注册 id。 */
  previewId: string;
  /** 指向 ProjectUiDefinition.blockEditors 的注册 id。 */
  editorId: string;
}

export interface PageBuilderDefinition<
  Block extends CoreBlock = CoreBlock,
  Resources = unknown,
> {
  blocks: BlockDefinition<Block, Resources>[];
  // 资源加载器与页面 DTO Adapter 在 P3 扩充
}
```

`src/core/contracts/ui.ts`:
```ts
import type { ComponentType, ReactNode } from 'react';

/** core 注入给业务 screen 的通用服务；具体形状在 P4 扩充。 */
export interface AdminScreenProps {
  routeId: string;
}

export interface BlockPreviewProps<Content = unknown, Resources = unknown> {
  content: Content;
  resources: Resources;
}

export interface BlockEditorProps<Content = unknown, Resources = unknown> {
  content: Content;
  resources: Resources;
  onChange(next: Content): void;
}

export interface AdminShellDefinition {
  Layout: ComponentType<{ children: ReactNode }>;
  LoginPage: ComponentType;
  ErrorPage: ComponentType<{ error?: unknown }>;
}

export interface ProjectUiDefinition {
  shell: AdminShellDefinition;
  screens: Record<string, ComponentType<AdminScreenProps>>;
  blockViews: Record<string, ComponentType<BlockPreviewProps>>;
  blockEditors: Record<string, ComponentType<BlockEditorProps>>;
}
```

`src/core/contracts/package.ts`:
```ts
import type { ProjectIdentity } from './identity';
import type { AdminRouteDefinition } from './routing';
import type { EntityDefinition } from './entity';
import type { PageBuilderDefinition } from './page-builder';
import type { ProjectUiDefinition } from './ui';

export interface ProjectPackage {
  identity: ProjectIdentity;
  routes: AdminRouteDefinition[];
  entities: EntityDefinition[];
  pageBuilder?: PageBuilderDefinition;
  ui: ProjectUiDefinition;
}
```

`src/core/contracts/index.ts`:
```ts
export type { IconName } from './icon';
export type { ProjectIdentity } from './identity';
export type { AdminMenuPlacement, AdminRouteDefinition } from './routing';
export type {
  EntityCapabilities,
  EntityAdapter,
  EntityDefinition,
} from './entity';
export type {
  CoreBlock,
  BlockDefinition,
  PageBuilderDefinition,
} from './page-builder';
export type {
  AdminScreenProps,
  BlockPreviewProps,
  BlockEditorProps,
  AdminShellDefinition,
  ProjectUiDefinition,
} from './ui';
export type { ProjectPackage } from './package';
```

- [ ] **Step 4: 运行确认通过 + 类型检查（编译期契约验证）**

Run: `npx vitest run src/core/contracts/contracts.test.ts && npx tsc -b`
Expected: PASS；tsc 无错误（`fakeProjectPackage: ProjectPackage` 编译通过即证明契约自洽且可用）。

- [ ] **Step 5: 提交**

```bash
git add src/core/contracts src/test/fixtures/fakeProjectPackage.tsx
git commit -m "feat(p1): 建立 core/contracts 全部项目包契约与测试 fixture"
```

---

## Task 3：defineProjectUi / defineProjectPackage 开发期校验

**Files:**
- Create: `src/core/app/defineProjectUi.ts`
- Create: `src/core/app/defineProjectPackage.ts`
- Create: `src/core/app/defineProjectPackage.test.ts`

**Interfaces:**
- Consumes: `ProjectPackage`、`ProjectUiDefinition`（`@/core/contracts`）；`fakeProjectPackage`（fixture）。
- Produces:
  - `defineProjectUi(ui: ProjectUiDefinition): ProjectUiDefinition`（缺 shell 成员时抛错）。
  - `validateProjectPackage(pkg: ProjectPackage): string[]`（返回错误消息数组，空数组表示通过）。
  - `defineProjectPackage(pkg: ProjectPackage): ProjectPackage`（校验失败时抛聚合错误，否则原样返回）。

- [ ] **Step 1: 写失败测试**

`src/core/app/defineProjectPackage.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import {
  defineProjectPackage,
  validateProjectPackage,
} from './defineProjectPackage';
import { defineProjectUi } from './defineProjectUi';
import { fakeProjectPackage } from '@/test/fixtures/fakeProjectPackage';
import type { ProjectPackage } from '@/core/contracts';

function clone(): ProjectPackage {
  return structuredClone
    ? structuredCloneWithFns(fakeProjectPackage)
    : fakeProjectPackage;
}
// structuredClone 会丢失函数，这里改用浅拷贝 + 手动复制需要修改的数组
function structuredCloneWithFns(pkg: ProjectPackage): ProjectPackage {
  return {
    ...pkg,
    routes: pkg.routes.map((r) => ({ ...r })),
    entities: pkg.entities.map((e) => ({ ...e })),
    pageBuilder: pkg.pageBuilder
      ? { ...pkg.pageBuilder, blocks: pkg.pageBuilder.blocks.map((b) => ({ ...b })) }
      : undefined,
    ui: { ...pkg.ui, screens: { ...pkg.ui.screens } },
  };
}

describe('validateProjectPackage', () => {
  it('合法包返回空错误数组', () => {
    expect(validateProjectPackage(fakeProjectPackage)).toEqual([]);
  });

  it('检出重复 route id', () => {
    const pkg = clone();
    pkg.routes = [pkg.routes[0], { ...pkg.routes[0] }];
    const errors = validateProjectPackage(pkg);
    expect(errors.some((e) => e.includes('route id'))).toBe(true);
  });

  it('检出缺失的 screenId', () => {
    const pkg = clone();
    pkg.routes = [{ ...pkg.routes[0], screenId: 'missing' }];
    const errors = validateProjectPackage(pkg);
    expect(errors.some((e) => e.includes('missing'))).toBe(true);
  });

  it('检出重复 block type', () => {
    const pkg = clone();
    const block = pkg.pageBuilder!.blocks[0];
    pkg.pageBuilder!.blocks = [block, { ...block }];
    const errors = validateProjectPackage(pkg);
    expect(errors.some((e) => e.includes('block type'))).toBe(true);
  });

  it('检出缺失的 previewId / editorId', () => {
    const pkg = clone();
    pkg.pageBuilder!.blocks = [
      { ...pkg.pageBuilder!.blocks[0], previewId: 'nope', editorId: 'nope' },
    ];
    const errors = validateProjectPackage(pkg);
    expect(errors.some((e) => e.includes('previewId'))).toBe(true);
    expect(errors.some((e) => e.includes('editorId'))).toBe(true);
  });
});

describe('defineProjectPackage', () => {
  it('合法包原样返回', () => {
    expect(defineProjectPackage(fakeProjectPackage)).toBe(fakeProjectPackage);
  });

  it('非法包抛出聚合错误', () => {
    const pkg = clone();
    pkg.routes = [{ ...pkg.routes[0], screenId: 'missing' }];
    expect(() => defineProjectPackage(pkg)).toThrow(/校验失败/);
  });
});

describe('defineProjectUi', () => {
  it('缺少 shell 成员时抛错', () => {
    expect(() =>
      defineProjectUi({
        // @ts-expect-error 故意缺少 LoginPage/ErrorPage 以触发校验
        shell: { Layout: () => null },
        screens: {},
        blockViews: {},
        blockEditors: {},
      }),
    ).toThrow(/shell/);
  });
});
```

- [ ] **Step 2: 运行确认失败**

Run: `npx vitest run src/core/app/defineProjectPackage.test.ts`
Expected: FAIL（`Cannot find module './defineProjectPackage'`）

- [ ] **Step 3: 实现 defineProjectUi**

`src/core/app/defineProjectUi.ts`:
```ts
import type { ProjectUiDefinition } from '@/core/contracts';

/** 类型收窄 + 开发期校验 shell 完整性，原样返回 ui。 */
export function defineProjectUi(ui: ProjectUiDefinition): ProjectUiDefinition {
  const { shell } = ui;
  if (!shell?.Layout || !shell?.LoginPage || !shell?.ErrorPage) {
    throw new Error('[projectUi] shell 必须提供 Layout、LoginPage 与 ErrorPage');
  }
  return ui;
}
```

- [ ] **Step 4: 实现 validateProjectPackage + defineProjectPackage**

`src/core/app/defineProjectPackage.ts`:
```ts
import type { ProjectPackage } from '@/core/contracts';
import { defineProjectUi } from './defineProjectUi';

/** 返回项目包的所有完整性错误；空数组表示通过。 */
export function validateProjectPackage(pkg: ProjectPackage): string[] {
  const errors: string[] = [];

  const routeIds = new Set<string>();
  const routePaths = new Set<string>();
  for (const route of pkg.routes) {
    if (routeIds.has(route.id)) errors.push(`重复的 route id: ${route.id}`);
    routeIds.add(route.id);
    if (routePaths.has(route.path)) errors.push(`重复的 route path: ${route.path}`);
    routePaths.add(route.path);
    if (!pkg.ui.screens[route.screenId]) {
      errors.push(
        `route "${route.id}" 引用的 screenId "${route.screenId}" 不存在于 ui.screens`,
      );
    }
  }

  const entityKeys = new Set<string>();
  for (const entity of pkg.entities) {
    if (entityKeys.has(entity.key)) errors.push(`重复的 entity key: ${entity.key}`);
    entityKeys.add(entity.key);
    for (const screenId of [entity.screens.list, entity.screens.editor]) {
      if (screenId && !pkg.ui.screens[screenId]) {
        errors.push(
          `entity "${entity.key}" 引用的 screenId "${screenId}" 不存在于 ui.screens`,
        );
      }
    }
  }

  const blockTypes = new Set<string>();
  for (const block of pkg.pageBuilder?.blocks ?? []) {
    if (blockTypes.has(block.type)) errors.push(`重复的 block type: ${block.type}`);
    blockTypes.add(block.type);
    if (!pkg.ui.blockViews[block.previewId]) {
      errors.push(
        `block "${block.type}" 的 previewId "${block.previewId}" 不存在于 ui.blockViews`,
      );
    }
    if (!pkg.ui.blockEditors[block.editorId]) {
      errors.push(
        `block "${block.type}" 的 editorId "${block.editorId}" 不存在于 ui.blockEditors`,
      );
    }
  }

  return errors;
}

/** 类型收窄 + 开发期完整性校验；失败抛聚合错误，成功原样返回。 */
export function defineProjectPackage(pkg: ProjectPackage): ProjectPackage {
  defineProjectUi(pkg.ui);
  const errors = validateProjectPackage(pkg);
  if (errors.length > 0) {
    throw new Error(`[projectPackage] 校验失败:\n- ${errors.join('\n- ')}`);
  }
  return pkg;
}
```

- [ ] **Step 5: 运行确认通过 + 类型检查**

Run: `npx vitest run src/core/app/defineProjectPackage.test.ts && npx tsc -b`
Expected: PASS；tsc 无错误。

- [ ] **Step 6: 提交**

```bash
git add src/core/app/defineProjectUi.ts src/core/app/defineProjectPackage.ts src/core/app/defineProjectPackage.test.ts
git commit -m "feat(p1): 实现 defineProjectPackage/defineProjectUi 开发期校验"
```

---

## Task 4：应用级 Provider 迁入 core/app（含兼容 re-export）

**Files:**
- Create: `src/core/app/queryClient.ts`（迁自 `src/app/queryClient.ts`）
- Create: `src/core/app/QueryProvider.tsx`（迁自 `src/app/providers/QueryProvider.tsx`）
- Create: `src/core/app/LanguageContext.tsx`（迁自 `src/context/LanguageContext.tsx`）
- Create: `src/core/app/queryClient.test.ts`
- Modify: `src/app/queryClient.ts`（改为 re-export）
- Modify: `src/app/providers/QueryProvider.tsx`（改为 re-export）
- Modify: `src/context/LanguageContext.tsx`（改为 re-export）

**Interfaces:**
- Produces:
  - `@/core/app/queryClient`：`createAppQueryClient(): QueryClient`、`queryClient`。
  - `@/core/app/QueryProvider`：`QueryProvider`（props `{ children, client? }`）。
  - `@/core/app/LanguageContext`：`LanguageProvider`、`useLanguage()`。
- 旧路径 `@/app/queryClient`、`@/app/providers/QueryProvider`、`@/context/LanguageContext` 继续可用（re-export）。

- [ ] **Step 1: 写失败测试（锁定新 core 出口）**

`src/core/app/queryClient.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { createAppQueryClient, queryClient } from './queryClient';

describe('core/app queryClient', () => {
  it('createAppQueryClient 返回带默认配置的 QueryClient', () => {
    const client = createAppQueryClient();
    expect(client.getDefaultOptions().queries?.staleTime).toBe(30_000);
  });

  it('导出单例 queryClient', () => {
    expect(queryClient).toBeDefined();
  });
});
```

- [ ] **Step 2: 运行确认失败**

Run: `npx vitest run src/core/app/queryClient.test.ts`
Expected: FAIL（`Cannot find module './queryClient'`）

- [ ] **Step 3: 迁入 queryClient 到 core/app**

`src/core/app/queryClient.ts`（内容迁自原文件，import 路径不变——`@/shared/api/errors` 属 shared，合法）:
```ts
import { QueryClient } from '@tanstack/react-query';
import { isAppError } from '@/shared/api/errors';

function shouldRetryQuery(failureCount: number, error: Error): boolean {
  if (isAppError(error) && error.status !== undefined && error.status < 500) {
    return false;
  }
  return failureCount < 1;
}

export function createAppQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        retry: shouldRetryQuery,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

export const queryClient = createAppQueryClient();
```

- [ ] **Step 4: 迁入 QueryProvider 到 core/app**

`src/core/app/QueryProvider.tsx`:
```tsx
import type { ReactNode } from 'react';
import { QueryClientProvider, type QueryClient } from '@tanstack/react-query';
import { queryClient } from './queryClient';

interface QueryProviderProps {
  children: ReactNode;
  client?: QueryClient;
}

export function QueryProvider({
  children,
  client = queryClient,
}: QueryProviderProps) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
```

- [ ] **Step 5: 迁入 LanguageContext 到 core/app（修正 Language import 来源）**

`src/core/app/LanguageContext.tsx`:
```tsx
import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Language } from '@/shared/i18n/translation';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (zh: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('zh');

  const t = (zh: string, en: string): string => (language === 'zh' ? zh : en);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
```

- [ ] **Step 6: 把旧路径改为兼容 re-export**

`src/app/queryClient.ts`（整文件替换）:
```ts
export * from '@/core/app/queryClient';
```

`src/app/providers/QueryProvider.tsx`（整文件替换）:
```tsx
export { QueryProvider } from '@/core/app/QueryProvider';
```

`src/context/LanguageContext.tsx`（整文件替换）:
```tsx
export { LanguageProvider, useLanguage } from '@/core/app/LanguageContext';
```

- [ ] **Step 7: 运行新测试 + 全量测试 + 类型检查**

Run: `npx vitest run && npx tsc -b`
Expected: 全绿。`src/app/queryClient.test.ts`、`src/app/providers/QueryProvider.test.tsx` 经 re-export 照常通过；现有 `App.tsx`/`main.tsx` 不受影响。

- [ ] **Step 8: 提交**

```bash
git add src/core/app/queryClient.ts src/core/app/QueryProvider.tsx src/core/app/LanguageContext.tsx src/core/app/queryClient.test.ts src/app/queryClient.ts src/app/providers/QueryProvider.tsx src/context/LanguageContext.tsx
git commit -m "refactor(p1): 应用级 Provider 迁入 core/app 并保留兼容 re-export"
```

---

## Task 5：createAdminRouteElements / AdminApp / createAdminApp 路由装配引擎

**Files:**
- Create: `src/core/routing/createAdminRouteElements.tsx`
- Create: `src/core/routing/createAdminRouteElements.test.tsx`
- Create: `src/core/app/AdminApp.tsx`
- Create: `src/core/app/AdminApp.test.tsx`
- Create: `src/core/app/createAdminApp.tsx`
- Create: `src/core/app/createAdminApp.test.tsx`

**Interfaces:**
- Consumes: `ProjectPackage`（`@/core/contracts`）；`QueryProvider`、`LanguageProvider`（`@/core/app`）；`fakeProjectPackage`。
- Produces:
  - `createAdminRouteElements(pkg: ProjectPackage): ReactElement`（`<Routes>` 树：shell.Layout 包裹 `<Outlet/>`，index 重定向到首个 route，其余按 screenId 渲染 screen）。
  - `AdminApp({ projectPackage }: { projectPackage: ProjectPackage }): ReactElement`。
  - `createAdminApp(projectPackage: ProjectPackage): { mount(container?: HTMLElement): void }`。

- [ ] **Step 1: 写失败测试（路由元素）**

`src/core/routing/createAdminRouteElements.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { createAdminRouteElements } from './createAdminRouteElements';
import { fakeProjectPackage } from '@/test/fixtures/fakeProjectPackage';

describe('createAdminRouteElements', () => {
  it('按 path 渲染对应 screen，并被 shell.Layout 包裹', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        {createAdminRouteElements(fakeProjectPackage)}
      </MemoryRouter>,
    );
    expect(screen.getByTestId('layout')).toBeInTheDocument();
    expect(screen.getByText('screen')).toBeInTheDocument();
  });

  it('根路径重定向到首个 route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        {createAdminRouteElements(fakeProjectPackage)}
      </MemoryRouter>,
    );
    expect(screen.getByText('screen')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 运行确认失败**

Run: `npx vitest run src/core/routing/createAdminRouteElements.test.tsx`
Expected: FAIL（模块不存在）

- [ ] **Step 3: 实现 createAdminRouteElements**

`src/core/routing/createAdminRouteElements.tsx`:
```tsx
import type { ReactElement } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import type { ProjectPackage } from '@/core/contracts';

/** 根据项目包定义构建后台路由树：shell.Layout 包裹 Outlet，按 screenId 渲染 screen。 */
export function createAdminRouteElements(pkg: ProjectPackage): ReactElement {
  const { shell, screens } = pkg.ui;
  const Layout = shell.Layout;
  const firstPath = pkg.routes[0]?.path;

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Outlet />
          </Layout>
        }
      >
        {firstPath && (
          <Route index element={<Navigate to={firstPath} replace />} />
        )}
        {pkg.routes.map((route) => {
          const Screen = screens[route.screenId];
          return (
            <Route
              key={route.id}
              path={route.path}
              element={<Screen routeId={route.id} />}
            />
          );
        })}
      </Route>
    </Routes>
  );
}
```

- [ ] **Step 4: 运行确认通过**

Run: `npx vitest run src/core/routing/createAdminRouteElements.test.tsx`
Expected: PASS

- [ ] **Step 5: 写失败测试（AdminApp）**

`src/core/app/AdminApp.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AdminApp } from './AdminApp';
import { fakeProjectPackage } from '@/test/fixtures/fakeProjectPackage';

describe('AdminApp', () => {
  it('在 Provider + Router 下渲染项目包的首个 screen', async () => {
    render(<AdminApp projectPackage={fakeProjectPackage} />);
    expect(await screen.findByText('screen')).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: 运行确认失败**

Run: `npx vitest run src/core/app/AdminApp.test.tsx`
Expected: FAIL（模块不存在）

- [ ] **Step 7: 实现 AdminApp**

`src/core/app/AdminApp.tsx`:
```tsx
import type { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import type { ProjectPackage } from '@/core/contracts';
import { QueryProvider } from './QueryProvider';
import { LanguageProvider } from './LanguageContext';
import { createAdminRouteElements } from '@/core/routing/createAdminRouteElements';

export function AdminApp({
  projectPackage,
}: {
  projectPackage: ProjectPackage;
}): ReactElement {
  return (
    <QueryProvider>
      <LanguageProvider>
        <BrowserRouter>{createAdminRouteElements(projectPackage)}</BrowserRouter>
        <Toaster position="top-right" richColors />
      </LanguageProvider>
    </QueryProvider>
  );
}
```

- [ ] **Step 8: 运行确认通过**

Run: `npx vitest run src/core/app/AdminApp.test.tsx`
Expected: PASS

- [ ] **Step 9: 写失败测试（createAdminApp）**

`src/core/app/createAdminApp.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { createAdminApp } from './createAdminApp';
import { fakeProjectPackage } from '@/test/fixtures/fakeProjectPackage';

describe('createAdminApp', () => {
  it('返回带 mount 方法的句柄', () => {
    const handle = createAdminApp(fakeProjectPackage);
    expect(handle.mount).toBeTypeOf('function');
  });

  it('mount 将应用渲染进给定容器', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    createAdminApp(fakeProjectPackage).mount(container);
    await new Promise((r) => setTimeout(r, 0));
    expect(container.textContent).toContain('screen');
    container.remove();
  });
});
```

- [ ] **Step 10: 运行确认失败**

Run: `npx vitest run src/core/app/createAdminApp.test.tsx`
Expected: FAIL（模块不存在）

- [ ] **Step 11: 实现 createAdminApp**

`src/core/app/createAdminApp.tsx`:
```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import type { ProjectPackage } from '@/core/contracts';
import { AdminApp } from './AdminApp';

export interface AdminAppHandle {
  mount(container?: HTMLElement): void;
}

/** 稳定应用入口：createAdminApp(projectPackage).mount()。 */
export function createAdminApp(projectPackage: ProjectPackage): AdminAppHandle {
  return {
    mount(container = document.getElementById('root')!) {
      createRoot(container).render(
        <StrictMode>
          <AdminApp projectPackage={projectPackage} />
        </StrictMode>,
      );
    },
  };
}
```

- [ ] **Step 12: 运行全部新测试 + 类型检查**

Run: `npx vitest run src/core/ && npx tsc -b`
Expected: PASS（全部 core 测试通过）

- [ ] **Step 13: 提交**

```bash
git add src/core/routing src/core/app/AdminApp.tsx src/core/app/AdminApp.test.tsx src/core/app/createAdminApp.tsx src/core/app/createAdminApp.test.tsx src/core/routing/createAdminRouteElements.test.tsx
git commit -m "feat(p1): 实现 createAdminApp 路由装配引擎（fixture 包驱动）"
```

> **注意：** 本阶段**不**修改 `src/main.tsx`。真实 `main.tsx → createAdminApp(kelloggPackage).mount()` 的切换在 P2（真实 Kellogg 包就绪后）完成。本阶段 `createAdminApp` 仅由 fixture 包测试驱动。

---

## Task 6：架构依赖边界测试

**Files:**
- Create: `src/test/architecture/dependency-boundaries.test.ts`

**Interfaces:**
- Consumes: 文件系统（`node:fs`）。
- Produces: 一个守卫测试——`core` 不导入禁止的业务路径；`shared/i18n` 不导入任何 `@/` 业务路径。

- [ ] **Step 1: 写测试（应直接通过，因为 core/shared-i18n 已干净）**

`src/test/architecture/dependency-boundaries.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SRC = join(process.cwd(), 'src');

function collectFiles(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...collectFiles(full));
    else if (/\.tsx?$/.test(name)) out.push(full);
  }
  return out;
}

function importSpecifiers(file: string): string[] {
  const src = readFileSync(file, 'utf8');
  const specs: string[] = [];
  const re = /(?:import|export)[^'"]*?from\s*['"]([^'"]+)['"]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) specs.push(m[1]);
  return specs;
}

function offenders(dir: string, forbidden: RegExp): string[] {
  const found: string[] = [];
  for (const file of collectFiles(dir)) {
    for (const spec of importSpecifiers(file)) {
      if (forbidden.test(spec)) found.push(`${file} → ${spec}`);
    }
  }
  return found;
}

describe('依赖边界', () => {
  it('core 不导入 package/features/components/ui/app/context/types', () => {
    const forbidden = /^@\/(package|features|components|ui|app|context|types)(\/|$)/;
    expect(offenders(join(SRC, 'core'), forbidden)).toEqual([]);
  });

  it('shared/i18n 不导入任何 @/ 业务路径', () => {
    const forbidden = /^@\//;
    expect(offenders(join(SRC, 'shared', 'i18n'), forbidden)).toEqual([]);
  });
});
```

- [ ] **Step 2: 运行确认通过**

Run: `npx vitest run src/test/architecture/dependency-boundaries.test.ts`
Expected: PASS（若失败，说明某个 core 文件误引了业务路径——按报告修正该 import，而非放宽规则）。

- [ ] **Step 3: 全量回归 + 类型检查 + 构建**

Run: `npx vitest run && npx tsc -b && npm run build`
Expected: 全绿。

- [ ] **Step 4: 提交**

```bash
git add src/test/architecture/dependency-boundaries.test.ts
git commit -m "test(p1): 新增 core/shared-i18n 依赖边界守卫测试"
```

---

## Self-Review（对照设计 §15 第一阶段 + §16）

- ✅ **建立 `core/contracts`**：Task 2 覆盖设计 §6–§13 全部契约类型。
- ✅ **建立 `defineProjectPackage`**：Task 3，含 §6 列出的全部校验项（route id/path、entity key、block type 唯一；screenId/previewId/editorId 存在）。
- ✅ **稳定装配点 `createAdminApp(projectPackage)`**：Task 5（引擎就绪并经 fixture 测试；`main.tsx` 切换延后到 P2，已在 Task 5 末注明理由）。
- ✅ **package 完整性测试**：Task 3 的 `validateProjectPackage` 测试。
- ✅ **依赖边界测试**：Task 6（core 全量；shared 因遗留违规仅约束 `i18n`，整库 shared 边界延后到 P4/P5——已在"已知遗留"说明）。
- ✅ **不破坏现有应用**：纯新增 + 兼容 re-export；Task 1/4 每步含全量回归。
- ⚠️ **偏离说明**：设计 §15 把"应用入口改为 createAdminApp"列在第一阶段，但真实包在 P2 才存在，故本阶段只建引擎、用 fixture 验证，`main.tsx` 实际切换在 P2 完成。此偏离已在 roadmap 与 Task 5 标注。

完成本阶段后，再编写 **Phase 2** 详细计划。
