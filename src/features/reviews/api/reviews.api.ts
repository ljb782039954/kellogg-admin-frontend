import { apiClient } from '@/shared/api/client';
import type { CustomerReview, ReviewInput } from '@/package/types';
import type { ReviewListFilters } from '../model/review.types';

interface PaginatedReviews {
  data: CustomerReview[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export function getReviews(filters?: ReviewListFilters): Promise<PaginatedReviews> {
  const searchParams = new URLSearchParams();
  if (filters) {
    searchParams.set('page', String(filters.page));
    searchParams.set('pageSize', String(filters.pageSize));
    if (filters.search) searchParams.set('search', filters.search);
    if (filters.status) searchParams.set('status', filters.status);
  }
  const qs = searchParams.toString();
  return apiClient.request<PaginatedReviews>(`/api/admin/reviews${qs ? `?${qs}` : ''}`);
}

export function createReview(data: ReviewInput): Promise<{ id: number; message: string }> {
  return apiClient.request<{ id: number; message: string }>('/api/admin/reviews', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateReview(
  id: number,
  data: Partial<ReviewInput>,
): Promise<{ message: string }> {
  return apiClient.request<{ message: string }>(`/api/admin/reviews/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteReview(id: number): Promise<{ message: string }> {
  return apiClient.request<{ message: string }>(`/api/admin/reviews/${id}`, {
    method: 'DELETE',
  });
}
