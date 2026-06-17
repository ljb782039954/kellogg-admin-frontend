import { beforeEach, describe, expect, it, vi } from 'vitest';

const { requestMock } = vi.hoisted(() => ({
  requestMock: vi.fn(),
}));

vi.mock('@/shared/api/client', () => ({
  apiClient: { request: requestMock },
}));

import { getCategories, createCategory, updateCategory, deleteCategory } from './categories.api';

describe('categories api', () => {
  beforeEach(() => {
    requestMock.mockReset();
  });

  it('loads categories', async () => {
    requestMock.mockResolvedValueOnce([]);

    await expect(getCategories()).resolves.toEqual([]);
    expect(requestMock).toHaveBeenCalledWith('/api/categories');
  });

  it('creates a category', async () => {
    requestMock.mockResolvedValueOnce({ id: 'cat_1' });

    await createCategory({ id: 'cat_1', name_zh: 'zh', name_en: 'en', image: '' });
    expect(requestMock).toHaveBeenCalledWith('/api/categories', {
      method: 'POST',
      body: JSON.stringify({ id: 'cat_1', name_zh: 'zh', name_en: 'en', image: '' }),
    });
  });

  it('updates a category', async () => {
    requestMock.mockResolvedValueOnce({ id: 'cat_1' });

    await updateCategory('cat_1', { name_zh: 'zh2' });
    expect(requestMock).toHaveBeenCalledWith('/api/categories/cat_1', {
      method: 'PUT',
      body: JSON.stringify({ name_zh: 'zh2' }),
    });
  });

  it('deletes a category', async () => {
    requestMock.mockResolvedValueOnce({ success: true });

    await deleteCategory('cat_1');
    expect(requestMock).toHaveBeenCalledWith('/api/categories/cat_1', { method: 'DELETE' });
  });
});
