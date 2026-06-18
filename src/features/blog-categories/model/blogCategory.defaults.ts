import type { BlogCategoryFormValues } from './blogCategory.schema';

export function createDefaultBlogCategory(
  overrides?: Partial<BlogCategoryFormValues>,
): BlogCategoryFormValues {
  return {
    id: 0,
    name: { zh: '', en: '' },
    slug: '',
    sortOrder: 0,
    articleCount: 0,
    ...overrides,
  };
}
