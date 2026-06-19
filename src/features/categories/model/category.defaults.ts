import { nanoid } from 'nanoid';
import type { CategoryFormValues } from './category.schema';

export function createDefaultCategory(overrides?: Partial<CategoryFormValues>): CategoryFormValues {
  return {
    id: `cat_${nanoid(8)}`,
    name: { zh: '新分类', en: 'New Category' },
    image: '',
    ...overrides,
  };
}
