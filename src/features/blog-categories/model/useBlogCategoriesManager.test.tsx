import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  getBlogCategoriesMock,
  createBlogCategoryMock,
  updateBlogCategoryMock,
  deleteBlogCategoryMock,
} = vi.hoisted(() => ({
  getBlogCategoriesMock: vi.fn(),
  createBlogCategoryMock: vi.fn(),
  updateBlogCategoryMock: vi.fn(),
  deleteBlogCategoryMock: vi.fn(),
}));

vi.mock('../api/blogCategories.api', () => ({
  getBlogCategories: getBlogCategoriesMock,
  createBlogCategory: createBlogCategoryMock,
  updateBlogCategory: updateBlogCategoryMock,
  deleteBlogCategory: deleteBlogCategoryMock,
}));

import { useBlogCategoriesManager } from './useBlogCategoriesManager';

function createWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}

describe('useBlogCategoriesManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads categories sorted by sort_order', async () => {
    getBlogCategoriesMock.mockResolvedValueOnce([
      { id: 2, name_zh: 'B', name_en: 'B', slug: 'b', sort_order: 2 },
      { id: 1, name_zh: 'A', name_en: 'A', slug: 'a', sort_order: 1 },
    ]);

    const { result } = renderHook(() => useBlogCategoriesManager(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.categories).toHaveLength(2);
    expect(result.current.categories[0].id).toBe(1);
  });

  it('creates a new category', async () => {
    getBlogCategoriesMock.mockResolvedValueOnce([]);
    createBlogCategoryMock.mockResolvedValueOnce({ id: 1, message: 'created' });

    const { result } = renderHook(() => useBlogCategoriesManager(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.startNew();
    });

    act(() => {
      result.current.updateEditingForm((form) => ({
        ...form,
        name: { zh: '分类', en: 'Category' },
        slug: 'category',
      }));
    });

    await act(async () => {
      await result.current.saveEditingRow();
    });

    expect(createBlogCategoryMock).toHaveBeenCalledWith(
      expect.objectContaining({ name_zh: '分类', name_en: 'Category', slug: 'category' }),
    );
  });

  it('updates an existing category', async () => {
    getBlogCategoriesMock.mockResolvedValueOnce([
      { id: 1, name_zh: 'A', name_en: 'A', slug: 'a', sort_order: 1 },
    ]);
    updateBlogCategoryMock.mockResolvedValueOnce({ message: 'updated' });

    const { result } = renderHook(() => useBlogCategoriesManager(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.startEdit(result.current.categories[0]);
    });

    act(() => {
      result.current.updateEditingForm((form) => ({ ...form, name: { zh: '新', en: 'New' } }));
    });

    await act(async () => {
      await result.current.saveEditingRow();
    });

    expect(updateBlogCategoryMock).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ name_zh: '新', name_en: 'New' }),
    );
  });

  it('reorders categories by swapping sort_order', async () => {
    getBlogCategoriesMock.mockResolvedValueOnce([
      { id: 1, name_zh: 'A', name_en: 'A', slug: 'a', sort_order: 1 },
      { id: 2, name_zh: 'B', name_en: 'B', slug: 'b', sort_order: 2 },
    ]);
    updateBlogCategoryMock.mockResolvedValue({ message: 'updated' });

    const { result } = renderHook(() => useBlogCategoriesManager(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.reorder(result.current.categories[0], 'down');
    });

    await waitFor(() => expect(updateBlogCategoryMock).toHaveBeenCalledTimes(2));

    expect(updateBlogCategoryMock).toHaveBeenCalledWith(1, { sort_order: 2 });
    expect(updateBlogCategoryMock).toHaveBeenCalledWith(2, { sort_order: 1 });
  });
});
