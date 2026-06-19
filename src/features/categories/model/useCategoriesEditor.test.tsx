import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useCategoriesEditor } from './useCategoriesEditor';

const { getCategoriesMock, createCategoryMock, updateCategoryMock, deleteCategoryMock } = vi.hoisted(
  () => ({
    getCategoriesMock: vi.fn(),
    createCategoryMock: vi.fn(),
    updateCategoryMock: vi.fn(),
    deleteCategoryMock: vi.fn(),
  }),
);

vi.mock('../api/categories.api', () => ({
  getCategories: getCategoriesMock,
  createCategory: createCategoryMock,
  updateCategory: updateCategoryMock,
  deleteCategory: deleteCategoryMock,
}));

function createWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}

describe('useCategoriesEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads server categories', async () => {
    getCategoriesMock.mockResolvedValueOnce([
      { id: 'cat_1', name: { zh: 'A', en: 'A' }, image: '' },
    ]);

    const { result } = renderHook(() => useCategoriesEditor(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.categories).toHaveLength(1));
    expect(result.current.categories[0].name.zh).toBe('A');
  });

  it('creates a category immediately via addCategory', async () => {
    getCategoriesMock.mockResolvedValueOnce([]);
    createCategoryMock.mockResolvedValueOnce({ id: 'cat_new', message: 'created' });

    const { result } = renderHook(() => useCategoriesEditor(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.addCategory();
    });

    expect(createCategoryMock).toHaveBeenCalledTimes(1);
  });

  it('updates category name immediately', async () => {
    getCategoriesMock.mockResolvedValueOnce([
      { id: 'cat_1', name: { zh: 'A', en: 'A' }, image: '' },
    ]);
    updateCategoryMock.mockResolvedValueOnce({ id: 'cat_1' });

    const { result } = renderHook(() => useCategoriesEditor(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.categories).toHaveLength(1));

    await act(async () => {
      await result.current.updateCategoryName('cat_1', { zh: 'A2', en: 'A2' });
    });

    expect(updateCategoryMock).toHaveBeenCalledWith(
      'cat_1',
      expect.objectContaining({ name_zh: 'A2', name_en: 'A2' }),
    );
  });

  it('deletes a category immediately', async () => {
    getCategoriesMock.mockResolvedValueOnce([
      { id: 'cat_1', name: { zh: 'A', en: 'A' }, image: '' },
    ]);
    deleteCategoryMock.mockResolvedValueOnce({ success: true });

    const { result } = renderHook(() => useCategoriesEditor(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.categories).toHaveLength(1));

    await act(async () => {
      await result.current.removeCategory('cat_1');
    });

    expect(deleteCategoryMock).toHaveBeenCalledWith('cat_1');
  });
});
