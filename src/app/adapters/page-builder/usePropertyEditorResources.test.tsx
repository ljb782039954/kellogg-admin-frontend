import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { usePropertyEditorResources } from './usePropertyEditorResources';

// 声明 mock
const { useCategoriesQueryMock, useProductPreviewDataMock, usePageOptionsMock } = vi.hoisted(() => ({
  useCategoriesQueryMock: vi.fn(),
  useProductPreviewDataMock: vi.fn(),
  usePageOptionsMock: vi.fn(),
}));

vi.mock('@/features/categories', () => ({
  useCategoriesQuery: useCategoriesQueryMock,
}));

vi.mock('@/features/products', () => ({
  useProductPreviewData: useProductPreviewDataMock,
}));

vi.mock('@/features/pages', () => ({
  usePageOptions: usePageOptionsMock,
}));

describe('usePropertyEditorResources', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('aggregates data, loading states, and error messages from all queries', () => {
    useCategoriesQueryMock.mockReturnValue({
      categories: [{ id: 'cat1', name: { zh: '分类', en: 'Category' } }],
      isLoading: false,
      error: null,
    });
    useProductPreviewDataMock.mockReturnValue({
      products: [],
      isLoading: false,
      error: null,
    });
    usePageOptionsMock.mockReturnValue({
      pages: [],
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => usePropertyEditorResources());

    expect(result.current.categories).toEqual([{ id: 'cat1', name: { zh: '分类', en: 'Category' } }]);
    expect(result.current.products).toEqual([]);
    expect(result.current.pages).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('sets isLoading to true if any queries are loading', () => {
    useCategoriesQueryMock.mockReturnValue({
      categories: [],
      isLoading: true,
      error: null,
    });
    useProductPreviewDataMock.mockReturnValue({
      products: [],
      isLoading: false,
      error: null,
    });
    usePageOptionsMock.mockReturnValue({
      pages: [],
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => usePropertyEditorResources());
    expect(result.current.isLoading).toBe(true);
  });

  it('returns the first non-null error message', () => {
    useCategoriesQueryMock.mockReturnValue({
      categories: [],
      isLoading: false,
      error: null,
    });
    useProductPreviewDataMock.mockReturnValue({
      products: [],
      isLoading: false,
      error: new Error('products error'),
    });
    usePageOptionsMock.mockReturnValue({
      pages: [],
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => usePropertyEditorResources());
    expect(result.current.error).toBe('products error');
  });
});
