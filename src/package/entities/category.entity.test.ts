import { describe, expect, it } from 'vitest';
import { categoryAdapter } from '@/package/adapters';
import { categoryEntity } from './category.entity';

describe('categoryEntity', () => {
  it('声明 CRUD 端点和稳定 screen id', () => {
    expect(categoryEntity).toMatchObject({
      key: 'categories',
      endpoint: '/api/categories',
      capabilities: { list: true, create: true, update: true, delete: true },
      screens: { list: 'categories' },
    });
    expect(categoryEntity.adapter).toBe(categoryAdapter);
  });
});
