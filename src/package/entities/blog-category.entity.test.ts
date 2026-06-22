import { describe, expect, it } from 'vitest';
import { blogCategoryAdapter } from '@/package/adapters';
import { blogCategoryEntity } from './blog-category.entity';

describe('blogCategoryEntity', () => {
  it('声明端点、CRUD 能力与稳定 screen id', () => {
    expect(blogCategoryEntity).toMatchObject({
      key: 'blog-categories',
      endpoint: '/api/blog-categories',
      capabilities: { list: true, create: true, update: true, delete: true },
      screens: { list: 'blog-categories' },
    });
    expect(blogCategoryEntity.adapter).toBe(blogCategoryAdapter);
  });
});
