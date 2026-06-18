import { apiClient } from '@/shared/api/client';
import type { BlogCategory } from '@/types';

export interface BlogCategoryInput {
  name_zh: string;
  name_en: string;
  slug?: string;
  sort_order?: number;
}

export function getBlogCategories(): Promise<BlogCategory[]> {
  return apiClient.request<BlogCategory[]>('/api/blog-categories');
}

export function createBlogCategory(data: BlogCategoryInput): Promise<{ id: number; message: string }> {
  return apiClient.request<{ id: number; message: string }>('/api/blog-categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateBlogCategory(
  id: number,
  data: Partial<BlogCategoryInput>,
): Promise<{ message: string }> {
  return apiClient.request<{ message: string }>(`/api/blog-categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteBlogCategory(id: number): Promise<{ message: string }> {
  return apiClient.request<{ message: string }>(`/api/blog-categories/${id}`, {
    method: 'DELETE',
  });
}
