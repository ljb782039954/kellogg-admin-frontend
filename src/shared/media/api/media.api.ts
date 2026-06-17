import { apiClient } from '@/shared/api/client';
import type { R2Image } from '@/types';

export interface UploadedImage {
  url: string;
  thumbUrl: string;
  key: string;
}

export function getImagesList(): Promise<R2Image[]> {
  return apiClient.request<R2Image[]>('/api/upload/list');
}

export function uploadImage(
  file: File,
  dimensions?: { width: number; height: number },
  hash?: string,
): Promise<UploadedImage> {
  const formData = new FormData();
  formData.append('file', file);

  if (dimensions) {
    formData.append('width', dimensions.width.toString());
    formData.append('height', dimensions.height.toString());
  }
  if (hash) {
    formData.append('hash', hash);
  }

  return apiClient.request<UploadedImage>('/api/upload', {
    method: 'POST',
    body: formData,
  });
}
