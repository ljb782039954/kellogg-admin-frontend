import { describe, expect, it } from 'vitest';
import { productAdapter } from '@/package/adapters';
import { productEntity } from './product.entity';

describe('productEntity', () => {
  it('声明 CRUD、分页默认值和组合编辑 screen', () => {
    expect(productEntity).toMatchObject({
      key: 'products',
      endpoint: '/api/products',
      capabilities: { list: true, create: true, update: true, delete: true },
      defaultFilters: { page: 1, pageSize: 20 },
      screens: { list: 'products', editor: 'products' },
    });
    expect(productEntity.adapter).toBe(productAdapter);
  });
});
