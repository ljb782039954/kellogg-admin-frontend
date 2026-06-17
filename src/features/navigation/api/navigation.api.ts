import { apiClient } from '@/shared/api/client';
import { isAppError } from '@/shared/api/errors';
import type { HeaderContent } from '@/types';

const configKey = 'header_config';

export async function getHeader(): Promise<HeaderContent> {
  try {
    return await apiClient.request<HeaderContent>(`/api/config/${configKey}`);
  } catch (error) {
    if (isAppError(error) && error.status === 404) {
      return { logoText: { zh: '', en: '' }, navItems: [] };
    }
    throw error;
  }
}

export async function updateHeader(header: HeaderContent): Promise<void> {
  await apiClient.request<{ success: boolean }>('/api/config', {
    method: 'POST',
    body: JSON.stringify({ key: configKey, value: header }),
  });
}
