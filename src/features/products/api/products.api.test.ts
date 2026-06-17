import { beforeEach, describe, expect, it, vi } from 'vitest';

const { requestMock } = vi.hoisted(() => ({
  requestMock: vi.fn(),
}));

vi.mock('@/shared/api/client', () => ({
  apiClient: { request: requestMock },
}));

import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from './products.api';
import { productKeys } from './products.keys';

describe('products api', () => {
  beforeEach(() => {
    requestMock.mockReset();
  });

  it('defines stable query keys', () => {
    expect(productKeys.lists()).toEqual(['products', 'list']);
    expect(productKeys.list({ category: 'cat_1' })).toEqual(['products', 'list', { category: 'cat_1' }]);
    expect(productKeys.detail(42)).toEqual(['products', 'detail', 42]);
  });

  it('loads paginated products', async () => {
    requestMock.mockResolvedValueOnce({ data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 });

    await expect(getProducts({ page: 1, pageSize: 10 })).resolves.toMatchObject({ data: [], total: 0 });

    expect(requestMock).toHaveBeenCalledWith('/api/products?page=1&pageSize=10');
  });

  it('loads a single product by id', async () => {
    requestMock.mockResolvedValueOnce({ id: 42, name: { zh: '测试', en: 'Test' } });

    await expect(getProduct(42)).resolves.toMatchObject({ id: 42 });

    expect(requestMock).toHaveBeenCalledWith('/api/products/42');
  });

  it('creates a product', async () => {
    requestMock.mockResolvedValueOnce({ id: 1 });

    await createProduct({ name_zh: 'New', name_en: 'New', price: 100 });

    expect(requestMock).toHaveBeenCalledWith('/api/products', {
      method: 'POST',
      body: JSON.stringify({ name_zh: 'New', name_en: 'New', price: 100 }),
    });
  });

  it('updates a product', async () => {
    requestMock.mockResolvedValueOnce({ id: 1 });

    await updateProduct(1, { price: 200 });

    expect(requestMock).toHaveBeenCalledWith('/api/products/1', {
      method: 'PUT',
      body: JSON.stringify({ price: 200 }),
    });
  });

  it('deletes a product', async () => {
    requestMock.mockResolvedValueOnce({ success: true });

    await deleteProduct(1);

    expect(requestMock).toHaveBeenCalledWith('/api/products/1', { method: 'DELETE' });
  });
});
