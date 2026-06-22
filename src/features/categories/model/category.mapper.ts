import type { Category, CategoryInput } from '@/package/types';
import type { CategoryFormValues } from './category.schema';
import { createDefaultCategory } from './category.defaults';

export function toCategoryFormValues(category: Category | null | undefined): CategoryFormValues {
  if (!category) return { ...createDefaultCategory(), id: '' };
  return {
    id: category.id,
    name: { zh: category.name?.zh ?? '', en: category.name?.en ?? '' },
    image: category.image ?? '',
  };
}

export function toCategoryInput(form: CategoryFormValues): CategoryInput {
  return {
    id: form.id,
    name_zh: form.name.zh,
    name_en: form.name.en,
    image: form.image || undefined,
  };
}
