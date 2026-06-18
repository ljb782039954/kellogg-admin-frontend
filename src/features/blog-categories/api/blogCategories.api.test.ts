import { beforeEach, describe, expect, it, vi } from 'vitest';

const { requestMock } = vi.hoisted(() => ({
  requestMock: vi.fn(),
}));

vi.mock('@/shared/api/client', () => ({
  apiClient: { request: requestMock },
}));

import {
  getBlogCategories,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
} from './blogCategories.api';
import { blogCategoryKeys } from './blogCategories.keys';

describe('blogCategories api', () => {
  beforeEach(() => {
    requestMock.mockReset();
  });

  it('defines stable query keys', () => {
    expect(blogCategoryKeys.lists()).toEqual(['blogCategories', 'list']);
    expect(blogCategoryKeys.list({ stale: true })).toEqual(['blogCategories', 'list', { stale: true }]);
  });

  it('loads blog categories', async () => {
    requestMock.mockResolvedValueOnce([
      { id: 1, name_zh: '行业资讯', name_en: 'Industry News', slug: 'industry-news', sort_order: 1 },
    ]);

    await expect(getBlogCategories()).resolves.toHaveLength(1);

    expect(requestMock).toHaveBeenCalledWith('/api/blog-categories');
  });

  it('creates a blog category', async () => {
    requestMock.mockResolvedValueOnce({ id: 1, message: 'created' });

    await createBlogCategory({ name_zh: '分类', name_en: 'Category', slug: 'category' });

    expect(requestMock).toHaveBeenCalledWith('/api/blog-categories', {
      method: 'POST',
      body: JSON.stringify({ name_zh: '分类', name_en: 'Category', slug: 'category' }),
    });
  });

  it('updates a blog category', async () => {
    requestMock.mockResolvedValueOnce({ message: 'updated' });

    await updateBlogCategory(1, { name_zh: '新' });

    expect(requestMock).toHaveBeenCalledWith('/api/blog-categories/1', {
      method: 'PUT',
      body: JSON.stringify({ name_zh: '新' }),
    });
  });

  it('deletes a blog category', async () => {
    requestMock.mockResolvedValueOnce({ message: 'deleted' });

    await deleteBlogCategory(1);

    expect(requestMock).toHaveBeenCalledWith('/api/blog-categories/1', { method: 'DELETE' });
  });
});
