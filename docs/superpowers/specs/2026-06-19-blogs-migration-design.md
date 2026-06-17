# Blogs and Blog Categories Migration Design

## Background

The admin app has separate pages for blog posts (`/blog`, `/blog/new`, `/blog/:id/edit`) and blog categories (`/blog-categories`). Both currently call `api` from `@/lib/api` directly and manage their own local loading/error/state. They do not depend on `ContentContext`, but they still couple UI and API orchestration in the same file.

This batch migrates both domains into `features/` following the established `features/<domain>/{api,model,ui}` pattern.

## Goals

- Move blog post CRUD and list logic into `features/blogs`.
- Move blog category CRUD and reorder logic into `features/blog-categories`.
- Keep the existing Markdown editor, tag input, and blog-category inline editor visual behavior.
- Use React Hook Form + Zod for the blog editor draft.
- Use TanStack Query for server state, cache invalidation, and loading states.
- Make blog editor category dropdown consume blog categories through the public `features/blog-categories` index.
- Remove direct `@/lib/api` imports from the new UI files.

## Non-Goals

- Do not redesign the Markdown editor UI or add WYSIWYG.
- Do not change backend API contracts for `/api/blogs` or `/api/blog-categories`.
- Do not migrate `CustomerReviewsManagement` or `InquiryManagement` in this batch.
- Do not migrate `MediaManager`.

## Feature Boundaries

### `features/blogs`

Scope: blog post list, pagination, filtering, status toggle, delete, create/edit.

```text
features/blogs/
├── api/
│   ├── blogs.api.ts
│   ├── blogs.api.test.ts
│   └── blogs.keys.ts
├── model/
│   ├── blog.schema.ts
│   ├── blog.mapper.ts
│   ├── blog.defaults.ts
│   ├── useBlogsManager.ts
│   ├── useBlogsManager.test.tsx
│   ├── useBlogEditor.ts
│   └── useBlogEditor.test.tsx
├── ui/
│   ├── BlogsManager.tsx
│   ├── BlogList.tsx
│   ├── BlogEditor.tsx
│   ├── BlogForm.tsx
│   ├── MarkdownEditor.tsx
│   └── TagInput.tsx
└── index.ts
```

Key design decisions:

- The list controller `useBlogsManager` exposes filters (search, status, category, page), the paginated list, and mutations for delete/toggle-status.
- The editor controller `useBlogEditor` handles new and edit modes, loads the blog detail, and manages the React Hook Form draft.
- Form values use nested bilingual shapes (`title: {zh, en}`) instead of DTO field names; the mapper converts to `BlogInput`.
- The Markdown editor uses `uploadImage` from `shared/media/api/media.api.ts` for inline image uploads.
- Categories for the editor dropdown come from `features/blog-categories` via its public index.

### `features/blog-categories`

Scope: blog category list, inline create/edit/delete, reorder.

```text
features/blog-categories/
├── api/
│   ├── blogCategories.api.ts
│   ├── blogCategories.api.test.ts
│   └── blogCategories.keys.ts
├── model/
│   ├── blogCategory.schema.ts
│   ├── blogCategory.mapper.ts
│   ├── blogCategory.defaults.ts
│   ├── useBlogCategoriesManager.ts
│   └── useBlogCategoriesManager.test.tsx
├── ui/
│   ├── BlogCategoriesManager.tsx
│   └── BlogCategoryRow.tsx
└── index.ts
```

Key design decisions:

- The controller `useBlogCategoriesManager` holds the local inline editing row and exposes load/save/delete/reorder actions.
- The mapper converts between the form shape (`name: {zh, en}`) and the API DTO (`name_zh`, `name_en`).
- Reorder swaps `sort_order` with the adjacent category via two `updateBlogCategory` calls.
- The public `index.ts` exports `getBlogCategories` and `blogCategoryKeys` so `features/blogs` can query categories without importing internals.

## Cross-Feature Dependency

`features/blogs` needs the category list. The only allowed cross-feature import is from the public index:

```ts
import { getBlogCategories, blogCategoryKeys } from '@/features/blog-categories';
```

## State Responsibilities

- TanStack Query caches blog lists, blog details, and blog category lists.
- React Hook Form holds the blog editor draft.
- Local component state holds list filters, pagination, and inline editing row.
- Mutations invalidate or update the relevant query cache.

## Testing Strategy

- API unit tests mock `@/shared/api/client`.
- Controller hook tests mock feature API modules and TanStack Query cache.
- Mapper tests cover DTO conversion and default values.
- Component smoke tests render the manager and editor with mocked controllers.

## Completion Criteria

- `/blog`, `/blog/new`, `/blog/:id/edit`, and `/blog-categories` render the new feature components.
- New feature UI files do not import `@/lib/api` or `@/context/ContentContext`.
- Blog editor category dropdown works using the shared blog-categories query.
- Targeted tests, full tests, and production build pass.
- Lint errors in new files are zero.
