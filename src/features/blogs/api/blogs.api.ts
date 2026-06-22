import { apiClient } from '@/shared/api/client';
import type { Blog, BlogInput, BlogsQuery, PaginatedBlogs } from '@/package/types';

export type { BlogsQuery, PaginatedBlogs } from '@/package/types';

export function getBlogs(params?: BlogsQuery): Promise<PaginatedBlogs> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.pageSize) searchParams.set('pageSize', String(params.pageSize));
  if (params?.status) searchParams.set('status', params.status);
  if (params?.category) searchParams.set('category', params.category);
  if (params?.search) searchParams.set('search', params.search);
  if (params?.sort) searchParams.set('sort', params.sort);

  const query = searchParams.toString();
  return apiClient.request<PaginatedBlogs>(`/api/blogs${query ? `?${query}` : ''}`);
}

export function getBlog(id: number): Promise<Blog> {
  return apiClient.request<Blog>(`/api/blogs/${id}`);
}

export function createBlog(data: BlogInput): Promise<{ id: number; message: string }> {
  return apiClient.request<{ id: number; message: string }>('/api/blogs', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateBlog(id: number, data: Partial<BlogInput>): Promise<{ message: string }> {
  return apiClient.request<{ message: string }>(`/api/blogs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteBlog(id: number): Promise<{ message: string }> {
  return apiClient.request<{ message: string }>(`/api/blogs/${id}`, {
    method: 'DELETE',
  });
}
