import type { EntityDefinition } from '@/core/contracts';
import { categoryAdapter } from '@/package/adapters/category.adapter';
import type { Category, CategoryInput } from '@/package/types';

export const categoryEntity: EntityDefinition<Category, Category, CategoryInput> = {
  key: 'categories',
  endpoint: '/api/categories',
  adapter: categoryAdapter,
  capabilities: { list: true, create: true, update: true, delete: true },
  screens: { list: 'categories' },
};
