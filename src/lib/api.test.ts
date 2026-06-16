import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/shared/api/errors';

const { requestMock } = vi.hoisted(() => ({
  requestMock: vi.fn(),
}));

vi.mock('@/shared/api/client', () => ({
  apiClient: {
    request: requestMock,
  },
}));

import { api } from './api';

describe('legacy api facade', () => {
  beforeEach(() => {
    requestMock.mockReset();
  });

  it('keeps product request paths unchanged', async () => {
    requestMock.mockResolvedValueOnce({ id: 7 });

    await api.getProduct(7);

    expect(requestMock).toHaveBeenCalledWith('/api/products/7');
  });

  it('keeps missing config behavior unchanged', async () => {
    requestMock.mockRejectedValueOnce(new ApiError('Missing', 404));

    await expect(api.getConfig('missing')).resolves.toBeNull();
  });

  it('delegates multipart uploads to the shared client', async () => {
    requestMock.mockResolvedValueOnce({
      url: '/image.jpg',
      thumbUrl: '/image-thumb.jpg',
      key: 'image.jpg',
    });
    const file = new File(['image'], 'image.jpg', { type: 'image/jpeg' });

    await api.uploadImage(file, { width: 100, height: 80 }, 'hash-value');

    const [path, options] = requestMock.mock.calls[0] as [string, RequestInit];
    expect(path).toBe('/api/upload');
    expect(options.method).toBe('POST');
    expect(options.body).toBeInstanceOf(FormData);
    expect((options.body as FormData).get('hash')).toBe('hash-value');
  });
});
