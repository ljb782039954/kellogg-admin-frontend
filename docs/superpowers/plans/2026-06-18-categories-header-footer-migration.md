# Categories, Header & Footer Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the `CategoriesEditor`, `HeaderEditor` (navigation), and `FooterEditor` from `ContentContext` into independent `features/` modules.

**Architecture:** Each domain follows `features/<domain>/{api,model,ui}` with a public `index.ts`. Views only consume controller state and events. API calls go through feature `api/` modules. No new code imports `ContentContext`.

**Tech Stack:** React 19, TypeScript, Vite 7, Vitest, Testing Library, MSW, TanStack Query, Zod, React Hook Form, shadcn/ui.

---

## File Structure

### Create

```text
src/features/categories/api/categories.api.ts
src/features/categories/api/categories.api.test.ts
src/features/categories/api/categories.keys.ts
src/features/categories/model/category.schema.ts
src/features/categories/model/category.defaults.ts
src/features/categories/model/useCategoriesEditor.ts
src/features/categories/model/useCategoriesEditor.test.tsx
src/features/categories/ui/CategoriesEditor.tsx
src/features/categories/ui/CategoryListItem.tsx
src/features/categories/index.ts

src/features/navigation/api/navigation.api.ts
src/features/navigation/api/navigation.api.test.ts
src/features/navigation/api/navigation.keys.ts
src/features/navigation/api/pagesIndex.api.ts
src/features/navigation/model/navigation.schema.ts
src/features/navigation/model/navigation.mapper.ts
src/features/navigation/model/navigation.mapper.test.ts
src/features/navigation/model/useNavigationEditor.ts
src/features/navigation/model/useNavigationEditor.test.tsx
src/features/navigation/ui/NavigationEditor.tsx
src/features/navigation/ui/NavigationFormView.tsx
src/features/navigation/ui/NavigationPreview.tsx
src/features/navigation/index.ts

src/features/footer/api/footer.api.ts
src/features/footer/api/footer.api.test.ts
src/features/footer/api/footer.keys.ts
src/features/footer/model/footer.schema.ts
src/features/footer/model/footer.mapper.ts
src/features/footer/model/footer.mapper.test.ts
src/features/footer/model/useFooterEditor.ts
src/features/footer/model/useFooterEditor.test.tsx
src/features/footer/ui/FooterEditor.tsx
src/features/footer/ui/FooterPreview.tsx
src/features/footer/index.ts
```

### Modify

```text
src/App.tsx
src/context/ContentContext.tsx
src/admin/editors/CategoriesEditor.tsx
src/admin/editors/headerEditor/index.tsx
src/admin/editors/FooterEditor.tsx
docs/README.md
```

### Do Not Modify

```text
src/components/blocks/**
src/admin/pageBuilder/**
src/admin/editors/ProductsEditor.tsx
src/admin/MediaManager.tsx
src/admin/media/**
```

---

## Task 1: Create Shared Pages-Index Query Helper

**Files:**
- Create: `src/features/navigation/api/pagesIndex.api.ts`

Both navigation and footer need a lightweight list of existing pages to detect deleted link targets. The existing data is stored under KV key `pages_index` via `/api/config/pages_index`.

- [ ] **Step 1: Implement `pagesIndex.api.ts`**

```ts
import { apiClient } from '@/shared/api/client';
import type { CustomPage } from '@/types';

export function getPagesIndex(): Promise<CustomPage[]> {
  return apiClient.request<CustomPage[]>('/api/config/pages_index').catch((err) => {
    if (err.code === 'NOT_FOUND') {
      return [];
    }
    throw err;
  });
}
```

- [ ] **Step 2: Add a query key constant**

Inside `src/features/navigation/api/navigation.keys.ts`:

```ts
export const navigationKeys = {
  all: ['navigation'] as const,
  header: () => [...navigationKeys.all, 'header'] as const,
  pages: () => [...navigationKeys.all, 'pages'] as const,
};
```

- [ ] **Step 3: Commit**

```powershell
git add src/features/navigation/api
git commit -m "feat(navigation): add pages index query helper"
```

---

## Task 2: Migrate Categories

### Task 2.1 Categories API and Keys

**Files:**
- Create: `src/features/categories/api/categories.api.ts`
- Create: `src/features/categories/api/categories.api.test.ts`
- Create: `src/features/categories/api/categories.keys.ts`

- [ ] **Step 1: Write failing test**

Create `src/features/categories/api/categories.api.test.ts`:

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { requestMock } = vi.hoisted(() => ({
  requestMock: vi.fn(),
}));

vi.mock('@/shared/api/client', () => ({
  apiClient: { request: requestMock },
}));

import { getCategories, createCategory, updateCategory, deleteCategory } from './categories.api';

describe('categories api', () => {
  beforeEach(() => {
    requestMock.mockReset();
  });

  it('loads categories', async () => {
    requestMock.mockResolvedValueOnce([]);
    await expect(getCategories()).resolves.toEqual([]);
    expect(requestMock).toHaveBeenCalledWith('/api/categories');
  });

  it('creates a category', async () => {
    requestMock.mockResolvedValueOnce({ id: 'cat_1' });
    await createCategory({ id: 'cat_1', name_zh: 'zh', name_en: 'en', image: '' });
    expect(requestMock).toHaveBeenCalledWith('/api/categories', {
      method: 'POST',
      body: JSON.stringify({ id: 'cat_1', name_zh: 'zh', name_en: 'en', image: '' }),
    });
  });

  it('updates a category', async () => {
    requestMock.mockResolvedValueOnce({ id: 'cat_1' });
    await updateCategory('cat_1', { name_zh: 'zh2' });
    expect(requestMock).toHaveBeenCalledWith('/api/categories/cat_1', {
      method: 'PUT',
      body: JSON.stringify({ name_zh: 'zh2' }),
    });
  });

  it('deletes a category', async () => {
    requestMock.mockResolvedValueOnce({ success: true });
    await deleteCategory('cat_1');
    expect(requestMock).toHaveBeenCalledWith('/api/categories/cat_1', { method: 'DELETE' });
  });
});
```

- [ ] **Step 2: Implement API**

Create `src/features/categories/api/categories.api.ts`:

```ts
import { apiClient } from '@/shared/api/client';
import type { Category, CategoryInput } from '@/types';

export function getCategories(): Promise<Category[]> {
  return apiClient.request<Category[]>('/api/categories');
}

export function createCategory(data: CategoryInput): Promise<Category> {
  return apiClient.request<Category>('/api/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateCategory(id: string, data: Partial<CategoryInput>): Promise<Category> {
  return apiClient.request<Category>(`/api/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteCategory(id: string): Promise<{ success: boolean }> {
  return apiClient.request<{ success: boolean }>(`/api/categories/${id}`, {
    method: 'DELETE',
  });
}
```

- [ ] **Step 3: Add keys**

Create `src/features/categories/api/categories.keys.ts`:

```ts
export const categoryKeys = {
  all: ['categories'] as const,
  list: () => [...categoryKeys.all, 'list'] as const,
};
```

- [ ] **Step 4: Run tests and commit**

```powershell
npm.cmd test -- src/features/categories/api/categories.api.test.ts
git add src/features/categories/api
git commit -m "feat(categories): add categories api and keys"
```

### Task 2.2 Categories Model

**Files:**
- Create: `src/features/categories/model/category.schema.ts`
- Create: `src/features/categories/model/category.defaults.ts`
- Create: `src/features/categories/model/useCategoriesEditor.ts`
- Create: `src/features/categories/model/useCategoriesEditor.test.tsx`

- [ ] **Step 1: Define defaults**

Create `src/features/categories/model/category.defaults.ts`:

```ts
import { nanoid } from 'nanoid';
import type { Category } from '@/types';

export function createDefaultCategory(): Category {
  return {
    id: `cat_${nanoid(8)}`,
    name: { zh: '新分类', en: 'New Category' },
    image: '',
  };
}
```

- [ ] **Step 2: Define schema**

Create `src/features/categories/model/category.schema.ts`:

```ts
import { z } from 'zod';
import { translationSchema } from '@/shared/forms/types';

export const categorySchema = z.object({
  id: z.string().min(1),
  name: translationSchema,
  image: z.string(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
```

If `src/shared/forms/types` does not exist, define `translationSchema` locally first and later move it to `shared/forms`.

- [ ] **Step 3: Implement controller**

Create `src/features/categories/model/useCategoriesEditor.ts`:

```ts
import { useCallback, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Category } from '@/types';
import { categoryKeys } from '../api/categories.keys';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api/categories.api';
import { createDefaultCategory } from './category.defaults';

export function useCategoriesEditor() {
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);
  const [draft, setDraft] = useState<Category[] | null>(null);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: categoryKeys.list(),
    queryFn: getCategories,
  });

  const localCategories = draft ?? categories;

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: categoryKeys.list() }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) => updateCategory(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: categoryKeys.list() }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: categoryKeys.list() }),
  });

  const isSaving = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;
  const error = (createMutation.error || updateMutation.error || deleteMutation.error)?.message ?? null;

  const addCategory = useCallback(() => {
    setDraft((prev) => [...(prev ?? categories), createDefaultCategory()]);
  }, [categories]);

  const updateCategoryByIndex = useCallback((index: number, patch: Partial<Category>) => {
    setDraft((prev) => {
      const list = [...(prev ?? categories)];
      list[index] = { ...list[index], ...patch };
      return list;
    });
  }, [categories]);

  const removeCategory = useCallback((index: number) => {
    setDraft((prev) => {
      const list = [...(prev ?? categories)];
      list.splice(index, 1);
      return list;
    });
  }, [categories]);

  const save = useCallback(async () => {
    const original = categories;
    const current = localCategories;

    for (const localCat of current) {
      const exists = original.find((c) => c.id === localCat.id);
      if (!exists) {
        await createMutation.mutateAsync({
          id: localCat.id,
          name_zh: localCat.name.zh,
          name_en: localCat.name.en,
          image: localCat.image,
        });
      } else {
        const hasChanges =
          localCat.name.zh !== exists.name.zh ||
          localCat.name.en !== exists.name.en ||
          localCat.image !== exists.image;

        if (hasChanges) {
          await updateMutation.mutateAsync({
            id: localCat.id,
            data: {
              name_zh: localCat.name.zh,
              name_en: localCat.name.en,
              image: localCat.image,
            },
          });
        }
      }
    }

    for (const originalCat of original) {
      const stillExists = current.find((c) => c.id === originalCat.id);
      if (!stillExists) {
        await deleteMutation.mutateAsync(originalCat.id);
      }
    }

    setSaved(true);
    setDraft(null);
    setTimeout(() => setSaved(false), 2000);
  }, [categories, localCategories, createMutation, updateMutation, deleteMutation]);

  return useMemo(
    () => ({
      categories: localCategories,
      isLoading,
      isSaving,
      saved,
      error,
      addCategory,
      updateCategory: updateCategoryByIndex,
      removeCategory,
      save,
    }),
    [localCategories, isLoading, isSaving, saved, error, addCategory, updateCategoryByIndex, removeCategory, save],
  );
}
```

- [ ] **Step 4: Write controller test**

Create `src/features/categories/model/useCategoriesEditor.test.tsx`:

```tsx
import { describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/mocks/server';
import { useCategoriesEditor } from './useCategoriesEditor';

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('useCategoriesEditor', () => {
  it('creates, updates and deletes categories on save', async () => {
    server.use(
      http.get('/api/categories', () => HttpResponse.json([
        { id: 'cat_1', name: { zh: 'A', en: 'A' }, image: '' },
      ])),
      http.post('/api/categories', async () => HttpResponse.json({ id: 'cat_2' })),
      http.put('/api/categories/cat_1', async () => HttpResponse.json({ id: 'cat_1' })),
      http.delete('/api/categories/cat_1', () => HttpResponse.json({ success: true })),
    );

    const { result } = renderHook(() => useCategoriesEditor(), { wrapper });

    await waitFor(() => expect(result.current.categories).toHaveLength(1));

    act(() => result.current.addCategory());
    expect(result.current.categories).toHaveLength(2);

    act(() => result.current.updateCategory(0, { name: { zh: 'A2', en: 'A2' } }));

    await act(async () => {
      await result.current.save();
    });

    expect(result.current.saved).toBe(true);
  });
});
```

- [ ] **Step 5: Run tests and commit**

```powershell
npm.cmd test -- src/features/categories/model
git add src/features/categories/model
git commit -m "feat(categories): add categories editor controller"
```

### Task 2.3 Categories UI

**Files:**
- Create: `src/features/categories/ui/CategoryListItem.tsx`
- Create: `src/features/categories/ui/CategoriesEditor.tsx`
- Create: `src/features/categories/index.ts`

- [ ] **Step 1: Move visual layout from old CategoriesEditor**

Create `src/features/categories/ui/CategoriesEditor.tsx` by copying the JSX from `src/admin/editors/CategoriesEditor.tsx`, replacing `useContent` with `useCategoriesEditor` and removing `useState/useEffect`.

- [ ] **Step 2: Create `CategoryListItem.tsx`**

Extract the per-category card into a small view component to keep the editor readable.

- [ ] **Step 3: Create `index.ts`**

```ts
export { CategoriesEditor } from './ui/CategoriesEditor';
export type { CategoryFormValues } from './model/category.schema';
```

- [ ] **Step 4: Run tests and commit**

```powershell
git add src/features/categories/ui src/features/categories/index.ts
git commit -m "feat(categories): add categories editor ui"
```

---

## Task 3: Migrate Footer

### Task 3.1 Footer API and Keys

**Files:**
- Create: `src/features/footer/api/footer.api.ts`
- Create: `src/features/footer/api/footer.api.test.ts`
- Create: `src/features/footer/api/footer.keys.ts`

- [ ] **Step 1: Implement API**

```ts
import { apiClient } from '@/shared/api/client';
import type { FooterContent } from '@/types';

export function getFooter(): Promise<FooterContent> {
  return apiClient.request<FooterContent>('/api/config/footer_config').catch((err) => {
    if (err.code === 'NOT_FOUND') {
      return null as unknown as FooterContent;
    }
    throw err;
  });
}

export function updateFooter(footer: FooterContent): Promise<{ success: boolean }> {
  return apiClient.request<{ success: boolean }>('/api/config', {
    method: 'POST',
    body: JSON.stringify({ key: 'footer_config', value: footer }),
  });
}
```

- [ ] **Step 2: Add keys**

```ts
export const footerKeys = {
  all: ['footer'] as const,
  detail: () => [...footerKeys.all, 'detail'] as const,
};
```

- [ ] **Step 3: Run tests and commit**

```powershell
git add src/features/footer/api
git commit -m "feat(footer): add footer api and keys"
```

### Task 3.2 Footer Model

**Files:**
- Create: `src/features/footer/model/footer.schema.ts`
- Create: `src/features/footer/model/footer.mapper.ts`
- Create: `src/features/footer/model/footer.mapper.test.ts`
- Create: `src/features/footer/model/useFooterEditor.ts`
- Create: `src/features/footer/model/useFooterEditor.test.tsx`

- [ ] **Step 1: Define schema**

```ts
import { z } from 'zod';
import { translationSchema } from '@/shared/forms/types';

const footerLinkSchema = z.object({
  id: z.string(),
  name: translationSchema,
  linkType: z.enum(['internal', 'external']),
  href: z.string(),
  pageDeleted: z.boolean().optional(),
});

const footerLinkGroupSchema = z.object({
  id: z.string(),
  title: translationSchema,
  links: z.array(footerLinkSchema),
});

export const footerSchema = z.object({
  linkGroups: z.array(footerLinkGroupSchema),
  newsletterPlaceholder: translationSchema,
  newsletterButton: translationSchema,
});

export type FooterFormValues = z.infer<typeof footerSchema>;
```

- [ ] **Step 2: Implement mapper with legacy conversion**

```ts
import { nanoid } from 'nanoid';
import type { FooterContent, FooterLink, FooterLinkGroup, NavLink } from '@/types';

function migrateLinkType(link: FooterLink): FooterLink {
  if (link.linkType) return link;
  return {
    ...link,
    linkType: link.href?.startsWith('http') ? 'external' : 'internal',
  };
}

export function toFooterForm(raw: FooterContent | null | undefined): FooterContent {
  if (!raw) {
    return {
      linkGroups: [],
      newsletterPlaceholder: { zh: '输入邮箱订阅', en: 'Enter email to subscribe' },
      newsletterButton: { zh: '订阅', en: 'Subscribe' },
    };
  }

  return {
    ...raw,
    linkGroups: raw.linkGroups.map((group) => ({
      ...group,
      id: group.id || nanoid(8),
      links: group.links.map((link) => ({
        ...migrateLinkType(link),
        id: link.id || nanoid(8),
      })),
    })),
  };
}

export function createEmptyLink(): FooterLink {
  return {
    id: nanoid(8),
    name: { zh: '新链接', en: 'New Link' },
    linkType: 'internal',
    href: '',
  };
}

export function createEmptyGroup(): FooterLinkGroup {
  return {
    id: nanoid(8),
    title: { zh: '新分组', en: 'New Group' },
    links: [],
  };
}

export function checkPageExists(href: string, linkType: string, pages: NavLink[] | { path?: string }[]): boolean {
  if (linkType === 'external') return true;
  if (!href) return false;
  return pages.some((p) => ('path' in p ? p.path : (p as any).href) === href);
}
```

- [ ] **Step 3: Write mapper tests**

- [ ] **Step 4: Implement controller**

`useFooterEditor` loads `footer_config`, applies `toFooterForm`, exposes draft mutations and save.

- [ ] **Step 5: Run tests and commit**

```powershell
git add src/features/footer/model
git commit -m "feat(footer): add footer mapper and editor controller"
```

### Task 3.3 Footer UI

**Files:**
- Create: `src/features/footer/ui/FooterEditor.tsx`
- Create: `src/features/footer/ui/FooterPreview.tsx`
- Create: `src/features/footer/index.ts`

- [ ] **Step 1: Move visual layout from old FooterEditor**

Keep `FooterPreview` as a separate View component. Use `BilingualInput` and `LinkSelector` from existing paths.

- [ ] **Step 2: Create `index.ts`**

```ts
export { FooterEditor } from './ui/FooterEditor';
export type { FooterFormValues } from './model/footer.schema';
```

- [ ] **Step 3: Run tests and commit**

```powershell
git add src/features/footer/ui src/features/footer/index.ts
git commit -m "feat(footer): add footer editor ui"
```

---

## Task 4: Migrate Navigation / Header

### Task 4.1 Navigation API and Keys

**Files:**
- Create: `src/features/navigation/api/navigation.api.ts`
- Create: `src/features/navigation/api/navigation.api.test.ts`
- Create: `src/features/navigation/api/navigation.keys.ts` (already created in Task 1)

- [ ] **Step 1: Implement API**

```ts
import { apiClient } from '@/shared/api/client';
import type { HeaderContent } from '@/types';

export function getHeader(): Promise<HeaderContent> {
  return apiClient.request<HeaderContent>('/api/config/header_config').catch((err) => {
    if (err.code === 'NOT_FOUND') {
      return null as unknown as HeaderContent;
    }
    throw err;
  });
}

export function updateHeader(header: HeaderContent): Promise<{ success: boolean }> {
  return apiClient.request<{ success: boolean }>('/api/config', {
    method: 'POST',
    body: JSON.stringify({ key: 'header_config', value: header }),
  });
}
```

- [ ] **Step 2: Run tests and commit**

```powershell
git add src/features/navigation/api
git commit -m "feat(navigation): add navigation api and keys"
```

### Task 4.2 Navigation Model

**Files:**
- Create: `src/features/navigation/model/navigation.schema.ts`
- Create: `src/features/navigation/model/navigation.mapper.ts`
- Create: `src/features/navigation/model/navigation.mapper.test.ts`
- Create: `src/features/navigation/model/useNavigationEditor.ts`
- Create: `src/features/navigation/model/useNavigationEditor.test.tsx`

- [ ] **Step 1: Define schema**

```ts
import { z } from 'zod';
import { translationSchema } from '@/shared/forms/types';

const navLinkSchema: z.ZodType = z.lazy(() =>
  z.object({
    id: z.string(),
    name: translationSchema,
    linkType: z.enum(['internal', 'external']),
    href: z.string(),
    pageDeleted: z.boolean().optional(),
    children: z.array(navLinkSchema).optional(),
  }),
);

export const headerSchema = z.object({
  logoText: translationSchema,
  navItems: z.array(navLinkSchema),
});

export type HeaderFormValues = z.infer<typeof headerSchema>;
```

- [ ] **Step 2: Implement mapper**

```ts
import { nanoid } from 'nanoid';
import type { HeaderContent, NavLink } from '@/types';

function migrateNavLink(link: NavLink): NavLink {
  const linkType = link.linkType || (link.href?.startsWith('http') ? 'external' : 'internal');
  return {
    ...link,
    id: link.id || nanoid(8),
    linkType,
    children: link.children?.map(migrateNavLink),
  };
}

export function toHeaderForm(raw: HeaderContent | null | undefined): HeaderContent {
  if (!raw) {
    return { logoText: { zh: '', en: '' }, navItems: [] };
  }

  return {
    ...raw,
    navItems: raw.navItems.map(migrateNavLink),
  };
}

export function createEmptyNavLink(): NavLink {
  return {
    id: nanoid(8),
    name: { zh: '新菜单', en: 'New Menu' },
    linkType: 'internal',
    href: '',
    children: [],
  };
}
```

- [ ] **Step 3: Implement controller**

`useNavigationEditor` loads `header_config` and pages index, applies mapper, enforces max 5 main nav items on save, and exposes save/reset/error state.

- [ ] **Step 4: Run tests and commit**

```powershell
git add src/features/navigation/model
git commit -m "feat(navigation): add navigation mapper and editor controller"
```

### Task 4.3 Navigation UI

**Files:**
- Create: `src/features/navigation/ui/NavigationEditor.tsx`
- Create: `src/features/navigation/ui/NavigationFormView.tsx`
- Create: `src/features/navigation/ui/NavigationPreview.tsx`
- Create: `src/features/navigation/index.ts`

- [ ] **Step 1: Copy NavEditor logic into NavigationFormView**

Preserve the exact nested-array editing behavior and visual layout.

- [ ] **Step 2: Create NavigationEditor container**

Wire `useNavigationEditor` with `NavigationFormView` and `NavigationPreview`.

- [ ] **Step 3: Create `index.ts`**

```ts
export { NavigationEditor } from './ui/NavigationEditor';
export type { HeaderFormValues } from './model/navigation.schema';
```

- [ ] **Step 4: Run tests and commit**

```powershell
git add src/features/navigation/ui src/features/navigation/index.ts
git commit -m "feat(navigation): add navigation editor ui"
```

---

## Task 5: Switch Routes and Clean ContentContext

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/context/ContentContext.tsx`

- [ ] **Step 1: Update `App.tsx`**

Change imports for categories, header, and footer routes to use the new feature editors.

- [ ] **Step 2: Remove migrated methods from `ContentContext`**

Delete `createCategory`, `updateCategory`, `deleteCategory`, `updateHeader`, `updateFooter` from `ContentContext` if no other callers remain. Keep old editor files as dead code until a final cleanup batch.

- [ ] **Step 3: Run tests and commit**

```powershell
npm.cmd test
git add src/App.tsx src/context/ContentContext.tsx
git commit -m "refactor: switch categories/header/footer routes to features"
```

---

## Task 6: Documentation and Final Verification

**Files:**
- Modify: `docs/README.md`

- [ ] **Step 1: Update README navigation tree**

Add:

```text
features/
├── company-info/                公司信息样板
├── categories/                  产品分类管理
├── navigation/                  Header 导航配置
└── footer/                      Footer 页脚配置
```

- [ ] **Step 2: Update constraints note**

Append:

```markdown
当前 `/company`、`/categories`、`/header`、`/footer` 路由已迁移到对应 `features/`，不再依赖 `ContentContext`。
```

- [ ] **Step 3: Run targeted tests**

```powershell
npm.cmd test -- src/features/categories src/features/navigation src/features/footer
```

Expected: all new feature tests pass.

- [ ] **Step 4: Run full tests**

```powershell
npm.cmd test
```

Expected: all tests pass.

- [ ] **Step 5: Run production build**

```powershell
npm.cmd run build
```

Expected: build passes.

- [ ] **Step 6: Run lint on new files**

```powershell
npx.cmd eslint src/features/categories src/features/navigation src/features/footer src/App.tsx src/context/ContentContext.tsx
```

Expected: no lint errors in new files.

- [ ] **Step 7: Check architecture boundaries**

```powershell
Select-String -Path "src/features/categories" -Pattern "@/context/ContentContext" -Recurse
Select-String -Path "src/features/navigation" -Pattern "@/context/ContentContext" -Recurse
Select-String -Path "src/features/footer" -Pattern "@/context/ContentContext" -Recurse
```

Expected: no matches.

- [ ] **Step 8: Commit docs**

```powershell
git add docs/README.md
git commit -m "docs: document categories/header/footer migration"
```

---

## Completion Criteria

- Existing `/categories`, `/header`, `/footer` routes render the new feature editors without visual regressions.
- New feature UI files do not import `ContentContext` or `@/lib/api`.
- `shared/` does not import `features/`.
- Feature files do not import each other's internal directories.
- Category, navigation, and footer mutations invalidate only their own Query caches.
- Targeted tests, full tests, and production build pass.
- Lint baseline is not worsened.
