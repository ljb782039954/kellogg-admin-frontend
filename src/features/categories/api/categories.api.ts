import { apiClient } from '@/shared/api/client';
import type { Category, CategoryInput } from '@/package/types';

export function getCategories(): Promise<Category[]> {
  return apiClient.request<Category[]>('/api/categories');
}

export function createCategory(data: CategoryInput): Promise<Category> {
  return apiClient.request<Category>('/api/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateCategory(id: string, data: Partial<CategoryInput>): Promise<Category> {
  return apiClient.request<Category>(`/api/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteCategory(id: string): Promise<{ success: boolean }> {
  return apiClient.request<{ success: boolean }>(`/api/categories/${id}`, {
    method: 'DELETE',
  });
}
