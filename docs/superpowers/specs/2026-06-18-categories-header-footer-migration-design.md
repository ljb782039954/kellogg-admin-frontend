# Categories, Header & Footer Migration Design

## Background

Batches 06-16 and 06-17 established the `features/<domain>/{api,model,ui}` pattern for `company-info` and the `shared/media` upload primitives. The next batch migrates three related configuration editors:

- `src/admin/editors/CategoriesEditor.tsx`
- `src/admin/editors/headerEditor/index.tsx` (Header / navigation)
- `src/admin/editors/FooterEditor.tsx`

All three currently read from and write through `ContentContext`, mix local draft state with API orchestration, and embed layout/feedback logic in the same file.

## Goals

- Remove `ContentContext` dependency from the three editor pages.
- Make each domain independently queryable, editable, and testable.
- Preserve current visual behavior, routes, and API contracts.
- Keep `NavEditor.tsx` as a reusable pure view component; do not duplicate its nested-array editing logic.
- Extract Footer-specific domain logic: legacy format conversion, link-validity checking, default values, ID generation.
- Extract Header/Navigation-specific domain logic: legacy link type conversion, max-main-nav enforcement, page-deleted checks.
- Extract Categories-specific logic: optimistic local draft diffing against server list, create/update/delete orchestration.

## Non-Goals

- Do not change the backend API contracts for `/api/categories`, `/api/config/header_config`, `/api/config/footer_config`.
- Do not redesign the visual layout of any editor.
- Do not migrate `LinkSelector`, `BilingualInput`, `BilingualTextControl`, or `ImageInput` beyond reusing their existing exports.
- Do not migrate pages/page-builder, products, media manager, or build feature in this batch.
- Do not delete `ContentContext`; only shrink it by removing the migrated CRUD paths.

## Feature Boundaries

### `features/categories`

Scope: product category list editing.

```text
features/categories/
├── api/
│   ├── categories.api.ts
│   └── categories.keys.ts
├── model/
│   ├── category.schema.ts
│   ├── category.defaults.ts
│   └── useCategoriesEditor.ts
├── ui/
│   ├── CategoriesEditor.tsx
│   └── CategoryListItem.tsx
└── index.ts
```

Key design decisions:

- The legacy editor keeps a local list of categories and computes create/update/delete diffs on save.
- The new controller will expose the same local-list pattern via React Hook Form or controlled state, but the diff computation and mutation orchestration will live in `useCategoriesEditor`.
- API calls go through `categories.api.ts`, not `ContentContext`.
- Mutation success invalidates only `categoryKeys.list()`.

### `features/navigation`

Scope: header / top navigation configuration.

```text
features/navigation/
├── api/
│   ├── navigation.api.ts
│   └── navigation.keys.ts
├── model/
│   ├── navigation.schema.ts
│   ├── navigation.mapper.ts
│   └── useNavigationEditor.ts
├── ui/
│   ├── NavigationEditor.tsx
│   └── NavigationPreview.tsx
└── index.ts
```

Key design decisions:

- The existing `NavEditor.tsx` will be copied/converted into `features/navigation/ui/NavigationFormView.tsx`. Its props remain `navItems: NavLink[]; onChange: (items: NavLink[]) => void`.
- `useNavigationEditor` loads `header_config`, applies legacy conversion, enforces max 5 main nav items on save, and exposes save/reset/error state.
- Preview view consumes the local draft and selected language.
- Page-deleted warnings will be derived by comparing links against a `pages` list query. The `pages` query may be imported as a cross-feature dependency only through a stable public API (e.g. `features/pages/api/pages.api.ts` or a tiny shared `pages.api.ts`). Because pages are not yet migrated, we will keep the page list fetch local to `navigation/api` as a thin wrapper around `/api/config/pages_index` to avoid importing `ContentContext`.

### `features/footer`

Scope: footer link groups and newsletter labels.

```text
features/footer/
├── api/
│   ├── footer.api.ts
│   └── footer.keys.ts
├── model/
│   ├── footer.schema.ts
│   ├── footer.mapper.ts
│   └── useFooterEditor.ts
├── ui/
│   ├── FooterEditor.tsx
│   └── FooterPreview.tsx
└── index.ts
```

Key design decisions:

- `footer.mapper.ts` owns legacy format conversion: ensuring every link has `linkType`, normalizing `pageDeleted`, and applying defaults for missing fields.
- `useFooterEditor` loads `footer_config`, applies the mapper, exposes the draft and mutations.
- Preview view consumes the local draft and selected language.
- Page-deleted warnings derive from the same pages-index query used by navigation.

## Shared Dependencies

Both `navigation` and `footer` need to know whether a link target page still exists. The current `checkPageExists` helper lives in `src/lib/linkUtils.ts` and depends on `content.pages`. We will create a dedicated query:

```text
features/navigation/api/pagesIndex.api.ts
```

This file fetches `/api/config/pages_index` and is the only cross-cutting dependency introduced. It is acceptable because pages are the authoritative source for link validity; after `features/pages` is migrated, this file can be moved/re-exported from `features/pages/api`.

## Controller Contracts

### `useCategoriesEditor`

```ts
{
  categories: Category[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  saved: boolean;
  addCategory: () => void;
  updateCategory: (index: number, patch: Partial<Category>) => void;
  removeCategory: (index: number) => void;
  save: () => Promise<void>;
}
```

### `useNavigationEditor`

```ts
{
  header: HeaderContent;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  saved: boolean;
  hasDeletedPages: boolean;
  previewLang: 'zh' | 'en';
  setPreviewLang: (lang: 'zh' | 'en') => void;
  updateNavItems: (items: NavLink[]) => void;
  save: () => Promise<void>;
}
```

### `useFooterEditor`

```ts
{
  footer: FooterContent;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  saved: boolean;
  hasDeletedPages: boolean;
  previewLang: 'zh' | 'en';
  setPreviewLang: (lang: 'zh' | 'en') => void;
  updateFooter: (patch: Partial<FooterContent>) => void;
  updateLinkGroups: (groups: FooterLinkGroup[]) => void;
  save: () => Promise<void>;
}
```

## Migration of `NavEditor`

The current `src/admin/editors/headerEditor/NavEditor.tsx` is a well-isolated nested-array editor. We will:

1. Create `features/navigation/ui/NavigationFormView.tsx` with the same internal logic and visual layout.
2. Leave the original file in place until the route is switched, then delete it in a follow-up cleanup batch.
3. Update imports inside the new view to use `BilingualInput` and `LinkSelector` from their existing paths.

## State Responsibilities

- TanStack Query caches the server-side category list, header config, footer config, and pages index.
- Local component state holds the editable draft.
- `useEffect` initializes the draft from Query data on first successful load.
- Saving writes to the API, then invalidates or updates the relevant Query cache.
- No `refreshData()` is invoked.

## Testing Strategy

- Unit tests for `category.schema.ts`, `footer.mapper.ts`, and `navigation.mapper.ts`.
- Hook tests for `useCategoriesEditor`, `useNavigationEditor`, and `useFooterEditor` using MSW to intercept `/api/categories`, `/api/config/header_config`, `/api/config/footer_config`, and `/api/config/pages_index`.
- Component smoke tests for each new `*Editor.tsx` ensuring the save button triggers the controller and the preview renders.

## Completion Criteria

- `/categories`, `/header`, and `/footer` routes render the new feature editors.
- `ContentContext` no longer exposes `categories`, `createCategory`, `updateCategory`, `deleteCategory`, `updateHeader`, or `updateFooter` to the migrated pages.
- The old editor files remain compilable but are no longer imported by `App.tsx`.
- All targeted tests, full tests, and production build pass.
- Lint errors in new files are zero; baseline lint errors do not increase.
