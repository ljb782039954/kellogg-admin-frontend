# Phase 2a — 让应用从 Package 启动 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立 Kellogg `package` 脚手架（identity、routes、menuGroups、真实 Shell、屏幕薄包装器），扩展 core 的 shell/菜单契约，并把 `main.tsx` 切到 `createAdminApp(projectPackage).mount()`——使应用从 package 启动、全部现有路由经 package shell 渲染、功能等价于重构前。

**Architecture:** 垂直切片 + 包装器策略。`package/ui/screens` 暂为薄包装器，委托给现有 `@/features/*`、`@/admin/*` 组件（迁移期允许 `package → features/admin` 临时兼容导入，P5 删除）。core 扩展 `AdminShellDefinition`，由 core 从 `routes`+`menuGroups` 构建菜单模型注入 Shell。真实屏幕搬迁、entities/adapters、UI 基础层迁移分别在 2c、2c、2b 完成。

**Tech Stack:** React 19、TypeScript 5.9（`verbatimModuleSyntax`、`strict:false`）、Vite 7、Vitest 4、Testing Library、react-router-dom 7、lucide-react、sonner。

## Global Constraints

- 路径别名 `@/*` → `./src/*`，`@/` import 一律用别名。
- `verbatimModuleSyntax: true`：仅类型的导入/导出用 `import type` / `export type`。
- 依赖方向：`core` 只能 import `@/core/*`、`@/shared/*` 与第三方 npm（禁止 `@/package|@/features|@/components|@/ui|@/app|@/context|@/types`）。`core` 中禁止项目名/具体实体名/具体 BlockType。
- `package` 只能 import `@/core` 公开入口、`@/shared`、第三方 npm，**以及迁移期临时的 `@/features/*`、`@/admin/*`、`@/app/*`、`@/ui/*`、`@/context/*`、`@/config/*`、`@/types`（仅 2a 包装器与 Shell 用，P5 删除）**。
- 不新增 `package.json` 依赖。
- 双语类型 `Translation { zh; en }`，语言 `'zh' | 'en'`。
- 测试：`npx vitest run <path>`；类型检查：`npx tsc -b`；构建：`npm run build`。每个 Task 完成后两者全绿。

## 范围边界（2a 明确不做）

- 不迁移 `src/ui/{primitives,forms,media,navigation}`（→ 2b）。
- 不建立真实 `EntityDefinition`/`EntityAdapter`/`package/types`（→ 2c）；`ProjectPackage.entities` 暂为 `[]`。
- 不建立真实 `pageBuilder`/`blockViews`/`blockEditors`（→ P3）；`pageBuilder` 省略，`blockViews`/`blockEditors` 为 `{}`；page-builder 路由经包装器委托现有实现。
- 不删除任何旧路径（`App.tsx` 除外，见 Task 8）。

## 文件结构（本阶段创建/修改）

**core（契约扩展 + 菜单构建 + Shell 宿主）：**
```text
src/core/contracts/shell.ts              新增：AdminMenuGroupDefinition/AdminMenuItem/AdminMenuGroup/AdminShellProps/AdminShellDefinition
src/core/contracts/ui.ts                 修改：移除 AdminShellDefinition（迁至 shell.ts），ProjectUiDefinition 从 shell.ts 引入
src/core/contracts/package.ts            修改：ProjectPackage 增加 menuGroups?
src/core/contracts/index.ts              修改：导出 shell.ts 的新类型
src/core/routing/buildAdminMenu.ts       新增：从 routes+menuGroups 构建 AdminMenuGroup[]
src/core/routing/buildAdminMenu.test.ts
src/core/app/ShellHost.tsx               新增：计算菜单+语言，渲染 ui.shell.Layout 包裹 <Outlet/>
src/core/routing/createAdminRouteElements.tsx   修改：层级路由用 ShellHost 作为 Layout 宿主
src/core/routing/createAdminRouteElements.test.tsx  修改：适配新 Shell props
src/core/app/AdminApp.test.tsx           修改：适配新 Shell props
src/test/fixtures/fakeProjectPackage.tsx 修改：Layout 用 AdminShellProps；新增 menuGroups、route.menu/icon
src/core/app/defineProjectPackage.ts     修改：校验 menu.group 必须存在于 menuGroups
src/core/app/defineProjectPackage.test.ts 修改：补 menu.group 缺失用例
```

**package（Kellogg 项目包）：**
```text
src/package/identity/config.ts
src/package/identity/config.test.ts
src/package/routes/index.ts              AdminRouteDefinition[] + menuGroups
src/package/routes/routes.test.ts
src/package/ui/shell/AdminLayout.tsx     从 Dashboard 移植，菜单由 props 驱动
src/package/ui/shell/LoginPage.tsx
src/package/ui/shell/ErrorPage.tsx
src/package/ui/shell/AdminLayout.test.tsx
src/package/ui/screens/index.ts          screenId → 包装器组件 的注册表
src/package/ui/screens/screens.test.ts
src/package/ui/index.ts                  defineProjectUi(...)
src/package/index.ts                     defineProjectPackage(...)
src/package/index.test.ts
src/main.tsx                             修改：createAdminApp(projectPackage).mount()
src/App.tsx                              删除（仅 main.tsx 曾引用）
```

---

## Task 1：扩展 core/contracts 的 Shell 与菜单契约

**Files:**
- Create: `src/core/contracts/shell.ts`
- Modify: `src/core/contracts/ui.ts`、`src/core/contracts/package.ts`、`src/core/contracts/index.ts`
- Modify: `src/test/fixtures/fakeProjectPackage.tsx`
- Modify: `src/core/app/defineProjectPackage.ts`、`src/core/app/defineProjectPackage.test.ts`

**Interfaces:**
- Consumes: `Translation`/`Language`（`@/shared/i18n/translation`）、`ProjectIdentity`、`IconName`、`AdminRouteDefinition`。
- Produces（经 `@/core/contracts` barrel）：
  - `AdminMenuGroupDefinition { id: string; title: Translation; order: number; icon?: IconName }`
  - `AdminMenuItem { routeId: string; path: string; title: Translation; icon?: IconName; order: number }`
  - `AdminMenuGroup { id: string; title: Translation; order: number; icon?: IconName; items: AdminMenuItem[] }`
  - `AdminShellProps { identity; menu: AdminMenuGroup[]; language: Language; onLanguageChange(l): void; children: ReactNode }`
  - `AdminShellDefinition { Layout: ComponentType<AdminShellProps>; LoginPage: ComponentType; ErrorPage: ComponentType<{error?: unknown}> }`
  - `ProjectPackage` 新增 `menuGroups?: AdminMenuGroupDefinition[]`
  - `validateProjectPackage`：route.menu.group 必须存在于 menuGroups。

- [ ] **Step 1: 改 fixture 与新增校验用例（先制造编译/测试失败）**

将 `src/test/fixtures/fakeProjectPackage.tsx` 的 `Layout` 改为接收 `AdminShellProps`，并补 `menuGroups` 与 route 的 `menu`/`icon`。替换该文件中 `Layout` 定义与 `export const fakeProjectPackage` 为：
```tsx
import type { ReactNode } from 'react';
import type { AdminShellProps, ProjectPackage } from '@/core/contracts';

function Screen() {
  return <div>screen</div>;
}
function BlockView() {
  return <div>view</div>;
}
function BlockEditor() {
  return <div>editor</div>;
}
function Layout({ children, identity, menu }: AdminShellProps) {
  return (
    <div data-testid="layout" data-brand={identity.name.en} data-groups={menu.length}>
      {children}
    </div>
  );
}
function LoginPage() {
  return <div>login</div>;
}
function ErrorPage() {
  return <div>error</div>;
}

export const fakeProjectPackage: ProjectPackage = {
  identity: {
    key: 'fake',
    name: { zh: '测试', en: 'Fake' },
    languages: ['zh', 'en'],
    defaultLanguage: 'zh',
  },
  menuGroups: [{ id: 'main', title: { zh: '主菜单', en: 'Main' }, order: 1 }],
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

在 `src/core/app/defineProjectPackage.test.ts` 的 `describe('validateProjectPackage', ...)` 内追加用例：
```ts
  it('检出 menu.group 不存在于 menuGroups', () => {
    const pkg = clone();
    pkg.menuGroups = [{ id: 'other', title: { zh: '其它', en: 'Other' }, order: 1 }];
    const errors = validateProjectPackage(pkg);
    expect(errors.some((e) => e.includes('menuGroups'))).toBe(true);
  });
```
并把该测试文件顶部的 `clone()`（见 Phase 1 实现）补上 `menuGroups` 的复制：在返回对象里加入
```ts
    menuGroups: fakeProjectPackage.menuGroups
      ? fakeProjectPackage.menuGroups.map((g) => ({ ...g }))
      : undefined,
```

- [ ] **Step 2: 运行确认失败**

Run: `npx tsc -b`
Expected: FAIL（`AdminShellProps` 未从 `@/core/contracts` 导出；`menuGroups` 不在 `ProjectPackage` 上）。

- [ ] **Step 3: 新增 shell.ts 契约**

`src/core/contracts/shell.ts`:
```ts
import type { ComponentType, ReactNode } from 'react';
import type { Language, Translation } from '@/shared/i18n/translation';
import type { ProjectIdentity } from './identity';
import type { IconName } from './icon';

/** package 声明的菜单分组展示信息。 */
export interface AdminMenuGroupDefinition {
  id: string;
  title: Translation;
  order: number;
  icon?: IconName;
}

/** core 据 routes 构建的菜单项（运行期模型）。 */
export interface AdminMenuItem {
  routeId: string;
  path: string;
  title: Translation;
  icon?: IconName;
  order: number;
}

/** core 据 routes + menuGroups 构建的菜单分组（运行期模型）。 */
export interface AdminMenuGroup {
  id: string;
  title: Translation;
  order: number;
  icon?: IconName;
  items: AdminMenuItem[];
}

export interface AdminShellProps {
  identity: ProjectIdentity;
  menu: AdminMenuGroup[];
  language: Language;
  onLanguageChange(language: Language): void;
  children: ReactNode;
}

export interface AdminShellDefinition {
  Layout: ComponentType<AdminShellProps>;
  LoginPage: ComponentType;
  ErrorPage: ComponentType<{ error?: unknown }>;
}
```

- [ ] **Step 4: 改 ui.ts 引用 shell.ts 的 AdminShellDefinition**

在 `src/core/contracts/ui.ts` 中删除原 `AdminShellDefinition` 定义，改为从 shell.ts 引入再用于 `ProjectUiDefinition`。即：删掉 ui.ts 里的 `AdminShellDefinition` 接口块，并在文件顶部加：
```ts
import type { AdminShellDefinition } from './shell';
```
保持 `ProjectUiDefinition` 中 `shell: AdminShellDefinition;` 不变。（`AdminScreenProps`、`BlockPreviewProps`、`BlockEditorProps`、`ProjectUiDefinition` 留在 ui.ts。）

- [ ] **Step 5: 改 package.ts 增加 menuGroups**

`src/core/contracts/package.ts` 顶部加 `import type { AdminMenuGroupDefinition } from './shell';`，在 `ProjectPackage` 接口 `identity` 之后插入：
```ts
  menuGroups?: AdminMenuGroupDefinition[];
```

- [ ] **Step 6: 更新 barrel 导出**

在 `src/core/contracts/index.ts` 增加：
```ts
export type {
  AdminMenuGroupDefinition,
  AdminMenuItem,
  AdminMenuGroup,
  AdminShellProps,
  AdminShellDefinition,
} from './shell';
```
并从 ui.ts 的导出行中移除 `AdminShellDefinition`（它现在由 shell.ts 导出），即把原
```ts
export type {
  AdminScreenProps,
  BlockPreviewProps,
  BlockEditorProps,
  AdminShellDefinition,
  ProjectUiDefinition,
} from './ui';
```
改为去掉 `AdminShellDefinition` 一行。

- [ ] **Step 7: 在 validateProjectPackage 增加 menu.group 校验**

在 `src/core/app/defineProjectPackage.ts` 的 `validateProjectPackage` 内、route 循环中，对带 `menu` 的 route 追加校验。先在函数开头构建 group id 集合：
```ts
  const groupIds = new Set((pkg.menuGroups ?? []).map((g) => g.id));
```
然后在遍历 `pkg.routes` 的循环体内（处理完 screenId 校验后）加入：
```ts
    if (route.menu && !groupIds.has(route.menu.group)) {
      errors.push(
        `route "${route.id}" 的 menu.group "${route.menu.group}" 不存在于 menuGroups`,
      );
    }
```

- [ ] **Step 8: 运行测试与类型检查确认通过**

Run: `npx vitest run src/core/app/defineProjectPackage.test.ts src/core/contracts/contracts.test.ts && npx tsc -b`
Expected: PASS（含新增 menu.group 缺失用例）。

- [ ] **Step 9: 全量回归**

Run: `npx vitest run`
Expected: 全绿（fixture 改动不破坏其它 core 测试；createAdminRouteElements/AdminApp 测试此刻可能因 Layout 仍按旧 `{children}` 渲染而仍通过——它们在 Task 2 适配）。

> 若 `createAdminRouteElements.test.tsx`/`AdminApp.test.tsx` 因 fixture Layout 改动而失败，**不要在本 Task 修**——记录下来，Task 2 一并适配。但因新 Layout 仍渲染 `children` 且带 `data-testid="layout"`，预期仍通过。

- [ ] **Step 10: 提交**

```bash
git add src/core/contracts src/test/fixtures/fakeProjectPackage.tsx src/core/app/defineProjectPackage.ts src/core/app/defineProjectPackage.test.ts
git commit -m "feat(p2a): 扩展 core shell 契约与 menuGroups，新增 menu.group 校验"
```

---

## Task 2：core 菜单构建 + ShellHost + 路由装配适配

**Files:**
- Create: `src/core/routing/buildAdminMenu.ts`、`src/core/routing/buildAdminMenu.test.ts`
- Create: `src/core/app/ShellHost.tsx`
- Modify: `src/core/routing/createAdminRouteElements.tsx`、`src/core/routing/createAdminRouteElements.test.tsx`
- Modify: `src/core/app/AdminApp.test.tsx`

**Interfaces:**
- Consumes: `ProjectPackage`、`AdminMenuGroup`、`AdminRouteDefinition`、`AdminMenuGroupDefinition`（contracts）；`useLanguage`（`@/core/app/LanguageContext`）；`fakeProjectPackage`。
- Produces:
  - `buildAdminMenu(routes: AdminRouteDefinition[], groups: AdminMenuGroupDefinition[]): AdminMenuGroup[]` —— 只纳入带 `menu` 的 route；按 group 归并；item.path 为绝对路径（前导 `/`）；group 与 item 各按 order 升序；空 group 不输出。
  - `ShellHost({ projectPackage }): ReactElement` —— 计算菜单与语言，渲染 `ui.shell.Layout` 包裹 `<Outlet/>`。
  - `createAdminRouteElements(pkg)` 行为不变（path 渲染 + index 重定向），但 Layout 宿主改为 `ShellHost`。

- [ ] **Step 1: 写 buildAdminMenu 失败测试**

`src/core/routing/buildAdminMenu.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { buildAdminMenu } from './buildAdminMenu';
import type { AdminRouteDefinition, AdminMenuGroupDefinition } from '@/core/contracts';

const groups: AdminMenuGroupDefinition[] = [
  { id: 'content', title: { zh: '内容', en: 'Content' }, order: 2 },
  { id: 'overview', title: { zh: '概览', en: 'Overview' }, order: 1 },
];

const routes: AdminRouteDefinition[] = [
  { id: 'dashboard', path: 'dashboard', title: { zh: '概览', en: 'Dashboard' }, menu: { group: 'overview', order: 1 }, screenId: 'dashboard' },
  { id: 'pages', path: 'pages', title: { zh: '页面', en: 'Pages' }, menu: { group: 'content', order: 2 }, screenId: 'pages' },
  { id: 'media', path: 'media', title: { zh: '图片', en: 'Media' }, menu: { group: 'content', order: 1 }, screenId: 'media' },
  { id: 'page-edit', path: 'pages/:id/edit', title: { zh: '编辑', en: 'Edit' }, screenId: 'page-builder' },
];

describe('buildAdminMenu', () => {
  it('按 group.order 排序分组，按 item.order 排序项', () => {
    const menu = buildAdminMenu(routes, groups);
    expect(menu.map((g) => g.id)).toEqual(['overview', 'content']);
    expect(menu[1].items.map((i) => i.routeId)).toEqual(['media', 'pages']);
  });

  it('item.path 为绝对路径', () => {
    const menu = buildAdminMenu(routes, groups);
    expect(menu[0].items[0].path).toBe('/dashboard');
  });

  it('不纳入无 menu 的 route，不输出空 group', () => {
    const menu = buildAdminMenu(routes, groups);
    const all = menu.flatMap((g) => g.items.map((i) => i.routeId));
    expect(all).not.toContain('page-edit');
    expect(menu.every((g) => g.items.length > 0)).toBe(true);
  });
});
```

- [ ] **Step 2: 运行确认失败**

Run: `npx vitest run src/core/routing/buildAdminMenu.test.ts`
Expected: FAIL（模块不存在）。

- [ ] **Step 3: 实现 buildAdminMenu**

`src/core/routing/buildAdminMenu.ts`:
```ts
import type {
  AdminMenuGroup,
  AdminMenuGroupDefinition,
  AdminMenuItem,
  AdminRouteDefinition,
} from '@/core/contracts';

function toAbsolute(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}

/** 据 routes + menuGroups 构建排序后的菜单模型；只纳入带 menu 的 route，丢弃空分组。 */
export function buildAdminMenu(
  routes: AdminRouteDefinition[],
  groups: AdminMenuGroupDefinition[],
): AdminMenuGroup[] {
  const itemsByGroup = new Map<string, AdminMenuItem[]>();
  for (const route of routes) {
    if (!route.menu) continue;
    const item: AdminMenuItem = {
      routeId: route.id,
      path: toAbsolute(route.path),
      title: route.title,
      icon: route.icon,
      order: route.menu.order,
    };
    const list = itemsByGroup.get(route.menu.group) ?? [];
    list.push(item);
    itemsByGroup.set(route.menu.group, list);
  }

  return groups
    .map((g) => ({
      id: g.id,
      title: g.title,
      order: g.order,
      icon: g.icon,
      items: (itemsByGroup.get(g.id) ?? []).sort((a, b) => a.order - b.order),
    }))
    .filter((g) => g.items.length > 0)
    .sort((a, b) => a.order - b.order);
}
```

- [ ] **Step 4: 运行确认通过**

Run: `npx vitest run src/core/routing/buildAdminMenu.test.ts`
Expected: PASS

- [ ] **Step 5: 实现 ShellHost**

`src/core/app/ShellHost.tsx`:
```tsx
import type { ReactElement } from 'react';
import { Outlet } from 'react-router-dom';
import type { ProjectPackage } from '@/core/contracts';
import { useLanguage } from './LanguageContext';
import { buildAdminMenu } from '@/core/routing/buildAdminMenu';

/** 路由层级宿主：计算菜单与当前语言，渲染项目包的 Shell Layout，内容由 <Outlet/> 提供。 */
export function ShellHost({
  projectPackage,
}: {
  projectPackage: ProjectPackage;
}): ReactElement {
  const { language, setLanguage } = useLanguage();
  const Layout = projectPackage.ui.shell.Layout;
  const menu = buildAdminMenu(
    projectPackage.routes,
    projectPackage.menuGroups ?? [],
  );
  return (
    <Layout
      identity={projectPackage.identity}
      menu={menu}
      language={language}
      onLanguageChange={setLanguage}
    >
      <Outlet />
    </Layout>
  );
}
```

- [ ] **Step 6: 改 createAdminRouteElements 用 ShellHost 作为层级宿主**

把 `src/core/routing/createAdminRouteElements.tsx` 的返回结构改为以 `ShellHost` 作为 `/` 路由的 element（不再直接 `<Layout><Outlet/></Layout>`）：
```tsx
import type { ReactElement } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import type { ProjectPackage } from '@/core/contracts';
import { ShellHost } from '@/core/app/ShellHost';

/** 据项目包构建后台路由树：ShellHost 提供 Shell 布局，按 screenId 渲染 screen。 */
export function createAdminRouteElements(pkg: ProjectPackage): ReactElement {
  const { screens } = pkg.ui;
  const firstPath = pkg.routes[0]?.path;

  return (
    <Routes>
      <Route path="/" element={<ShellHost projectPackage={pkg} />}>
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
（移除原来对 `Outlet`、`shell.Layout` 的直接引用——它们现在在 ShellHost 内。）

- [ ] **Step 7: 适配 createAdminRouteElements 与 AdminApp 测试**

`src/core/routing/createAdminRouteElements.test.tsx` 已有两条断言（layout testid + screen 文本、index 重定向）。fixture 的新 Layout 仍渲染 `data-testid="layout"` 与 `children`，故原断言应仍通过；**额外**补一条菜单注入断言。在该文件 `describe` 内追加：
```ts
  it('Shell 收到 core 构建的菜单分组', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        {createAdminRouteElements(fakeProjectPackage)}
      </MemoryRouter>,
    );
    expect(screen.getByTestId('layout').getAttribute('data-groups')).toBe('1');
  });
```
`src/core/app/AdminApp.test.tsx`：原断言（findByText 'screen'）不受影响，无需改动；若因 ShellHost 需要 LanguageProvider 而报错，确认 `AdminApp` 已用 `LanguageProvider` 包裹（Phase 1 已是）。无新增即可。

- [ ] **Step 8: 运行 core 全量 + 类型检查**

Run: `npx vitest run src/core/ && npx tsc -b`
Expected: PASS

- [ ] **Step 9: 提交**

```bash
git add src/core/routing/buildAdminMenu.ts src/core/routing/buildAdminMenu.test.ts src/core/app/ShellHost.tsx src/core/routing/createAdminRouteElements.tsx src/core/routing/createAdminRouteElements.test.tsx
git commit -m "feat(p2a): core 据 routes 构建菜单，新增 ShellHost 注入 Shell"
```

---

## Task 3：package/identity 配置

**Files:**
- Create: `src/package/identity/config.ts`、`src/package/identity/config.test.ts`

**Interfaces:**
- Consumes: `ProjectIdentity`（`@/core/contracts`）；`@/config/siteSettings.json`（迁移期临时导入，2c/P5 内化到 package）。
- Produces: `identity: ProjectIdentity`（`@/package/identity/config`）。

- [ ] **Step 1: 写失败测试**

`src/package/identity/config.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { identity } from './config';

describe('package identity', () => {
  it('提供 Kellogg 品牌身份', () => {
    expect(identity.key).toBe('kellogg');
    expect(identity.name.en).toBe('KELLOGG');
    expect(identity.languages).toEqual(['zh', 'en']);
    expect(identity.defaultLanguage).toBe('zh');
  });
});
```

- [ ] **Step 2: 运行确认失败**

Run: `npx vitest run src/package/identity/config.test.ts`
Expected: FAIL（模块不存在）。

- [ ] **Step 3: 实现 identity**

`src/package/identity/config.ts`:
```ts
import type { ProjectIdentity } from '@/core/contracts';
import siteSettings from '@/config/siteSettings.json';

export const identity: ProjectIdentity = {
  key: 'kellogg',
  name: siteSettings.brand.name,
  logo: siteSettings.brand.logo,
  languages: ['zh', 'en'],
  defaultLanguage: 'zh',
};
```

- [ ] **Step 4: 运行确认通过 + 类型检查**

Run: `npx vitest run src/package/identity/config.test.ts && npx tsc -b`
Expected: PASS（若 tsc 因 JSON import 无类型报错，确认 `resolveJsonModule` 默认在 bundler 模式开启；现有 Dashboard 已 import 该 JSON，故应正常）。

- [ ] **Step 5: 提交**

```bash
git add src/package/identity/config.ts src/package/identity/config.test.ts
git commit -m "feat(p2a): 建立 package/identity（Kellogg 品牌身份）"
```

---

## Task 4：package/routes 路由与菜单分组声明

**Files:**
- Create: `src/package/routes/index.ts`、`src/package/routes/routes.test.ts`

**Interfaces:**
- Consumes: `AdminRouteDefinition`、`AdminMenuGroupDefinition`（`@/core/contracts`）。
- Produces: `routes: AdminRouteDefinition[]`、`menuGroups: AdminMenuGroupDefinition[]`（`@/package/routes`）。screenId 取值见下表（Task 6 的 screens 注册表必须提供同名 id）。

screenId / 路由对照（镜像当前 `App.tsx` + `Dashboard` 菜单）：

| path | screenId | 菜单 group/order | title(zh/en) | icon |
|---|---|---|---|---|
| dashboard | dashboard | overview/1 | 概览/Dashboard | LayoutDashboard |
| company | company | site/1 | 公司信息/Company | Building2 |
| header | header | site/2 | Header/Header | PanelTop |
| footer | footer | site/3 | Footer/Footer | PanelBottom |
| components | components | site/4 | 预定义组件/Components | Layers |
| pages | pages | site/5 | 页面管理/Pages | FileText |
| media | media | site/6 | 图片管理/Media | ImageIcon |
| pages/:pageId/edit | page-builder | (无) | 页面编辑/Page Editor | — |
| blog | blog-list | blog/1 | 文章列表/Posts | — |
| blog/new | blog-new | blog/2 | 写新文章/New Post | — |
| blog/:id/edit | blog-edit | (无) | 编辑文章/Edit Post | — |
| blog-categories | blog-categories | blog/3 | 分类管理/Categories | — |
| products | products | product/1 | 产品编辑/Products | — |
| categories | categories | product/2 | 产品分类/Product Categories | — |
| inquiries | inquiries | inquiry/1 | 询盘列表/Inquiries | — |
| inquiry-editor | inquiry-settings | inquiry/2 | 页面编辑/Inquiry Page | — |
| reviews | reviews | misc/1 | 客户评价/Reviews | Star |
| page-layout | page-layout-redirect | (无) | 旧路由跳转/Redirect | — |

menuGroups（id / title / order / icon）：overview(概览/Overview,1)、site(网站设置/Site,2)、blog(博客管理/Blog,3,BookOpen)、product(产品管理/Products,4,ShoppingBag)、inquiry(询盘管理/Inquiries,5,Inbox)、misc(其它/More,6)。

- [ ] **Step 1: 写失败测试**

`src/package/routes/routes.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { routes, menuGroups } from './index';

describe('package routes', () => {
  it('route id 与 path 唯一', () => {
    expect(new Set(routes.map((r) => r.id)).size).toBe(routes.length);
    expect(new Set(routes.map((r) => r.path)).size).toBe(routes.length);
  });

  it('每个带 menu 的 route 其 group 都在 menuGroups 中', () => {
    const ids = new Set(menuGroups.map((g) => g.id));
    for (const r of routes) {
      if (r.menu) expect(ids.has(r.menu.group)).toBe(true);
    }
  });

  it('覆盖关键路由', () => {
    const paths = routes.map((r) => r.path);
    expect(paths).toContain('dashboard');
    expect(paths).toContain('pages/:pageId/edit');
    expect(paths).toContain('blog/:id/edit');
  });
});
```

- [ ] **Step 2: 运行确认失败**

Run: `npx vitest run src/package/routes/routes.test.ts`
Expected: FAIL（模块不存在）。

- [ ] **Step 3: 实现 routes + menuGroups**

`src/package/routes/index.ts`:
```ts
import type {
  AdminMenuGroupDefinition,
  AdminRouteDefinition,
} from '@/core/contracts';

export const menuGroups: AdminMenuGroupDefinition[] = [
  { id: 'overview', title: { zh: '概览', en: 'Overview' }, order: 1 },
  { id: 'site', title: { zh: '网站设置', en: 'Site' }, order: 2 },
  { id: 'blog', title: { zh: '博客管理', en: 'Blog' }, order: 3, icon: 'BookOpen' },
  { id: 'product', title: { zh: '产品管理', en: 'Products' }, order: 4, icon: 'ShoppingBag' },
  { id: 'inquiry', title: { zh: '询盘管理', en: 'Inquiries' }, order: 5, icon: 'Inbox' },
  { id: 'misc', title: { zh: '其它', en: 'More' }, order: 6 },
];

export const routes: AdminRouteDefinition[] = [
  { id: 'dashboard', path: 'dashboard', title: { zh: '概览', en: 'Dashboard' }, icon: 'LayoutDashboard', menu: { group: 'overview', order: 1 }, screenId: 'dashboard' },
  { id: 'company', path: 'company', title: { zh: '公司信息', en: 'Company' }, icon: 'Building2', menu: { group: 'site', order: 1 }, screenId: 'company' },
  { id: 'header', path: 'header', title: { zh: 'Header', en: 'Header' }, icon: 'PanelTop', menu: { group: 'site', order: 2 }, screenId: 'header' },
  { id: 'footer', path: 'footer', title: { zh: 'Footer', en: 'Footer' }, icon: 'PanelBottom', menu: { group: 'site', order: 3 }, screenId: 'footer' },
  { id: 'components', path: 'components', title: { zh: '预定义组件', en: 'Components' }, icon: 'Layers', menu: { group: 'site', order: 4 }, screenId: 'components' },
  { id: 'pages', path: 'pages', title: { zh: '页面管理', en: 'Pages' }, icon: 'FileText', menu: { group: 'site', order: 5 }, screenId: 'pages' },
  { id: 'media', path: 'media', title: { zh: '图片管理', en: 'Media' }, icon: 'Image', menu: { group: 'site', order: 6 }, screenId: 'media' },
  { id: 'page-builder', path: 'pages/:pageId/edit', title: { zh: '页面编辑', en: 'Page Editor' }, screenId: 'page-builder' },
  { id: 'blog-list', path: 'blog', title: { zh: '文章列表', en: 'Posts' }, menu: { group: 'blog', order: 1 }, screenId: 'blog-list' },
  { id: 'blog-new', path: 'blog/new', title: { zh: '写新文章', en: 'New Post' }, menu: { group: 'blog', order: 2 }, screenId: 'blog-new' },
  { id: 'blog-edit', path: 'blog/:id/edit', title: { zh: '编辑文章', en: 'Edit Post' }, screenId: 'blog-edit' },
  { id: 'blog-categories', path: 'blog-categories', title: { zh: '分类管理', en: 'Categories' }, menu: { group: 'blog', order: 3 }, screenId: 'blog-categories' },
  { id: 'products', path: 'products', title: { zh: '产品编辑', en: 'Products' }, menu: { group: 'product', order: 1 }, screenId: 'products' },
  { id: 'categories', path: 'categories', title: { zh: '产品分类', en: 'Product Categories' }, menu: { group: 'product', order: 2 }, screenId: 'categories' },
  { id: 'inquiries', path: 'inquiries', title: { zh: '询盘列表', en: 'Inquiries' }, menu: { group: 'inquiry', order: 1 }, screenId: 'inquiries' },
  { id: 'inquiry-settings', path: 'inquiry-editor', title: { zh: '页面编辑', en: 'Inquiry Page' }, menu: { group: 'inquiry', order: 2 }, screenId: 'inquiry-settings' },
  { id: 'reviews', path: 'reviews', title: { zh: '客户评价', en: 'Reviews' }, icon: 'Star', menu: { group: 'misc', order: 1 }, screenId: 'reviews' },
  { id: 'page-layout-redirect', path: 'page-layout', title: { zh: '旧路由跳转', en: 'Redirect' }, screenId: 'page-layout-redirect' },
];
```

- [ ] **Step 4: 运行确认通过 + 类型检查**

Run: `npx vitest run src/package/routes/routes.test.ts && npx tsc -b`
Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add src/package/routes/index.ts src/package/routes/routes.test.ts
git commit -m "feat(p2a): 声明 package/routes 路由表与菜单分组"
```

---

## Task 5：package/ui/shell — AdminLayout / LoginPage / ErrorPage

**Files:**
- Create: `src/package/ui/shell/AdminLayout.tsx`、`LoginPage.tsx`、`ErrorPage.tsx`、`AdminLayout.test.tsx`

**Interfaces:**
- Consumes: `AdminShellProps`、`AdminMenuGroup`（`@/core/contracts`）；`useBuildManager`、`BuildTrigger`（`@/features/build`，迁移期临时）；`lucide-react`、`sonner`、`react-router-dom`。
- Produces: `AdminLayout`（`ComponentType<AdminShellProps>`）、`LoginPage`、`ErrorPage`（`@/package/ui/shell/*`）。

设计要点（从 `src/admin/Dashboard.tsx` 移植，但菜单改由 `props.menu` 驱动）：
- 侧栏：品牌区用 `identity.logo` + `identity.name`（按 `language` 取 zh/en）；语言切换调用 `onLanguageChange`；构建面板沿用 `BuildTrigger`；菜单按 `menu` 渲染——`items.length>1` 的分组可折叠，`items.length===1` 的分组渲染为直达链接。
- 主区：`<main>` 内渲染 `children`（即 `<Outlet/>`）。
- 图标：`menu` 项/组的 `icon` 是字符串名，用一个 `lucide-react` 名称映射表解析（仅映射 routes 用到的图标）。

- [ ] **Step 1: 写 AdminLayout 失败测试**

`src/package/ui/shell/AdminLayout.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AdminLayout } from './AdminLayout';
import type { AdminMenuGroup, ProjectIdentity } from '@/core/contracts';

const identity: ProjectIdentity = {
  key: 'kellogg',
  name: { zh: '凯乐格', en: 'KELLOGG' },
  logo: '/logo/logo.jpg',
  languages: ['zh', 'en'],
  defaultLanguage: 'zh',
};

const menu: AdminMenuGroup[] = [
  { id: 'overview', title: { zh: '概览', en: 'Overview' }, order: 1, items: [{ routeId: 'dashboard', path: '/dashboard', title: { zh: '概览', en: 'Dashboard' }, order: 1 }] },
  { id: 'blog', title: { zh: '博客管理', en: 'Blog' }, order: 3, items: [
    { routeId: 'blog-list', path: '/blog', title: { zh: '文章列表', en: 'Posts' }, order: 1 },
    { routeId: 'blog-categories', path: '/blog-categories', title: { zh: '分类管理', en: 'Categories' }, order: 3 },
  ] },
];

function renderLayout(language: 'zh' | 'en' = 'zh', onLang = vi.fn()) {
  return render(
    <MemoryRouter>
      <AdminLayout identity={identity} menu={menu} language={language} onLanguageChange={onLang}>
        <div>页面内容</div>
      </AdminLayout>
    </MemoryRouter>,
  );
}

describe('AdminLayout', () => {
  it('渲染品牌名与子内容', () => {
    renderLayout('zh');
    expect(screen.getByText('凯乐格')).toBeInTheDocument();
    expect(screen.getByText('页面内容')).toBeInTheDocument();
  });

  it('单项分组渲染为直达链接', () => {
    renderLayout('zh');
    const link = screen.getByRole('link', { name: /概览/ });
    expect(link).toHaveAttribute('href', '/dashboard');
  });

  it('多项分组展开后显示子项链接', () => {
    renderLayout('zh');
    fireEvent.click(screen.getByText('博客管理'));
    expect(screen.getByRole('link', { name: /文章列表/ })).toHaveAttribute('href', '/blog');
  });

  it('点击语言按钮回调 onLanguageChange', () => {
    const onLang = vi.fn();
    renderLayout('zh', onLang);
    fireEvent.click(screen.getByRole('button', { name: /中文|EN/ }));
    expect(onLang).toHaveBeenCalledWith('en');
  });
});
```

- [ ] **Step 2: 运行确认失败**

Run: `npx vitest run src/package/ui/shell/AdminLayout.test.tsx`
Expected: FAIL（模块不存在）。

- [ ] **Step 3: 实现 ErrorPage 与 LoginPage（简单占位，无认证逻辑）**

`src/package/ui/shell/ErrorPage.tsx`:
```tsx
export function ErrorPage({ error }: { error?: unknown }) {
  const message = error instanceof Error ? error.message : '发生未知错误';
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-2 text-gray-600">
      <h1 className="text-2xl font-bold text-gray-800">出错了</h1>
      <p className="text-sm">{message}</p>
    </div>
  );
}
```

`src/package/ui/shell/LoginPage.tsx`（当前应用未启用认证，提供占位页）:
```tsx
export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center text-gray-600">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">KELLOGG 后台管理</h1>
        <p className="mt-2 text-sm">登录功能未启用</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: 实现 AdminLayout（菜单 props 驱动）**

`src/package/ui/shell/AdminLayout.tsx`:
```tsx
import { useState, type ComponentType } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Building2, BookOpen, ChevronRight, FileText, Globe, Image as ImageIcon,
  Inbox, Layers, LayoutDashboard, PanelBottom, PanelTop, ShoppingBag, Star,
  type LucideProps,
} from 'lucide-react';
import { toast } from 'sonner';
import type { AdminShellProps, AdminMenuGroup } from '@/core/contracts';
import { useBuildManager, BuildTrigger } from '@/features/build';

const ICONS: Record<string, ComponentType<LucideProps>> = {
  LayoutDashboard, Building2, PanelTop, PanelBottom, Layers, FileText,
  Image: ImageIcon, BookOpen, ShoppingBag, Inbox, Star,
};

function GroupIcon({ name }: { name?: string }) {
  const Icon = name ? ICONS[name] : undefined;
  return Icon ? <Icon className="w-5 h-5" /> : <span className="w-5 h-5" />;
}

export function AdminLayout({
  identity, menu, language, onLanguageChange, children,
}: AdminShellProps) {
  const location = useLocation();
  const { buildStatus, isBuilding, triggerMutation } = useBuildManager();

  const isSingle = (g: AdminMenuGroup) => g.items.length === 1;

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const g of menu) {
      if (!isSingle(g) && g.items.some((i) => location.pathname.startsWith(i.path))) {
        initial[g.id] = true;
      }
    }
    return initial;
  });

  const toggle = (id: string) =>
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleBuild = async () => {
    try {
      const res = await triggerMutation.mutateAsync();
      if (res.success && res.buildStatus) toast.success('构建部署已成功触发，正在后台生成中...');
      else toast.error('触发构建失败');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '触发构建出错');
    }
  };

  const t = (tr: { zh: string; en: string }) => (language === 'zh' ? tr.zh : tr.en);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            {identity.logo && <img src={identity.logo} alt="Logo" className="w-8 h-8 object-contain" />}
            <h1 className="text-xl font-bold text-gray-800">{t(identity.name)}</h1>
          </div>
          <p className="text-sm text-gray-500">后台管理系统</p>
        </div>

        <div className="p-4 border-t border-gray-300 bg-gray-50/50">
          <BuildTrigger
            hasChanges={buildStatus.hasChanges}
            isBuilding={isBuilding}
            lastBuildTime={buildStatus.lastBuildTime}
            onBuild={handleBuild}
          />
        </div>

        <div className="p-4 border-b border-gray-300">
          <div className="flex items-center gap-3 px-4 py-3">
            <Globe className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-600">预览语言</span>
            <div className="flex-1 flex justify-end">
              <button
                onClick={() => onLanguageChange(language === 'zh' ? 'en' : 'zh')}
                className="px-3 py-1 text-sm bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                {language === 'zh' ? '中文' : 'EN'}
              </button>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menu.map((group) => {
            if (isSingle(group)) {
              const item = group.items[0];
              return (
                <NavLink
                  key={group.id}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`
                  }
                >
                  <GroupIcon name={item.icon ?? group.icon} />
                  <span className="flex-1">{t(item.title)}</span>
                </NavLink>
              );
            }
            const active = group.items.some((i) => location.pathname.startsWith(i.path));
            return (
              <div key={group.id}>
                <button
                  onClick={() => toggle(group.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    active ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <GroupIcon name={group.icon} />
                  <span className="flex-1 text-left">{t(group.title)}</span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${openGroups[group.id] ? 'rotate-90' : ''}`} />
                </button>
                {openGroups[group.id] && (
                  <div className="ml-4 mt-1 space-y-1">
                    {group.items.map((item) => (
                      <NavLink
                        key={item.routeId}
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all ${
                            isActive ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-500 hover:bg-gray-50'
                          }`
                        }
                      >
                        <span className="flex-1">{t(item.title)}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
```

- [ ] **Step 5: 运行确认通过**

Run: `npx vitest run src/package/ui/shell/AdminLayout.test.tsx`
Expected: PASS（4 条用例）。
> `useBuildManager` 会发起查询；测试在无 QueryProvider 下若报错，给测试的 `render` 外层补 `QueryProvider`（`@/core/app/QueryProvider`）包裹。先按上面运行；如失败则加 QueryProvider 后重跑。

- [ ] **Step 6: 类型检查 + 提交**

Run: `npx tsc -b`
Expected: PASS
```bash
git add src/package/ui/shell
git commit -m "feat(p2a): 建立 package/ui/shell（菜单 props 驱动的 AdminLayout + Login/Error）"
```

---

## Task 6：package/ui/screens — 屏幕薄包装器注册表

**Files:**
- Create: `src/package/ui/screens/index.ts`、`src/package/ui/screens/screens.test.ts`

**Interfaces:**
- Consumes: `AdminScreenProps`（`@/core/contracts`）；现有 feature/admin 组件（迁移期临时导入）：
  - `@/features/company-info`→`CompanyInfoEditor`、`@/features/navigation`→`NavigationEditor`、`@/features/footer`→`FooterEditor`、`@/features/categories`→`CategoriesEditor`、`@/features/products`→`ProductsEditor`、`@/features/inquiries`→`InquiriesManager`/`InquirySettingsEditor`、`@/features/media`→`MediaManager`、`@/features/blogs`→`BlogsManager`/`BlogEditor`、`@/features/blog-categories`→`BlogCategoriesManager`、`@/features/reviews`→`ReviewsManager`、`@/features/pages`→`PagesManager`。
  - `@/admin/Overview`（默认导出）、`@/admin/BlocksPreview`（默认导出）。
  - `@/app/adapters/page-builder/DefaultPageBuilderRoute`（默认导出）。
- Produces: `screens: Record<string, ComponentType<AdminScreenProps>>`（`@/package/ui/screens`），键与 Task 4 的 screenId 完全一致。

- [ ] **Step 1: 写失败测试（注册表完整性）**

`src/package/ui/screens/screens.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { screens } from './index';
import { routes } from '@/package/routes';

describe('package screens 注册表', () => {
  it('为每个 route.screenId 提供组件', () => {
    for (const route of routes) {
      expect(screens[route.screenId], `缺少 screen: ${route.screenId}`).toBeTypeOf('function');
    }
  });

  it('不含未被任何路由引用的多余 screen', () => {
    const used = new Set(routes.map((r) => r.screenId));
    for (const id of Object.keys(screens)) {
      expect(used.has(id), `多余 screen: ${id}`).toBe(true);
    }
  });
});
```

- [ ] **Step 2: 运行确认失败**

Run: `npx vitest run src/package/ui/screens/screens.test.ts`
Expected: FAIL（模块不存在）。

- [ ] **Step 3: 实现 screens 注册表（薄包装器）**

`src/package/ui/screens/index.ts`:
```tsx
import type { ComponentType } from 'react';
import { Navigate } from 'react-router-dom';
import type { AdminScreenProps } from '@/core/contracts';

import Overview from '@/admin/Overview';
import BlocksPreview from '@/admin/BlocksPreview';
import DefaultPageBuilderRoute from '@/app/adapters/page-builder/DefaultPageBuilderRoute';
import { CompanyInfoEditor } from '@/features/company-info';
import { NavigationEditor } from '@/features/navigation';
import { FooterEditor } from '@/features/footer';
import { PagesManager } from '@/features/pages';
import { MediaManager } from '@/features/media';
import { BlogsManager, BlogEditor } from '@/features/blogs';
import { BlogCategoriesManager } from '@/features/blog-categories';
import { ProductsEditor } from '@/features/products';
import { CategoriesEditor } from '@/features/categories';
import { InquiriesManager, InquirySettingsEditor } from '@/features/inquiries';
import { ReviewsManager } from '@/features/reviews';

/** 迁移期薄包装器：委托给现有 feature/admin 组件；2c 将逐个替换为 package 内真身。 */
const wrap = (Component: ComponentType): ComponentType<AdminScreenProps> => {
  function Screen(_props: AdminScreenProps) {
    return <Component />;
  }
  return Screen;
};

function PageLayoutRedirect() {
  return <Navigate to="/pages" replace />;
}

export const screens: Record<string, ComponentType<AdminScreenProps>> = {
  dashboard: wrap(Overview),
  company: wrap(CompanyInfoEditor),
  header: wrap(NavigationEditor),
  footer: wrap(FooterEditor),
  components: wrap(BlocksPreview),
  pages: wrap(PagesManager),
  'page-builder': wrap(DefaultPageBuilderRoute),
  media: wrap(MediaManager),
  'blog-list': wrap(BlogsManager),
  'blog-new': wrap(BlogEditor),
  'blog-edit': wrap(BlogEditor),
  'blog-categories': wrap(BlogCategoriesManager),
  products: wrap(ProductsEditor),
  categories: wrap(CategoriesEditor),
  inquiries: wrap(InquiriesManager),
  'inquiry-settings': wrap(InquirySettingsEditor),
  reviews: wrap(ReviewsManager),
  'page-layout-redirect': PageLayoutRedirect,
};
```

- [ ] **Step 4: 运行确认通过 + 类型检查**

Run: `npx vitest run src/package/ui/screens/screens.test.ts && npx tsc -b`
Expected: PASS（注册表键集合与 routes 的 screenId 集合互相覆盖）。

- [ ] **Step 5: 提交**

```bash
git add src/package/ui/screens
git commit -m "feat(p2a): 建立 package/ui/screens 屏幕注册表（薄包装器委托现有实现）"
```

---

## Task 7：package/ui/index.ts 与 package/index.ts 装配

**Files:**
- Create: `src/package/ui/index.ts`、`src/package/index.ts`、`src/package/index.test.ts`

**Interfaces:**
- Consumes: `defineProjectUi`、`defineProjectPackage`（`@/core/app/...`）；`identity`、`routes`、`menuGroups`、`screens`、shell 组件。
- Produces: `projectUi: ProjectUiDefinition`（`@/package/ui`）、`projectPackage: ProjectPackage`（`@/package`，默认 + 具名导出）。

- [ ] **Step 1: 写失败测试**

`src/package/index.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { projectPackage } from './index';
import { routes } from './routes';

describe('kellogg projectPackage', () => {
  it('通过 defineProjectPackage 校验（导入即校验，不抛错）', () => {
    expect(projectPackage.identity.key).toBe('kellogg');
  });

  it('路由数量与 routes 模块一致', () => {
    expect(projectPackage.routes).toHaveLength(routes.length);
  });

  it('每个 route.screenId 在 ui.screens 中有实现', () => {
    for (const r of projectPackage.routes) {
      expect(projectPackage.ui.screens[r.screenId]).toBeTypeOf('function');
    }
  });
});
```

- [ ] **Step 2: 运行确认失败**

Run: `npx vitest run src/package/index.test.ts`
Expected: FAIL（模块不存在）。

- [ ] **Step 3: 实现 package/ui/index.ts**

`src/package/ui/index.ts`:
```ts
import { defineProjectUi } from '@/core/app/defineProjectUi';
import { AdminLayout } from './shell/AdminLayout';
import { LoginPage } from './shell/LoginPage';
import { ErrorPage } from './shell/ErrorPage';
import { screens } from './screens';

export const projectUi = defineProjectUi({
  shell: { Layout: AdminLayout, LoginPage, ErrorPage },
  screens,
  blockViews: {},
  blockEditors: {},
});
```

- [ ] **Step 4: 实现 package/index.ts**

`src/package/index.ts`:
```ts
import { defineProjectPackage } from '@/core/app/defineProjectPackage';
import { identity } from './identity/config';
import { routes, menuGroups } from './routes';
import { projectUi } from './ui';

export const projectPackage = defineProjectPackage({
  identity,
  menuGroups,
  routes,
  entities: [],
  ui: projectUi,
});

export default projectPackage;
```

- [ ] **Step 5: 运行确认通过 + 类型检查**

Run: `npx vitest run src/package/index.test.ts && npx tsc -b`
Expected: PASS（`defineProjectPackage` 在导入时执行校验；若有 screenId/menu.group 不匹配会抛错并使测试失败——此为预期守卫）。

- [ ] **Step 6: 提交**

```bash
git add src/package/ui/index.ts src/package/index.ts src/package/index.test.ts
git commit -m "feat(p2a): 装配 package/ui 与 package/index（projectPackage 出口）"
```

---

## Task 8：切换 main.tsx 到 createAdminApp，移除 App.tsx

**Files:**
- Modify: `src/main.tsx`
- Delete: `src/App.tsx`

**Interfaces:**
- Consumes: `createAdminApp`（`@/core/app/createAdminApp`）、`projectPackage`（`@/package`）。

- [ ] **Step 1: 确认 App.tsx 仅被 main.tsx 引用**

Run: `grep -rn "/App\(\.tsx\)\?['\"]" src --include=*.tsx --include=*.ts | grep -vE "AdminApp"`
Expected: 仅 `src/main.tsx` 出现（`import App from './App.tsx'`）。若有其它引用，先在报告中列出并停下（BLOCKED）。

- [ ] **Step 2: 改写 main.tsx**

`src/main.tsx` 整文件替换为：
```tsx
import './index.css';
import { createAdminApp } from '@/core/app/createAdminApp';
import { projectPackage } from '@/package';

createAdminApp(projectPackage).mount();
```

- [ ] **Step 3: 删除 App.tsx**

```bash
git rm src/App.tsx
```

- [ ] **Step 4: 全量测试 + 类型检查 + 生产构建**

Run: `npx vitest run && npx tsc -b && npm run build`
Expected: 全绿。`tsc -b` 不再因 App.tsx 引用而报错；build 成功产出。

- [ ] **Step 5: 手动验证（记录在报告，不阻塞自动门禁）**

Run: `npm run dev`，浏览器打开后确认：
- 左侧出现 Kellogg 品牌与菜单（概览/网站设置/博客管理/产品管理/询盘管理/客户评价）。
- 点击各菜单项路由正常切换、页面内容与重构前一致。
- 语言切换按钮工作。
报告中记录验证结果（截图或逐项确认）。

- [ ] **Step 6: 提交**

```bash
git add src/main.tsx
git commit -m "feat(p2a): main.tsx 经 createAdminApp(projectPackage) 启动，移除 App.tsx"
```

---

## Self-Review（对照 2a 目标）

- ✅ **包脚手架**：identity(T3)、routes+menuGroups(T4)、shell(T5)、screens(T6)、装配(T7)。
- ✅ **core 据 routes 构建菜单**：shell 契约扩展(T1) + buildAdminMenu + ShellHost(T2)。
- ✅ **app 从 package 启动**：main.tsx 切换(T8)，全部现有路由经 package shell + 包装器渲染。
- ✅ **不破坏功能**：屏幕委托现有实现；每个改动 core 的 Task 都跑全量回归；T8 含 build 与手动验证。
- ✅ **依赖边界**：core 仍只引 core/shared/npm（ShellHost 引 `@/core/*`）。package 引 core/shared + 迁移期临时 `@/features|@/admin|@/app|@/config`（已在全局约束声明，P5 删除）。
- ⚠️ **临时兼容导入**：package→features/admin/app/config 是 2a 的有意妥协，**P1 的依赖边界测试只约束 core 与 shared/i18n，不约束 package**，故不会误报；P5 落地 package 边界测试前必须先完成 2c 的真身迁移。
- ⚠️ **entities 暂空 / pageBuilder 暂省**：2a 不引入实体与积木块定义；page-builder 路由经包装器委托现有实现。2c / P3 补齐。

完成本子计划、应用从 package 正常启动后，再编写 **Phase 2b**（UI 基础层迁移）详细计划。
