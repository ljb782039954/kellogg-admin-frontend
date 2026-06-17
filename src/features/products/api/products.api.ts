import { apiClient } from '@/shared/api/client';
import type { Product, ProductInput } from '@/types';

interface ProductsQuery {
  page?: number;
  pageSize?: number;
  category?: string;
  featured?: boolean;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'sales';
  search?: string;
}

interface PaginatedProducts {
  data: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function getProducts(params?: ProductsQuery): Promise<PaginatedProducts> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.pageSize) searchParams.set('pageSize', String(params.pageSize));
  if (params?.category) searchParams.set('category', params.category);
  if (params?.featured !== undefined) searchParams.set('featured', String(params.featured));
  if (params?.sort) searchParams.set('sort', params.sort);
  if (params?.search) searchParams.set('search', params.search);

  const query = searchParams.toString();
  return apiClient.request<PaginatedProducts>(`/api/products${query ? `?${query}` : ''}`);
}

export function getProduct(id: number): Promise<Product> {
  return apiClient.request<Product>(`/api/products/${id}`);
}

export function createProduct(data: ProductInput): Promise<Product> {
  return apiClient.request<Product>('/api/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateProduct(
  id: number,
  data: Partial<ProductInput>,
): Promise<Product> {
  return apiClient.request<Product>(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteProduct(id: number): Promise<{ success: boolean }> {
  return apiClient.request<{ success: boolean }>(`/api/products/${id}`, {
    method: 'DELETE',
  });
}
