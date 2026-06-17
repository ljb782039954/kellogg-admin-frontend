import { apiClient } from '@/shared/api/client';
import type { CustomerReview, ReviewInput } from '@/types';

interface ReviewsQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}

interface PaginatedReviews {
  data: CustomerReview[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export function getReviews(params?: ReviewsQuery): Promise<PaginatedReviews> {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined) searchParams.set(k, String(v));
    });
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
