import type { EntityDefinition } from '@/core/contracts';
import { blogCategoryAdapter } from '@/package/adapters/blog-category.adapter';
import type { BlogCategory, BlogCategoryInput } from '@/package/types';

export const blogCategoryEntity: EntityDefinition<
  BlogCategory,
  BlogCategory,
  BlogCategoryInput
> = {
  key: 'blog-categories',
  endpoint: '/api/blog-categories',
  adapter: blogCategoryAdapter,
  capabilities: { list: true, create: true, update: true, delete: true },
  screens: { list: 'blog-categories' },
};
