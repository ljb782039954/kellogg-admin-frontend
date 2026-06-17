import { apiClient } from '@/shared/api/client';
import { isAppError } from '@/shared/api/errors';
import type { FooterContent } from '@/types';

const configKey = 'footer_config';

export async function getFooter(): Promise<FooterContent> {
  try {
    return await apiClient.request<FooterContent>(`/api/config/${configKey}`);
  } catch (error) {
    if (isAppError(error) && error.status === 404) {
      return {
        linkGroups: [],
        newsletterPlaceholder: { zh: '输入邮箱订阅', en: 'Enter email to subscribe' },
        newsletterButton: { zh: '订阅', en: 'Subscribe' },
      };
    }
    throw error;
  }
}

export async function updateFooter(footer: FooterContent): Promise<void> {
  await apiClient.request<{ success: boolean }>('/api/config', {
    method: 'POST',
    body: JSON.stringify({ key: configKey, value: footer }),
  });
}
