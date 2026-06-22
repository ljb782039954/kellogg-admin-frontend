import type { BlogCategory, BlogCategoryInput } from '@/package/types';
import { blogCategorySchema, type BlogCategoryFormValues } from './blogCategory.schema';
import { createDefaultBlogCategory } from './blogCategory.defaults';

export { blogCategorySchema };
export type { BlogCategoryFormValues };

export function toBlogCategoryInput(form: BlogCategoryFormValues): BlogCategoryInput {
  return {
    name_zh: form.name.zh,
    name_en: form.name.en,
    slug: form.slug || undefined,
    sort_order: form.sortOrder || undefined,
  };
}

export function fromBlogCategoryResponse(
  category: BlogCategory | null | undefined,
): BlogCategoryFormValues {
  if (!category) return createDefaultBlogCategory();

  return blogCategorySchema.parse({
    id: category.id,
    name: { zh: category.name_zh ?? '', en: category.name_en ?? '' },
    slug: category.slug ?? '',
    sortOrder: category.sort_order ?? 0,
    articleCount: category.article_count ?? 0,
  });
}

export function toBlogCategoryFormValues(
  input: Partial<BlogCategoryFormValues> | null | undefined,
): BlogCategoryFormValues {
  return blogCategorySchema.parse({
    ...createDefaultBlogCategory(),
    ...input,
    name: { zh: '', en: '', ...input?.name },
  });
}
