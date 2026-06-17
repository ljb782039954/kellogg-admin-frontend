import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getProductsMock, getProductMock, createProductMock, updateProductMock, deleteProductMock, getCategoriesMock } = vi.hoisted(() => ({
  getProductsMock: vi.fn(),
  getProductMock: vi.fn(),
  createProductMock: vi.fn(),
  updateProductMock: vi.fn(),
  deleteProductMock: vi.fn(),
  getCategoriesMock: vi.fn(),
}));

vi.mock('../api/products.api', () => ({
  getProducts: getProductsMock,
  getProduct: getProductMock,
  createProduct: createProductMock,
  updateProduct: updateProductMock,
  deleteProduct: deleteProductMock,
}));

vi.mock('@/features/categories/api/categories.api', () => ({
  getCategories: getCategoriesMock,
}));

import { useProductsManager } from './useProductForm';

function createWrapper() {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}

describe('useProductsManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getCategoriesMock.mockResolvedValue([]);
  });

  it('loads product list on mount', async () => {
    getProductsMock.mockResolvedValueOnce({
      data: [{ id: 1, name: { zh: '产品A', en: 'Product A' }, price: 100 }],
      total: 1,
      page: 1,
      pageSize: 1000,
      totalPages: 1,
    });

    const { result } = renderHook(() => useProductsManager(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.products).toHaveLength(1);
    expect(result.current.products[0].name.zh).toBe('产品A');
  });

  it('opens editor for new product with default values', () => {
    getProductsMock.mockResolvedValueOnce({ data: [], total: 0, page: 1, pageSize: 1000, totalPages: 0 });

    const { result } = renderHook(() => useProductsManager(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.addProduct();
    });

    expect(result.current.isEditing).toBe(true);
    expect(result.current.editingId).toBe(0);
    expect(result.current.form.getValues('name')).toEqual({ zh: '新产品', en: 'New Product' });
  });

  it('loads product detail when opening existing product editor', async () => {
    getProductsMock.mockResolvedValueOnce({ data: [{ id: 1, name: { zh: 'A', en: 'A' }, price: 50 }], total: 1, page: 1, pageSize: 1000, totalPages: 1 });
    getProductMock.mockResolvedValueOnce({
      id: 1,
      name: { zh: '产品详情', en: 'Product Detail' },
      price: 200,
      isActive: true,
      isFeatured: false,
      images: [],
      bulkPrices: [],
      sizes: [],
      colors: [],
      videos: [],
      customFields: [],
      rating: 4,
      sales: 10,
    });

    const { result } = renderHook(() => useProductsManager(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.openEditor(1);
    });

    await waitFor(() => {
      expect(result.current.form.getValues('name')).toEqual({ zh: '产品详情', en: 'Product Detail' });
    });
    expect(result.current.form.getValues('price')).toBe(200);
  });

  it('saves a new product via create', async () => {
    getProductsMock.mockResolvedValueOnce({ data: [], total: 0, page: 1, pageSize: 1000, totalPages: 0 });
    createProductMock.mockResolvedValueOnce({
      id: 1,
      name: { zh: '新产品', en: 'New Product' },
      price: 100,
      isActive: true,
    });

    const { result } = renderHook(() => useProductsManager(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.addProduct();
    });

    act(() => {
      result.current.form.setValue('price', 100);
    });

    await act(async () => {
      await result.current.saveProduct();
    });

    expect(createProductMock).toHaveBeenCalled();
    expect(result.current.saved).toBe(true);
  });

  it('saves an existing product via update', async () => {
    getProductsMock.mockResolvedValueOnce({ data: [{ id: 1, name: { zh: 'A', en: 'A' }, price: 50 }], total: 1, page: 1, pageSize: 1000, totalPages: 1 });
    getProductMock.mockResolvedValueOnce({
      id: 1,
      name: { zh: 'A', en: 'A' },
      price: 50,
      isActive: true,
      isFeatured: false,
      images: [],
      bulkPrices: [],
      sizes: [],
      colors: [],
      videos: [],
      customFields: [],
      rating: 5,
      sales: 0,
    });
    updateProductMock.mockResolvedValueOnce({
      id: 1,
      name: { zh: 'A', en: 'A' },
      price: 150,
      isActive: true,
    });

    const { result } = renderHook(() => useProductsManager(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.openEditor(1);
    });

    await waitFor(() => {
      expect(result.current.form.getValues('price')).toBe(50);
    });

    act(() => {
      result.current.form.setValue('price', 150);
    });

    await act(async () => {
      await result.current.saveProduct();
    });

    expect(updateProductMock).toHaveBeenCalledWith(1, expect.any(Object));
  });

  it('supports selection toggling', async () => {
    getProductsMock.mockResolvedValueOnce({
      data: [
        { id: 1, name: { zh: 'A', en: 'A' }, price: 10 },
        { id: 2, name: { zh: 'B', en: 'B' }, price: 20 },
      ],
      total: 2,
      page: 1,
      pageSize: 1000,
      totalPages: 1,
    });

    const { result } = renderHook(() => useProductsManager(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.toggleSelect(1);
    });

    expect(result.current.selectedIds.has(1)).toBe(true);
    expect(result.current.selectionCount).toBe(1);

    act(() => {
      result.current.toggleSelectAll();
    });

    expect(result.current.selectionCount).toBe(2);
  });
});
