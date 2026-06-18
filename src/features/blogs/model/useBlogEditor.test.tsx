import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

const {
  getBlogMock,
  createBlogMock,
  updateBlogMock,
  getBlogCategoriesMock,
} = vi.hoisted(() => ({
  getBlogMock: vi.fn(),
  createBlogMock: vi.fn(),
  updateBlogMock: vi.fn(),
  getBlogCategoriesMock: vi.fn(),
}));

vi.mock('../api/blogs.api', () => ({
  getBlog: getBlogMock,
  createBlog: createBlogMock,
  updateBlog: updateBlogMock,
  getBlogs: vi.fn(),
  deleteBlog: vi.fn(),
}));

vi.mock('@/features/blog-categories', () => ({
  getBlogCategories: getBlogCategoriesMock,
  blogCategoryKeys: { lists: () => ['blogCategories', 'list'] },
}));

import { useBlogEditor } from './useBlogEditor';

function createWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter>
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      </MemoryRouter>
    );
  };
}

describe('useBlogEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getBlogCategoriesMock.mockResolvedValue([]);
  });

  it('initializes new blog form with defaults', () => {
    const { result } = renderHook(() => useBlogEditor(undefined), {
      wrapper: createWrapper(),
    });

    expect(result.current.isEdit).toBe(false);
    expect(result.current.form.getValues('status')).toBe('draft');
    expect(result.current.form.getValues('author')).toBe('Admin');
  });

  it('loads existing blog into form', async () => {
    getBlogMock.mockResolvedValueOnce({
      id: 1,
      slug: 'hello',
      title_zh: '你好',
      title_en: 'Hello',
      summary_zh: null,
      summary_en: null,
      content_zh: '',
      content_en: '',
      cover_image: null,
      category: null,
      tags: [],
      author: 'Admin',
      status: 'draft',
      seo_title_zh: null,
      seo_title_en: null,
      seo_desc_zh: null,
      seo_desc_en: null,
      publish_date: null,
      view_count: 0,
      created_at: '',
      updated_at: '',
    });

    const { result } = renderHook(() => useBlogEditor(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isFetching).toBe(false));

    expect(result.current.form.getValues('title.zh')).toBe('你好');
    expect(result.current.form.getValues('slug')).toBe('hello');
  });

  it('creates a new blog on save', async () => {
    createBlogMock.mockResolvedValueOnce({ id: 1, message: 'created' });

    const { result } = renderHook(() => useBlogEditor(undefined), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.form.setValue('title.zh', '标题');
      result.current.form.setValue('title.en', 'Title');
      result.current.form.setValue('slug', 'title');
    });

    await act(async () => {
      await result.current.save('draft');
    });

    expect(createBlogMock).toHaveBeenCalledWith(
      expect.objectContaining({ title_zh: '标题', title_en: 'Title', slug: 'title' }),
    );
  });

  it('updates existing blog on save', async () => {
    getBlogMock.mockResolvedValueOnce({
      id: 1,
      slug: 'hello',
      title_zh: '你好',
      title_en: 'Hello',
      summary_zh: null,
      summary_en: null,
      content_zh: '',
      content_en: '',
      cover_image: null,
      category: null,
      tags: [],
      author: 'Admin',
      status: 'draft',
      seo_title_zh: null,
      seo_title_en: null,
      seo_desc_zh: null,
      seo_desc_en: null,
      publish_date: null,
      view_count: 0,
      created_at: '',
      updated_at: '',
    });
    updateBlogMock.mockResolvedValueOnce({ message: 'updated' });

    const { result } = renderHook(() => useBlogEditor(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isFetching).toBe(false));

    act(() => {
      result.current.form.setValue('title.zh', '新标题');
    });

    await act(async () => {
      await result.current.save('published');
    });

    expect(updateBlogMock).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ title_zh: '新标题', status: 'published' }),
    );
  });
});
