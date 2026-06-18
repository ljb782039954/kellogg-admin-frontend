# Plan: Blogs and Blog Categories Migration

## Overview

This plan implements the design in `docs/superpowers/specs/2026-06-19-blogs-migration-design.md`. It migrates the blog posts and blog categories pages from `src/admin/` into the `features/` architecture.

## Affected Code

- Existing files kept as thin compatibility stubs:
  - `src/admin/BlogManagement.tsx`
  - `src/admin/BlogEditor.tsx`
  - `src/admin/BlogCategoryManager.tsx`
- New feature modules:
  - `src/features/blogs/`
  - `src/features/blog-categories/`
- Route wiring:
  - `src/App.tsx`
- Documentation:
  - `docs/README.md`

## Step-by-Step Plan

### 1. Create `features/blog-categories`

1.1 Add `src/features/blog-categories/api/blogCategories.api.ts`
- Implement `getBlogCategories`, `createBlogCategory`, `updateBlogCategory`, `deleteBlogCategory`, `reorderBlogCategories`.
- Use `@/shared/api/client` directly (not `@/lib/api`).

1.2 Add `src/features/blog-categories/api/blogCategories.keys.ts`
- Define `blogCategoryKeys.all` and `blogCategoryKeys.list`.

1.3 Add `src/features/blog-categories/api/blogCategories.api.test.ts`
- Test each API function against mocked client responses.

1.4 Add model files:
- `src/features/blog-categories/model/blogCategory.schema.ts` (Zod schema with `name: {zh, en}`)
- `src/features/blog-categories/model/blogCategory.mapper.ts` (to DTO / from DTO)
- `src/features/blog-categories/model/blogCategory.defaults.ts` (default form values)

1.5 Add `src/features/blog-categories/model/useBlogCategoriesManager.ts`
- Query categories.
- Provide create, update, delete, and reorder actions.
- Maintain the inline editing row state.

1.6 Add `src/features/blog-categories/model/useBlogCategoriesManager.test.tsx`
- Mock API and test CRUD + reorder behavior.

1.7 Add UI:
- `src/features/blog-categories/ui/BlogCategoriesManager.tsx`
- `src/features/blog-categories/ui/BlogCategoryRow.tsx`

1.8 Add `src/features/blog-categories/index.ts`
- Public exports: `BlogCategoriesManager`, `getBlogCategories`, `blogCategoryKeys`, types.

### 2. Create `features/blogs`

2.1 Add `src/features/blogs/api/blogs.api.ts`
- Implement `getBlogs`, `getBlogById`, `createBlog`, `updateBlog`, `deleteBlog`, `toggleBlogStatus`.
- Use `@/shared/api/client` directly.

2.2 Add `src/features/blogs/api/blogs.keys.ts`
- Define `blogKeys.all`, `blogKeys.list`, `blogKeys.detail(id)`.

2.3 Add `src/features/blogs/api/blogs.api.test.ts`
- Test each API function.

2.4 Add model files:
- `src/features/blogs/model/blog.schema.ts` (Zod schema with nested translations)
- `src/features/blogs/model/blog.mapper.ts` (to DTO / from DTO)
- `src/features/blogs/model/blog.defaults.ts` (default form values)

2.5 Add `src/features/blogs/model/useBlogsManager.ts`
- Query paginated list with filters.
- Provide delete and status toggle mutations.
- Expose filters and pagination state.

2.6 Add `src/features/blogs/model/useBlogsManager.test.tsx`
- Test filtering and mutations.

2.7 Add `src/features/blogs/model/useBlogEditor.ts`
- Handle create/edit loading.
- Initialize React Hook Form from existing blog using `useMemo` (no `setState` in effect).
- Submit calls create/update mutation.
- Import category list from `@/features/blog-categories` public index.

2.8 Add `src/features/blogs/model/useBlogEditor.test.tsx`
- Test draft init, submit, and category loading.

2.9 Add UI:
- `src/features/blogs/ui/BlogsManager.tsx`
- `src/features/blogs/ui/BlogList.tsx`
- `src/features/blogs/ui/BlogEditor.tsx`
- `src/features/blogs/ui/BlogForm.tsx`
- `src/features/blogs/ui/MarkdownEditor.tsx`
- `src/features/blogs/ui/TagInput.tsx`

2.10 Add `src/features/blogs/index.ts`
- Public exports: `BlogsManager`, `BlogEditor`, types.

### 3. Wire Routes

3.1 Update `src/App.tsx`
- Replace `/blog`, `/blog/new`, and `/blog/:id/edit` with `BlogsManager` and `BlogEditor` from `features/blogs`.
- Replace `/blog-categories` with `BlogCategoriesManager` from `features/blog-categories`.

### 4. Update Legacy Stubs

4.1 `src/admin/BlogManagement.tsx`
- Re-export `BlogsManager` from `features/blogs`.

4.2 `src/admin/BlogEditor.tsx`
- Re-export `BlogEditor` from `features/blogs`.

4.3 `src/admin/BlogCategoryManager.tsx`
- Re-export `BlogCategoriesManager` from `features/blog-categories`.

### 5. Documentation

5.1 Update `docs/README.md`
- Add `features/blogs` and `features/blog-categories` to the directory tree.
- Update the migration status table.

### 6. Verification

6.1 Run targeted tests for new feature API and controllers.
6.2 Run full test suite.
6.3 Run production build.
6.4 Run lint with architecture boundary checks.

## Rollback

If verification fails, keep the old imports in `src/App.tsx` active and delete the new feature directories. Restore old admin files from git if necessary.

## Definition of Done

- `/blog`, `/blog/new`, `/blog/:id/edit`, `/blog-categories` render the new feature components.
- New feature UI does not import `@/lib/api` or `@/context/ContentContext`.
- Blog editor category dropdown works using the shared blog-categories query.
- All tests, build, and lint pass.
- Docs/README.md reflects the new feature layout.
