import { beforeEach, describe, expect, it, vi } from 'vitest';

const { requestMock } = vi.hoisted(() => ({
  requestMock: vi.fn(),
}));

vi.mock('@/shared/api/client', () => ({
  apiClient: {
    request: requestMock,
  },
}));

import { getImagesList, uploadImage } from './media.api';

describe('shared media api', () => {
  beforeEach(() => {
    requestMock.mockReset();
  });

  it('loads the existing upload list endpoint', async () => {
    requestMock.mockResolvedValueOnce([]);

    await expect(getImagesList()).resolves.toEqual([]);

    expect(requestMock).toHaveBeenCalledWith('/api/upload/list');
  });

  it('uploads files with dimensions and hash through FormData', async () => {
    requestMock.mockResolvedValueOnce({
      url: '/image.jpg',
      thumbUrl: '/image-thumb.jpg',
      key: 'image.jpg',
    });
    const file = new File(['image'], 'image.jpg', { type: 'image/jpeg' });

    await uploadImage(file, { width: 100, height: 80 }, 'hash-value');

    const [path, options] = requestMock.mock.calls[0] as [string, RequestInit];
    const body = options.body as FormData;

    expect(path).toBe('/api/upload');
    expect(options.method).toBe('POST');
    expect(body).toBeInstanceOf(FormData);
    expect(body.get('file')).toBe(file);
    expect(body.get('width')).toBe('100');
    expect(body.get('height')).toBe('80');
    expect(body.get('hash')).toBe('hash-value');
  });
});
