import type { EntityDefinition } from '@/core/contracts';
import { blogAdapter } from '@/package/adapters/blog.adapter';
import type { Blog, BlogInput, BlogsQuery } from '@/package/types';

export const blogEntity: EntityDefinition<Blog, Blog, BlogInput, BlogsQuery> = {
  key: 'blogs',
  endpoint: '/api/blogs',
  adapter: blogAdapter,
  capabilities: { list: true, create: true, update: true, delete: true },
  defaultFilters: { page: 1, pageSize: 10 },
  screens: { list: 'blog-list', editor: 'blog-edit' },
};
