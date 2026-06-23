import { apiClient } from '@/shared/api/client';
import type { CustomPage } from '@/types';

export function getPagesIndex(): Promise<CustomPage[]> {
  return apiClient.request<CustomPage[]>('/api/config/pages_index').catch((err) => {
    if (err.status === 404) return [];
    throw err;
  });
}

export type { PageIndexEntry } from '@/package/types';

export function savePagesIndex(pages: Record<string, unknown>[]): Promise<{ success: boolean }> {
  return apiClient.request<{ success: boolean }>('/api/config', {
    method: 'POST',
    body: JSON.stringify({ key: 'pages_index', value: pages }),
  });
}

export function getPageById(id: string): Promise<CustomPage> {
  return apiClient.request<CustomPage>(`/api/config/pages/${id}`);
}

export function savePageDetail(id: string, page: CustomPage): Promise<{ success: boolean }> {
  return apiClient.request<{ success: boolean }>('/api/config', {
    method: 'POST',
    body: JSON.stringify({ key: `page:${id}`, value: page }),
  });
}

export function deletePageDetail(id: string): Promise<{ success: boolean }> {
  return apiClient.request<{ success: boolean }>(`/api/config/${encodeURIComponent(`page:${id}`)}`, {
    method: 'DELETE',
  });
}
