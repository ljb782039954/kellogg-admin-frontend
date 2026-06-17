import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createAppQueryClient } from '@/app/queryClient';
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
  const client = createAppQueryClient();
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}

describe('useCategoriesEditor', () => {
  beforeEach(() => {
    getCategoriesMock.mockReset();
    createCategoryMock.mockReset();
    updateCategoryMock.mockReset();
    deleteCategoryMock.mockReset();
  });

  it('initializes with server categories', async () => {
    getCategoriesMock.mockResolvedValueOnce([
      { id: 'cat_1', name: { zh: 'A', en: 'A' }, image: '' },
    ]);

    const { result } = renderHook(() => useCategoriesEditor(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.categories).toHaveLength(1));
    expect(result.current.categories[0].name.zh).toBe('A');
  });

  it('creates, updates and deletes categories on save', async () => {
    getCategoriesMock.mockResolvedValueOnce([
      { id: 'cat_1', name: { zh: 'A', en: 'A' }, image: '' },
    ]);
    updateCategoryMock.mockResolvedValueOnce({ id: 'cat_1' });
    deleteCategoryMock.mockResolvedValueOnce({ success: true });

    const { result } = renderHook(() => useCategoriesEditor(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.categories).toHaveLength(1));

    act(() => result.current.updateCategory(0, { name: { zh: 'A2', en: 'A2' } }));
    expect(result.current.categories[0].name.zh).toBe('A2');

    act(() => result.current.removeCategory(0));
    expect(result.current.categories).toHaveLength(0);

    await act(async () => {
      await result.current.save();
    });

    expect(createCategoryMock).not.toHaveBeenCalled();
    expect(updateCategoryMock).not.toHaveBeenCalled();
    expect(deleteCategoryMock).toHaveBeenCalledWith('cat_1', expect.any(Object));
    expect(result.current.saved).toBe(true);
  });

  it('creates a new category when the local list has an unknown id', async () => {
    getCategoriesMock.mockResolvedValueOnce([]);
    createCategoryMock.mockResolvedValueOnce({ id: 'cat_new' });

    const { result } = renderHook(() => useCategoriesEditor(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.categories).toHaveLength(0));

    act(() => result.current.addCategory());
    expect(result.current.categories).toHaveLength(1);

    await act(async () => {
      await result.current.save();
    });

    expect(createCategoryMock).toHaveBeenCalledTimes(1);
  });
});
