import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/shared/api/errors';

const { requestMock } = vi.hoisted(() => ({
  requestMock: vi.fn(),
}));

vi.mock('@/shared/api/client', () => ({
  apiClient: { request: requestMock },
}));

import { getFooter, updateFooter } from './footer.api';

describe('footer api', () => {
  beforeEach(() => {
    requestMock.mockReset();
  });

  it('loads footer config', async () => {
    const footer = {
      linkGroups: [],
      newsletterPlaceholder: { zh: '请输入邮箱', en: 'Email' },
      newsletterButton: { zh: '订阅', en: 'Subscribe' },
    };
    requestMock.mockResolvedValueOnce(footer);

    await expect(getFooter()).resolves.toEqual(footer);
    expect(requestMock).toHaveBeenCalledWith('/api/config/footer_config');
  });

  it('returns default footer on 404', async () => {
    requestMock.mockRejectedValueOnce(new ApiError('Not found', 404));

    const result = await getFooter();
    expect(result.linkGroups).toEqual([]);
    expect(result.newsletterButton.zh).toBe('订阅');
  });

  it('saves footer config', async () => {
    requestMock.mockResolvedValueOnce({ success: true });

    const footer = {
      linkGroups: [],
      newsletterPlaceholder: { zh: '请输入邮箱', en: 'Email' },
      newsletterButton: { zh: '订阅', en: 'Subscribe' },
    };
    await updateFooter(footer);
    expect(requestMock).toHaveBeenCalledWith('/api/config', {
      method: 'POST',
      body: JSON.stringify({ key: 'footer_config', value: footer }),
    });
  });
});
