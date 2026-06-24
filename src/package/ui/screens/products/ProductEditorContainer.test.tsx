import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LanguageProvider } from '@/core/app/LanguageContext';

const { getProductsMock, createProductMock, getCategoriesMock } = vi.hoisted(() => ({
  getProductsMock: vi.fn(),
  createProductMock: vi.fn(),
  getCategoriesMock: vi.fn(),
}));

vi.mock('@/features/products/api/products.api', () => ({
  getProducts: getProductsMock,
  getProduct: vi.fn(),
  createProduct: createProductMock,
  updateProduct: vi.fn(),
  deleteProduct: vi.fn(),
}));

vi.mock('@/features/categories/api/categories.api', () => ({
  getCategories: getCategoriesMock,
}));

vi.mock('@/package/ui/media/ImageInput', () => ({
  default: ({ value, onChange, label }: { value: string; onChange: (value: string) => void; label: string }) => (
    <button type="button" onClick={() => onChange('/img.png')}>
      {label}: {value}
    </button>
  ),
}));

import { ProductEditorContainer } from './ProductEditorContainer';

function renderContainer() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return render(
    <QueryClientProvider client={client}>
      <LanguageProvider>
        <ProductEditorContainer />
      </LanguageProvider>
    </QueryClientProvider>,
  );
}

describe('ProductEditorContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getCategoriesMock.mockResolvedValue([]);
  });

  it('shows loading state then renders product list', async () => {
    getProductsMock.mockResolvedValueOnce({
      data: [
        { id: 1, name: { zh: '产品一', en: 'Product 1' }, price: 100, image: '', images: [], isFeatured: false, isActive: true, rating: 5, sales: 0 },
      ],
      total: 1,
      page: 1,
      pageSize: 1000,
      totalPages: 1,
    });

    renderContainer();

    await waitFor(() => {
      expect(screen.getByText('产品一')).toBeInTheDocument();
    });
    expect(screen.getByText(/总计: 1 件/)).toBeInTheDocument();
  });

  it('adds a new product and opens slide-over editor', async () => {
    getProductsMock.mockResolvedValueOnce({ data: [], total: 0, page: 1, pageSize: 1000, totalPages: 0 });

    renderContainer();

    await waitFor(() => expect(screen.getByText('添加产品')).toBeInTheDocument());

    await userEvent.click(screen.getByText('添加产品'));

    expect(screen.getByText('添加新产品')).toBeInTheDocument();
  });
});
