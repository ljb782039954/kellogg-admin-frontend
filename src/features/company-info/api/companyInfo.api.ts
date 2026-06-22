import type { CompanyInfo } from '@/package/types';
import { apiClient } from '@/shared/api/client';
import { isAppError } from '@/shared/api/errors';
import { blankCompanyInfo } from '../model/companyInfo.defaults';
import { toCompanyInfoFormValues, toCompanyInfoPayload } from '../model/companyInfo.mapper';

const configKey = 'site_settings';

export async function getCompanyInfo(): Promise<CompanyInfo> {
  try {
    const value = await apiClient.request<CompanyInfo | null>(`/api/config/${configKey}`);
    return toCompanyInfoPayload(toCompanyInfoFormValues(value));
  } catch (error) {
    if (isAppError(error) && error.status === 404) {
      return blankCompanyInfo;
    }

    throw error;
  }
}

export async function saveCompanyInfo(companyInfo: CompanyInfo): Promise<void> {
  await apiClient.request<{ success: boolean }>('/api/config', {
    method: 'POST',
    body: JSON.stringify({
      key: configKey,
      value: companyInfo,
    }),
  });
}
