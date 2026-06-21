# Phase 2b — UI 基础层迁入 package/ui 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把通用 UI 基础层（`src/ui/{primitives,forms,media,navigation}`）与 `cn` 工具迁入目标架构（`src/package/ui/*`、`src/shared/utils`），旧路径仅保留兼容 re-export shim，消费端零改动、门禁全绿。

**Architecture:** 纯机械「搬迁 + 兼容垫片」重构，不改任何运行时行为。每个子树：`git mv` 到新址 → 重写被搬文件内部对 `@/lib/utils`(cn) 和 `@/ui/primitives`(同级) 的引用指向新址 → 在旧址逐文件留 `export *` / `export { default }` 垫片，使现有 79 个消费端无需改动。消费端改引新址留待 P5。

**Tech Stack:** React 19 + TypeScript + Vite 7 + Vitest，路径别名 `@/*`→`src/*`（`vite.config.ts` + `tsconfig.app.json`），`verbatimModuleSyntax: true`（仅类型用 `import type`）。Windows + git bash。

## Global Constraints

- 别名 `@`→`./src`；JSX 文件必须 `.tsx`。
- `verbatimModuleSyntax: true`：类型再导出用 `export type { ... }`，默认导出再导出用 `export { default } from '...'`。
- **不修改 `package.json`**（不新增依赖）；`cn` 仍只依赖已装的 `clsx` + `tailwind-merge`。
- **本期范围仅 4 个子树**：`src/ui/{primitives,forms,media,navigation}` + `src/lib/utils` 的 `cn`。**不碰** `src/ui/themes/`（P3）、`src/components/ui/*`（零引用死副本，P5 删）、`src/components/blocks/*`（P3）。
- `getPreviewUrl` 留在 `@/lib/utils` 原处不动（仅迁 `cn`）。
- `AdminLayout` 对 `@/features/build`（`useBuildManager` + `BuildTrigger`）的依赖**本期不动**，留待 P2c/P3（迁移期 package 引 `@/features` 属临时允许，边界测试不约束 package）。
- 决策：`navigation/LinkSelector` **并入 `package/ui/forms`**，旧址 `@/ui/navigation` 留 shim。
- 每个 Task 结束跑 `npx tsc -b` + `npx vitest run`，全绿才提交。
- **提交只 `git add` 目标文件，严禁 `git add -A`**（会误提交 `.claude/`、`CLAUDE.md`、`docs/claudeChat.md`）。
- **避免 "too large"**：用 `git mv` + `sed` 脚本批改，**不要把大批文件 `cat`/读入上下文**；命令用 `-q`、`--stat`，不回显大块内容。

---

## 现状事实（实现者必读）

- `cn` 定义于 `src/lib/utils.ts`（与 `getPreviewUrl` 同住），签名：`export function cn(...inputs: ClassValue[]): string`，依赖 `clsx`、`tailwind-merge`。
- `src/ui/primitives/*`：约 53 个 shadcn 组件，**无 barrel `index.ts`**，消费端深路径引用 `@/ui/primitives/<name>`（79 文件、218 处）。多数文件 `import { cn } from '@/lib/utils'`；部分文件互引同级 `@/ui/primitives/<name>`（如 `sidebar.tsx` 引 6 个）。均为具名导出。
- `src/ui/forms/`：`BilingualInput.tsx`（具名 `BilingualInput` + `export default`）、`BilingualTextarea.tsx`（具名）、`index.ts`（barrel）、`rich-text/{BilingualRichInput,RichInput,BilingualRichInputModal}.tsx`（均 default）+ `rich-text/utils.ts` + `rich-text/index.ts`。内部互引已是相对路径 `./X`；外部仅引 `@/shared/forms/controls/*`、`@/types`(Translation 类型)。消费端用：`@/ui/forms`、`@/ui/forms/BilingualInput`、`@/ui/forms/BilingualTextarea`、`@/ui/forms/rich-text/BilingualRichInput`。
- `src/ui/media/`：`AdminImage.tsx`（default；引 `cn`+`getPreviewUrl` from `@/lib/utils`）、`ImageInput.tsx`（default；引 `@/shared/media/*`）、`ImageInput.test.tsx`（引相对 `./ImageInput`）、`index.ts`（barrel，default 再导出）。消费端用：`@/ui/media/AdminImage`、`@/ui/media/ImageInput`。
- `src/ui/navigation/`：`LinkSelector.tsx`（具名 `LinkSelector` + `export interface PageOption`；引 `@/ui/primitives/{input,label,...}`、`@/types`）、`index.ts`（re-export LinkSelector + type PageOption）。消费端用：`@/ui/navigation`、`@/ui/navigation/LinkSelector`。
- `src/shared/` 下尚无 `utils/` 目录（需新建）。
- 边界测试 `src/test/architecture/dependency-boundaries.test.ts` 当前只约束 `core` 与 `shared/i18n`；`collectFiles` 跳过 `*.test.*`。

---

## Task 1: 建立 `shared/utils` 并迁入 `cn`

**Files:**
- Create: `src/shared/utils/cn.ts`
- Create: `src/shared/utils/index.ts`
- Create: `src/shared/utils/cn.test.ts`
- Modify: `src/lib/utils.ts`（移除 cn 定义，改为从 shared 再导出；保留 `getPreviewUrl`）
- Modify: `src/test/architecture/dependency-boundaries.test.ts`（新增 `shared/utils` 边界用例）

**Interfaces:**
- Produces: `@/shared/utils` 暴露 `cn(...inputs: ClassValue[]): string`（barrel 再导出）。后续 Task 2/4 改写被搬文件 `cn` 引用指向此处。

- [ ] **Step 1: 写失败测试** — `src/shared/utils/cn.test.ts`

```ts
import { describe, it, expect } from 'vitest';
import { cn } from '@/shared/utils';

describe('cn', () => {
  it('合并类名并去重冲突的 tailwind 工具类', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
    expect(cn('text-sm', false && 'hidden', 'font-bold')).toBe('text-sm font-bold');
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `npx vitest run src/shared/utils/cn.test.ts`
Expected: FAIL（无法解析 `@/shared/utils`）

- [ ] **Step 3: 建 `src/shared/utils/cn.ts`**

```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 4: 建 `src/shared/utils/index.ts`**

```ts
export { cn } from './cn';
```

- [ ] **Step 5: 改写 `src/lib/utils.ts`** — 删除 cn 定义与 `clsx`/`tailwind-merge` 导入，改为再导出；`getPreviewUrl` 原样保留

把文件顶部的

```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

替换为

```ts
export { cn } from "@/shared/utils"
```

（`getPreviewUrl` 函数及其以下内容保持不变。）

- [ ] **Step 6: 扩展边界测试** — 在 `dependency-boundaries.test.ts` 的 `describe` 内、`shared/i18n` 用例之后新增

```ts
  it('shared/utils 不导入任何 @/ 业务路径', () => {
    const forbidden = /^@\//;
    expect(offenders(join(SRC, 'shared', 'utils'), forbidden)).toEqual([]);
  });
```

- [ ] **Step 7: 跑测试确认通过**

Run: `npx vitest run src/shared/utils/cn.test.ts src/test/architecture/dependency-boundaries.test.ts`
Expected: PASS

- [ ] **Step 8: 全量门禁**

Run: `npx tsc -b && npx vitest run`
Expected: tsc 无错；vitest 全绿（363 + 新增用例）

- [ ] **Step 9: 提交**

```bash
git add src/shared/utils/cn.ts src/shared/utils/index.ts src/shared/utils/cn.test.ts src/lib/utils.ts src/test/architecture/dependency-boundaries.test.ts
git commit -q -m "feat(p2b): cn 迁入 shared/utils，lib/utils 改为再导出"
```

---

## Task 2: `primitives` → `package/ui/primitives`（+ 旧址 shim）

**Files:**
- Move: `src/ui/primitives/*.tsx` → `src/package/ui/primitives/*.tsx`（约 53 个）
- Modify: 被搬文件内部 `@/lib/utils`→`@/shared/utils`、`@/ui/primitives/`→`@/package/ui/primitives/`
- Create: `src/ui/primitives/<name>.tsx` 逐文件 shim（约 53 个）

**Interfaces:**
- Consumes: `@/shared/utils` 的 `cn`（Task 1）。
- Produces: `@/package/ui/primitives/<name>` 全部具名导出；旧 `@/ui/primitives/<name>` 经 shim 等价转发。

- [ ] **Step 1: 建目标目录并搬迁**

```bash
mkdir -p src/package/ui/primitives
git mv src/ui/primitives/*.tsx src/package/ui/primitives/
```

- [ ] **Step 2: 重写被搬文件内部引用**（cn 指向 shared、同级指向新址）

```bash
find src/package/ui/primitives -name '*.tsx' -exec sed -i \
  -e "s#@/lib/utils#@/shared/utils#g" \
  -e "s#@/ui/primitives/#@/package/ui/primitives/#g" {} +
```

- [ ] **Step 3: 在旧址逐文件生成 shim**（按新址实际文件名生成 `export *` 转发）

```bash
for f in src/package/ui/primitives/*.tsx; do
  name=$(basename "$f" .tsx)
  printf "export * from '@/package/ui/primitives/%s';\n" "$name" > "src/ui/primitives/$name.tsx"
done
```

- [ ] **Step 4: 类型检查**

Run: `npx tsc -b`
Expected: 无错。若某文件报「无默认导出」缺失，说明该 primitive 有 `export default`——为对应 shim 追加一行 `export { default } from '@/package/ui/primitives/<name>';` 后重跑。

- [ ] **Step 5: 跑测试**

Run: `npx vitest run`
Expected: 全绿（363 + Task 1 用例）

- [ ] **Step 6: 提交**（只加 primitives 两侧目录）

```bash
git add src/package/ui/primitives src/ui/primitives
git commit -q -m "refactor(p2b): primitives 迁入 package/ui，旧址留兼容 shim"
```

---

## Task 3: `forms` → `package/ui/forms`（+ 旧址 shim）

**Files:**
- Move: `src/ui/forms/{BilingualInput.tsx,BilingualTextarea.tsx,index.ts,rich-text/}` → `src/package/ui/forms/`
- Create shims: `src/ui/forms/index.ts`、`src/ui/forms/BilingualInput.tsx`、`src/ui/forms/BilingualTextarea.tsx`、`src/ui/forms/rich-text/index.ts`、`src/ui/forms/rich-text/BilingualRichInput.tsx`

**Interfaces:**
- Produces: `@/package/ui/forms` barrel 暴露 `BilingualInput`、`BilingualTextarea`；`@/package/ui/forms/rich-text` 暴露 `BilingualRichInput`、`RichInput`。Task 5 会向 forms barrel 追加 `LinkSelector`。

- [ ] **Step 1: 搬迁整个 forms 子树**

```bash
mkdir -p src/package/ui/forms
git mv src/ui/forms/BilingualInput.tsx src/ui/forms/BilingualTextarea.tsx src/ui/forms/index.ts src/ui/forms/rich-text src/package/ui/forms/
```

（被搬文件无 `@/lib/utils`/`@/ui/primitives` 引用，内部相对引用 `./X` 随目录整体迁移仍有效，无需 sed。）

- [ ] **Step 2: 旧址建 barrel shim** — `src/ui/forms/index.ts`

```ts
export { BilingualInput } from '@/package/ui/forms/BilingualInput';
export { BilingualTextarea } from '@/package/ui/forms/BilingualTextarea';
```

- [ ] **Step 3: 旧址建深路径 shim** — `src/ui/forms/BilingualInput.tsx`

```ts
export * from '@/package/ui/forms/BilingualInput';
export { default } from '@/package/ui/forms/BilingualInput';
```

- [ ] **Step 4: 旧址建深路径 shim** — `src/ui/forms/BilingualTextarea.tsx`

```ts
export * from '@/package/ui/forms/BilingualTextarea';
```

- [ ] **Step 5: 旧址建 rich-text barrel shim** — `src/ui/forms/rich-text/index.ts`

```ts
export { default as BilingualRichInput } from '@/package/ui/forms/rich-text/BilingualRichInput';
export { default as RichInput } from '@/package/ui/forms/rich-text/RichInput';
```

- [ ] **Step 6: 旧址建 rich-text 深路径 shim** — `src/ui/forms/rich-text/BilingualRichInput.tsx`

```ts
export { default } from '@/package/ui/forms/rich-text/BilingualRichInput';
```

- [ ] **Step 7: 门禁**

Run: `npx tsc -b && npx vitest run`
Expected: tsc 无错；vitest 全绿

- [ ] **Step 8: 提交**

```bash
git add src/package/ui/forms src/ui/forms
git commit -q -m "refactor(p2b): forms 迁入 package/ui，旧址留兼容 shim"
```

---

## Task 4: `media` → `package/ui/media`（+ 旧址 shim）

**Files:**
- Move: `src/ui/media/{AdminImage.tsx,ImageInput.tsx,ImageInput.test.tsx,index.ts}` → `src/package/ui/media/`
- Modify: `src/package/ui/media/AdminImage.tsx`（`cn` 引用改 shared，`getPreviewUrl` 保留 `@/lib/utils`）
- Create shims: `src/ui/media/AdminImage.tsx`、`src/ui/media/ImageInput.tsx`、`src/ui/media/index.ts`

**Interfaces:**
- Consumes: `@/shared/utils` 的 `cn`（Task 1）。
- Produces: `@/package/ui/media/AdminImage`、`@/package/ui/media/ImageInput`（均 default）；旧 `@/ui/media/*` 经 shim 转发。

- [ ] **Step 1: 搬迁（含测试文件）**

```bash
mkdir -p src/package/ui/media
git mv src/ui/media/AdminImage.tsx src/ui/media/ImageInput.tsx src/ui/media/ImageInput.test.tsx src/ui/media/index.ts src/package/ui/media/
```

- [ ] **Step 2: 修 `src/package/ui/media/AdminImage.tsx` 的 cn 引用**

把第 4 行

```ts
import { cn } from '@/lib/utils';
```

改为

```ts
import { cn } from '@/shared/utils';
```

（第 2 行 `import { getPreviewUrl } from '@/lib/utils';` **保持不变**。）

- [ ] **Step 3: 旧址建 shim** — `src/ui/media/AdminImage.tsx`

```ts
export { default } from '@/package/ui/media/AdminImage';
```

- [ ] **Step 4: 旧址建 shim** — `src/ui/media/ImageInput.tsx`

```ts
export { default } from '@/package/ui/media/ImageInput';
```

- [ ] **Step 5: 旧址建 barrel shim** — `src/ui/media/index.ts`

```ts
export { default as AdminImage } from '@/package/ui/media/AdminImage';
export { default as ImageInput } from '@/package/ui/media/ImageInput';
```

- [ ] **Step 6: 门禁**

Run: `npx tsc -b && npx vitest run`
Expected: tsc 无错；vitest 全绿（`ImageInput.test` 现位于 `package/ui/media` 仍被收集并通过）

- [ ] **Step 7: 提交**

```bash
git add src/package/ui/media src/ui/media
git commit -q -m "refactor(p2b): media 迁入 package/ui，旧址留兼容 shim"
```

---

## Task 5: `navigation/LinkSelector` 并入 `package/ui/forms`（+ 旧址 shim）

**Files:**
- Move: `src/ui/navigation/LinkSelector.tsx` → `src/package/ui/forms/LinkSelector.tsx`
- Modify: `src/package/ui/forms/LinkSelector.tsx`（`@/ui/primitives/`→`@/package/ui/primitives/`）
- Modify: `src/package/ui/forms/index.ts`（追加 LinkSelector + PageOption 导出）
- Create shims: `src/ui/navigation/LinkSelector.tsx`、`src/ui/navigation/index.ts`

**Interfaces:**
- Consumes: `@/package/ui/primitives/*`（Task 2）。
- Produces: `@/package/ui/forms` 追加暴露 `LinkSelector` 与 type `PageOption`；旧 `@/ui/navigation` 与 `@/ui/navigation/LinkSelector` 经 shim 转发。

- [ ] **Step 1: 搬迁 LinkSelector 到 forms**

```bash
git mv src/ui/navigation/LinkSelector.tsx src/package/ui/forms/LinkSelector.tsx
```

- [ ] **Step 2: 重写其 primitives 引用**

```bash
sed -i "s#@/ui/primitives/#@/package/ui/primitives/#g" src/package/ui/forms/LinkSelector.tsx
```

- [ ] **Step 3: 向 forms barrel 追加导出** — 在 `src/package/ui/forms/index.ts` 末尾追加

```ts
export { LinkSelector } from './LinkSelector';
export type { PageOption } from './LinkSelector';
```

- [ ] **Step 4: 旧址建深路径 shim** — `src/ui/navigation/LinkSelector.tsx`

```ts
export { LinkSelector } from '@/package/ui/forms/LinkSelector';
export type { PageOption } from '@/package/ui/forms/LinkSelector';
```

- [ ] **Step 5: 旧址建 barrel shim** — `src/ui/navigation/index.ts`（替换原内容）

```ts
export { LinkSelector } from '@/package/ui/forms/LinkSelector';
export type { PageOption } from '@/package/ui/forms/LinkSelector';
```

- [ ] **Step 6: 门禁**

Run: `npx tsc -b && npx vitest run`
Expected: tsc 无错；vitest 全绿

- [ ] **Step 7: 提交**

```bash
git add src/package/ui/forms src/ui/navigation
git commit -q -m "refactor(p2b): LinkSelector 并入 package/ui/forms，旧址留兼容 shim"
```

---

## Task 6: 架构锁 + 完整验证 + 文档更新

**Files:**
- Create: `src/test/architecture/ui-base-migrated.test.ts`
- Modify: `docs/superpowers/plans/HANDOFF.md`（更新「当前进度」「下一步」）
- Modify: `.superpowers/sdd/progress.md`（登记 2b 各 Task commit）

**Interfaces:**
- Produces: 架构断言——`package/ui/{primitives,forms,media}` 存在真身；旧 `src/ui/{primitives,forms,media,navigation}` 仅含 re-export 垫片。

- [ ] **Step 1: 写架构锁测试** — `src/test/architecture/ui-base-migrated.test.ts`

```ts
import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SRC = join(process.cwd(), 'src');

function files(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...files(full));
    else if (/\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name)) out.push(full);
  }
  return out;
}

describe('Phase 2b: UI 基础层已迁入 package/ui', () => {
  it('真身落在 package/ui 下', () => {
    expect(existsSync(join(SRC, 'package/ui/primitives/button.tsx'))).toBe(true);
    expect(existsSync(join(SRC, 'package/ui/forms/BilingualInput.tsx'))).toBe(true);
    expect(existsSync(join(SRC, 'package/ui/forms/LinkSelector.tsx'))).toBe(true);
    expect(existsSync(join(SRC, 'package/ui/media/AdminImage.tsx'))).toBe(true);
  });

  it('旧 src/ui/{primitives,forms,media,navigation} 仅含 re-export 垫片', () => {
    const reExportOnly = /^(\s*(\/\/.*|export \* from '[^']+';|export (type )?\{[^}]*\} from '[^']+';))+\s*$/;
    for (const dir of ['ui/primitives', 'ui/forms', 'ui/media', 'ui/navigation']) {
      for (const f of files(join(SRC, dir))) {
        const body = readFileSync(f, 'utf8').trim();
        expect(reExportOnly.test(body), `${f} 应只含 re-export`).toBe(true);
      }
    }
  });
});
```

- [ ] **Step 2: 跑架构锁测试**

Run: `npx vitest run src/test/architecture/ui-base-migrated.test.ts`
Expected: PASS（若失败，按报错文件名补全/修正对应 shim 体）

- [ ] **Step 3: 完整门禁（含 build）**

Run: `npx tsc -b && npx vitest run && npm run build`
Expected: 三者全绿

- [ ] **Step 4: 人工浏览器烟测**

Run: `npm run dev` → http://localhost:3000
Expected: 登录、菜单、图片显示（AdminImage）、富文本/双语输入、链接选择器等页面与重构前一致。

- [ ] **Step 5: 更新 `HANDOFF.md`** — 将「当前进度」加入一行 **Phase 2b 完成**（UI 基础层 primitives/forms/media/navigation→package/ui，cn→shared/utils，旧址留 shim），并把「下一步」第 2 点改为指向 **Phase 2c**（薄包装器→真身 + `package/{types,entities,adapters}`）。记录遗留：`AdminLayout`→`@/features/build`、`src/components/ui` 死副本、shared/media→`@/ui` 旧引用（经 shim）均待后续阶段。

- [ ] **Step 6: 更新 `.superpowers/sdd/progress.md`** — 追加 2b 六个 Task 的 commit 哈希与一句话结论。

- [ ] **Step 7: 提交**

```bash
git add src/test/architecture/ui-base-migrated.test.ts docs/superpowers/plans/HANDOFF.md .superpowers/sdd/progress.md
git commit -q -m "test(p2b): 架构锁 UI 基础层迁移 + 更新交接/进度文档"
```

---

## Self-Review

- **Spec 覆盖**：设计文档 §4「package/ui 含 primitives/forms/media」与 §7「基础 UI 随项目替换」→ Task 2/3/4/5 覆盖；§13「Translation 属 shared、cn 类技术工具属 shared」→ Task 1 覆盖 cn；navigation 经决策并入 forms（设计文档 package/ui 无 navigation 目录）。
- **Placeholder 扫描**：无「TODO/适当处理」；primitives 53 文件用脚本生成（非占位），并给出「报缺默认导出时追加 `export { default }`」的确定性兜底。
- **类型一致**：shim 再导出名与真身一致（`BilingualInput` 含 default、`BilingualTextarea` 具名、`AdminImage`/`ImageInput` default、`LinkSelector`+type `PageOption`、`BilingualRichInput`/`RichInput` default）；`cn` 签名贯穿 Task 1→2→4 一致。
- **边界**：被搬文件 `cn`→`@/shared/utils`、同级 primitives→`@/package/ui/primitives`，消除经旧址 shim 的回环；`@/types`、`@/features/build`、shared→`@/ui` 等迁移期临时依赖按计划保留至 P4/P5。

## Execution Handoff

计划已保存。两种执行方式：
1. **Subagent-Driven（推荐）**：每 Task 派新 subagent（implementer→review→fix），Task 间复核。
2. **Inline Execution**：本会话按 executing-plans 批量执行 + 检查点。
