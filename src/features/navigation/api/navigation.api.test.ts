import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/shared/api/errors';

const { requestMock } = vi.hoisted(() => ({
  requestMock: vi.fn(),
}));

vi.mock('@/shared/api/client', () => ({
  apiClient: { request: requestMock },
}));

import { getHeader, updateHeader } from './navigation.api';

describe('navigation api', () => {
  beforeEach(() => {
    requestMock.mockReset();
  });

  it('loads header config', async () => {
    const header = { logoText: { zh: 'Logo', en: 'Logo' }, navItems: [] };
    requestMock.mockResolvedValueOnce(header);

    await expect(getHeader()).resolves.toEqual(header);
    expect(requestMock).toHaveBeenCalledWith('/api/config/header_config');
  });

  it('returns empty header on 404', async () => {
    requestMock.mockRejectedValueOnce(new ApiError('Not found', 404));

    await expect(getHeader()).resolves.toEqual({ logoText: { zh: '', en: '' }, navItems: [] });
  });

  it('saves header config', async () => {
    requestMock.mockResolvedValueOnce({ success: true });

    await updateHeader({ logoText: { zh: 'Logo', en: 'Logo' }, navItems: [] });
    expect(requestMock).toHaveBeenCalledWith('/api/config', {
      method: 'POST',
      body: JSON.stringify({ key: 'header_config', value: { logoText: { zh: 'Logo', en: 'Logo' }, navItems: [] } }),
    });
  });
});
