import { apiClient } from '@/shared/api/client';
import { isAppError } from '@/shared/api/errors';
import type { CustomPage } from '@/package/types';

export function getPagesIndex(): Promise<CustomPage[]> {
  return apiClient.request<CustomPage[]>('/api/config/pages_index').catch((err) => {
    if (isAppError(err) && err.status === 404) {
      return [];
    }
    throw err;
  });
}
