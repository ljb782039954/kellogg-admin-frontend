import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/shared/api/errors';
import { blankCompanyInfo } from '../model/companyInfo.defaults';

const { requestMock } = vi.hoisted(() => ({
  requestMock: vi.fn(),
}));

vi.mock('@/shared/api/client', () => ({
  apiClient: {
    request: requestMock,
  },
}));

import { getCompanyInfo, saveCompanyInfo } from './companyInfo.api';
import { companyInfoKeys } from './companyInfo.keys';

describe('company info api', () => {
  beforeEach(() => {
    requestMock.mockReset();
  });

  it('defines a stable detail query key', () => {
    expect(companyInfoKeys.detail()).toEqual(['company-info', 'detail']);
  });

  it('loads site settings from the existing config key', async () => {
    requestMock.mockResolvedValueOnce({ ...blankCompanyInfo, logo: '/logo.png' });

    await expect(getCompanyInfo()).resolves.toMatchObject({ logo: '/logo.png' });

    expect(requestMock).toHaveBeenCalledWith('/api/config/site_settings');
  });

  it('falls back to blank company info when the config is missing', async () => {
    requestMock.mockRejectedValueOnce(new ApiError('Missing', 404));

    await expect(getCompanyInfo()).resolves.toEqual(blankCompanyInfo);
  });

  it('saves site settings through the existing config endpoint', async () => {
    requestMock.mockResolvedValueOnce({ success: true });

    await saveCompanyInfo(blankCompanyInfo);

    expect(requestMock).toHaveBeenCalledWith('/api/config', {
      method: 'POST',
      body: JSON.stringify({ key: 'site_settings', value: blankCompanyInfo }),
    });
  });
});
