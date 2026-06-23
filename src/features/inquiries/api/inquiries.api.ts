import { apiClient } from '@/shared/api/client';
import type {
  InquiryListFilters,
  PaginatedInquiriesDto,
} from '@/package/types';

function buildQuery(filters: InquiryListFilters): string {
  const params = new URLSearchParams();
  params.set('page', String(filters.page));
  params.set('pageSize', String(filters.pageSize));
  if (filters.search) params.set('search', filters.search);
  if (filters.status) params.set('status', filters.status);
  return params.toString();
}

export function getInquiries(
  filters: InquiryListFilters,
): Promise<PaginatedInquiriesDto> {
  return apiClient.request<PaginatedInquiriesDto>(
    `/api/inquiries?${buildQuery(filters)}`,
  );
}

export function updateInquiryStatus(
  id: number,
  status: string,
): Promise<{ message: string }> {
  return apiClient.request<{ message: string }>(`/api/inquiries/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export function deleteInquiry(
  id: number,
): Promise<{ message: string }> {
  return apiClient.request<{ message: string }>(`/api/inquiries/${id}`, {
    method: 'DELETE',
  });
}
