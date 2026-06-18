import { beforeEach, describe, expect, it, vi } from 'vitest';

const { requestMock } = vi.hoisted(() => ({ requestMock: vi.fn() }));

vi.mock('@/shared/api/client', () => ({
  apiClient: { request: requestMock },
}));

import { deleteImage } from './media.api';
import { mediaKeys } from './media.keys';

describe('media api', () => {
  beforeEach(() => requestMock.mockReset());

  it('defines stable list keys', () => {
    expect(mediaKeys.lists()).toEqual(['media', 'list']);
    expect(mediaKeys.list({ search: 'dress' })).toEqual(['media', 'list', { search: 'dress' }]);
  });

  it('encodes the object key when deleting an image', async () => {
    requestMock.mockResolvedValueOnce({ success: true });

    await deleteImage('folder/image name.jpg');

    expect(requestMock).toHaveBeenCalledWith(
      '/api/upload?key=folder%2Fimage%20name.jpg',
      { method: 'DELETE' },
    );
  });
});
