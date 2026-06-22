import { describe, expect, it } from 'vitest';
import { blogAdapter } from '@/package/adapters';
import { blogEntity } from './blog.entity';

describe('blogEntity', () => {
  it('声明 CRUD、分页默认值和稳定 screen id', () => {
    expect(blogEntity).toMatchObject({
      key: 'blogs',
      endpoint: '/api/blogs',
      capabilities: { list: true, create: true, update: true, delete: true },
      defaultFilters: { page: 1, pageSize: 10 },
      screens: { list: 'blog-list', editor: 'blog-edit' },
    });
    expect(blogEntity.adapter).toBe(blogAdapter);
  });
});
