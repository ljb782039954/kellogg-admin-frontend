import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { R2Image } from '@/shared/media/types';

const { getImagesListMock, uploadImageMock, deleteImageMock } = vi.hoisted(() => ({
  getImagesListMock: vi.fn(),
  uploadImageMock: vi.fn(),
  deleteImageMock: vi.fn(),
}));

vi.mock('../api/media.api', () => ({
  getImagesList: getImagesListMock,
  uploadImage: uploadImageMock,
  deleteImage: deleteImageMock,
}));

import { useMediaManager } from './useMediaManager';

function image(key: string, overrides: Partial<R2Image> = {}): R2Image {
  return {
    key,
    name: `${key}.jpg`,
    url: `/${key}.jpg`,
    thumbUrl: `/${key}-thumb.jpg`,
    size: 100,
    uploaded: '2026-06-18T00:00:00.000Z',
    ...overrides,
  };
}

function createWrapper() {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
  return {
    client,
    Wrapper({ children }: { children: ReactNode }) {
      return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
    },
  };
}

describe('useMediaManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads images and derives selection, usage, unused count, and similar assets', async () => {
    const images = [
      image('used', {
        hash: '1'.repeat(64),
        usages: [{ type: 'product', name: 'Dress', id: '1' }],
      }),
      image('duplicate', { hash: '1'.repeat(64) }),
      image('unused', { size: 300 }),
    ];
    getImagesListMock.mockResolvedValueOnce(images);
    const { Wrapper } = createWrapper();

    const { result } = renderHook(() => useMediaManager(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.images).toEqual(images);
    expect(result.current.unusedCount).toBe(2);

    act(() => result.current.setSelectedKey('used'));

    expect(result.current.selectedImage?.key).toBe('used');
    expect(result.current.currentUsages).toHaveLength(1);
    expect(result.current.similarImages[0].image.key).toBe('duplicate');
  });

  it('uploads a selected file and invalidates the media list', async () => {
    getImagesListMock.mockResolvedValueOnce([]);
    uploadImageMock.mockResolvedValueOnce({ url: '/new.jpg', thumbUrl: '/new-thumb.jpg', key: 'new' });
    const { Wrapper, client } = createWrapper();
    const invalidateSpy = vi.spyOn(client, 'invalidateQueries');
    const { result } = renderHook(() => useMediaManager(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => result.current.selectFile(new File(['image'], 'new.jpg', { type: 'image/jpeg' })));

    await waitFor(() => expect(uploadImageMock).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['media', 'list'] }));
  });

  it('returns structured delete risk and deletes after confirmation', async () => {
    getImagesListMock.mockResolvedValueOnce([
      image('used', { usages: [{ type: 'page', name: 'Home' }] }),
    ]);
    deleteImageMock.mockResolvedValueOnce({ success: true });
    const { Wrapper, client } = createWrapper();
    const invalidateSpy = vi.spyOn(client, 'invalidateQueries');
    const { result } = renderHook(() => useMediaManager(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.checkDeleteRisk('missing')).toBeNull();
    expect(result.current.checkDeleteRisk('used')).toEqual({
      key: 'used',
      imageName: 'used.jpg',
      usageCount: 1,
      hasUsages: true,
    });

    await act(async () => result.current.confirmDelete('used'));

    expect(deleteImageMock).toHaveBeenCalledWith('used');
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['media', 'list'] });
  });

  it('exposes query, upload, and delete errors', async () => {
    getImagesListMock.mockRejectedValueOnce(new Error('list failed'));
    const first = createWrapper();
    const queryHook = renderHook(() => useMediaManager(), { wrapper: first.Wrapper });
    await waitFor(() => expect(queryHook.result.current.queryError).toBe('list failed'));
    queryHook.unmount();

    getImagesListMock.mockResolvedValueOnce([]);
    uploadImageMock.mockRejectedValueOnce(new Error('upload failed'));
    deleteImageMock.mockRejectedValueOnce(new Error('delete failed'));
    const second = createWrapper();
    const { result } = renderHook(() => useMediaManager(), { wrapper: second.Wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => result.current.selectFile(new File(['x'], 'x.jpg', { type: 'image/jpeg' })));
    await waitFor(() => expect(result.current.uploadState.uploadError).toBe('upload failed'));

    await act(async () => {
      await expect(result.current.confirmDelete('x')).rejects.toThrow('delete failed');
    });
    await waitFor(() => expect(result.current.deleteState.deleteError).toBe('delete failed'));
  });
});
