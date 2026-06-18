import { apiClient } from '@/shared/api/client';

export function deleteImage(key: string): Promise<{ success: boolean }> {
  return apiClient.request<{ success: boolean }>(
    `/api/upload?key=${encodeURIComponent(key)}`,
    { method: 'DELETE' },
  );
}

export { getImagesList, uploadImage } from '@/shared/media/api/media.api';
