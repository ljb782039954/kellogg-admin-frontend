import { beforeEach, describe, expect, it, vi } from 'vitest';

const { requestMock } = vi.hoisted(() => ({
  requestMock: vi.fn(),
}));

vi.mock('@/shared/api/client', () => ({
  apiClient: { request: requestMock },
}));

import { getBlogs, getBlog, createBlog, updateBlog, deleteBlog } from './blogs.api';
import { blogKeys } from './blogs.keys';

describe('blogs api', () => {
  beforeEach(() => {
    requestMock.mockReset();
  });

  it('defines stable query keys', () => {
    expect(blogKeys.lists()).toEqual(['blogs', 'list']);
    expect(blogKeys.list({ status: 'published' })).toEqual(['blogs', 'list', { status: 'published' }]);
    expect(blogKeys.detail(42)).toEqual(['blogs', 'detail', 42]);
  });

  it('loads paginated blogs', async () => {
    requestMock.mockResolvedValueOnce({
      data: [],
      pagination: { page: 1, pageSize: 10, total: 0, totalPages: 1 },
    });

    await expect(getBlogs({ page: 1, pageSize: 10 })).resolves.toMatchObject({ data: [] });

    expect(requestMock).toHaveBeenCalledWith('/api/blogs?page=1&pageSize=10');
  });

  it('loads a single blog by id', async () => {
    requestMock.mockResolvedValueOnce({ id: 42, title_zh: '测试', title_en: 'Test' });

    await expect(getBlog(42)).resolves.toMatchObject({ id: 42 });

    expect(requestMock).toHaveBeenCalledWith('/api/blogs/42');
  });

  it('creates a blog', async () => {
    requestMock.mockResolvedValueOnce({ id: 1, message: 'created' });

    await createBlog({ title_zh: '新文章', title_en: 'New Post', slug: 'new-post' });

    expect(requestMock).toHaveBeenCalledWith(
      '/api/blogs',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('updates a blog', async () => {
    requestMock.mockResolvedValueOnce({ message: 'updated' });

    await updateBlog(1, { status: 'published' });

    expect(requestMock).toHaveBeenCalledWith('/api/blogs/1', {
      method: 'PUT',
      body: JSON.stringify({ status: 'published' }),
    });
  });

  it('deletes a blog', async () => {
    requestMock.mockResolvedValueOnce({ message: 'deleted' });

    await deleteBlog(1);

    expect(requestMock).toHaveBeenCalledWith('/api/blogs/1', { method: 'DELETE' });
  });
});
