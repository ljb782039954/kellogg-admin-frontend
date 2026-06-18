import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getBlogsMock, deleteBlogMock, updateBlogMock } = vi.hoisted(() => ({
  getBlogsMock: vi.fn(),
  deleteBlogMock: vi.fn(),
  updateBlogMock: vi.fn(),
}));

vi.mock('../api/blogs.api', () => ({
  getBlogs: getBlogsMock,
  deleteBlog: deleteBlogMock,
  updateBlog: updateBlogMock,
  getBlog: vi.fn(),
  createBlog: vi.fn(),
}));

import { useBlogsManager } from './useBlogsManager';

function createWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}

describe('useBlogsManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads paginated blogs', async () => {
    getBlogsMock.mockResolvedValueOnce({
      data: [{ id: 1, title_zh: '文章', title_en: 'Post', status: 'draft', view_count: 0 }],
      pagination: { page: 1, pageSize: 10, total: 1, totalPages: 1 },
    });

    const { result } = renderHook(() => useBlogsManager(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.blogs).toHaveLength(1);
    expect(result.current.total).toBe(1);
  });

  it('toggles blog status', async () => {
    getBlogsMock.mockResolvedValueOnce({
      data: [{ id: 1, title_zh: '文章', title_en: 'Post', status: 'draft', view_count: 0 }],
      pagination: { page: 1, pageSize: 10, total: 1, totalPages: 1 },
    });
    updateBlogMock.mockResolvedValueOnce({ message: 'updated' });

    const { result } = renderHook(() => useBlogsManager(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.toggleStatus(result.current.blogs[0]);
    });

    await waitFor(() => expect(updateBlogMock).toHaveBeenCalledWith(1, { status: 'published' }));
  });

  it('deletes a blog', async () => {
    getBlogsMock.mockResolvedValueOnce({
      data: [{ id: 1, title_zh: '文章', title_en: 'Post', status: 'draft', view_count: 0 }],
      pagination: { page: 1, pageSize: 10, total: 1, totalPages: 1 },
    });
    deleteBlogMock.mockResolvedValueOnce({ message: 'deleted' });
    vi.stubGlobal('confirm', () => true);

    const { result } = renderHook(() => useBlogsManager(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.removeBlog(result.current.blogs[0]);
    });

    expect(deleteBlogMock).toHaveBeenCalledWith(1);
  });
});
