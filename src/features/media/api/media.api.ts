import { apiClient } from '@/shared/api/client';
import type { R2Image } from '@/types';

export function getImagesList(): Promise<R2Image[]> {
  return apiClient.request<R2Image[]>('/api/upload/list');
}

export function uploadImage(
  file: File,
  dimensions?: { width: number; height: number },
): Promise<{ url: string; thumbUrl: string; key: string }> {
  const formData = new FormData();
  formData.append('file', file);
  if (dimensions) {
    formData.append('width', dimensions.width.toString());
    formData.append('height', dimensions.height.toString());
  }
  return apiClient.request('/api/upload', {
    method: 'POST',
    body: formData,
  });
}

export function deleteImage(key: string): Promise<{ success: boolean }> {
  return apiClient.request<{ success: boolean }>(
    `/api/upload?key=${encodeURIComponent(key)}`,
    { method: 'DELETE' },
  );
}
