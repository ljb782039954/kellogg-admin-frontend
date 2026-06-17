import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { R2Image } from '@/types';

const { prepareImageUploadMock, getImagesListMock, uploadImageMock } = vi.hoisted(() => ({
  prepareImageUploadMock: vi.fn(),
  getImagesListMock: vi.fn(),
  uploadImageMock: vi.fn(),
}));

vi.mock('../domain/prepareImageUpload', () => ({
  prepareImageUpload: prepareImageUploadMock,
}));

vi.mock('../api/media.api', () => ({
  getImagesList: getImagesListMock,
  uploadImage: uploadImageMock,
}));

import { useImageUploadController } from './useImageUploadController';

function r2Image(hash: string): R2Image {
  return {
    key: 'existing.jpg',
    name: 'existing.jpg',
    url: '/existing.jpg',
    thumbUrl: '/existing-thumb.jpg',
    size: 100,
    hash,
    uploaded: '2026-06-16T00:00:00.000Z',
  };
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((promiseResolve, promiseReject) => {
    resolve = promiseResolve;
    reject = promiseReject;
  });

  return { promise, resolve, reject };
}

describe('useImageUploadController', () => {
  beforeEach(() => {
    prepareImageUploadMock.mockReset();
    getImagesListMock.mockReset();
    uploadImageMock.mockReset();
  });

  it('uploads immediately when no duplicate image is found', async () => {
    const onChange = vi.fn();
    const file = new File(['image'], 'image.jpg', { type: 'image/jpeg' });
    prepareImageUploadMock.mockResolvedValueOnce({
      file,
      dimensions: { width: 100, height: 80 },
      hash: '1'.repeat(64),
    });
    getImagesListMock.mockResolvedValueOnce([]);
    uploadImageMock.mockResolvedValueOnce({ url: '/new.jpg' });

    const { result } = renderHook(() => useImageUploadController({ value: '', onChange }));

    await act(async () => {
      await result.current.selectFile(file);
    });

    expect(uploadImageMock).toHaveBeenCalledWith(file, { width: 100, height: 80 }, '1'.repeat(64));
    expect(onChange).toHaveBeenCalledWith('/new.jpg');
    expect(result.current.duplicates).toEqual([]);
    expect(result.current.hasPendingUpload).toBe(false);
  });

  it('pauses when duplicates are found, then reuses an existing image', async () => {
    const onChange = vi.fn();
    const file = new File(['image'], 'image.jpg', { type: 'image/jpeg' });
    const hash = '1'.repeat(64);
    prepareImageUploadMock.mockResolvedValueOnce({ file, hash });
    getImagesListMock.mockResolvedValueOnce([r2Image(hash)]);

    const { result } = renderHook(() => useImageUploadController({ value: '', onChange }));

    await act(async () => {
      await result.current.selectFile(file);
    });

    expect(result.current.duplicates).toHaveLength(1);
    expect(result.current.hasPendingUpload).toBe(true);
    expect(uploadImageMock).not.toHaveBeenCalled();

    act(() => {
      result.current.reuseImage('/existing.jpg');
    });

    expect(onChange).toHaveBeenCalledWith('/existing.jpg');
    expect(result.current.duplicates).toEqual([]);
    expect(result.current.hasPendingUpload).toBe(false);
  });

  it('can force upload a pending duplicate candidate', async () => {
    const onChange = vi.fn();
    const file = new File(['image'], 'image.jpg', { type: 'image/jpeg' });
    const hash = '1'.repeat(64);
    prepareImageUploadMock.mockResolvedValueOnce({ file, hash });
    getImagesListMock.mockResolvedValueOnce([r2Image(hash)]);
    uploadImageMock.mockResolvedValueOnce({ url: '/forced.jpg' });

    const { result } = renderHook(() => useImageUploadController({ value: '', onChange }));

    await act(async () => {
      await result.current.selectFile(file);
    });
    await act(async () => {
      await result.current.forceUpload();
    });

    expect(uploadImageMock).toHaveBeenCalledWith(file, undefined, hash);
    expect(onChange).toHaveBeenCalledWith('/forced.jpg');
    expect(result.current.hasPendingUpload).toBe(false);
  });

  it('exposes an error when upload preparation fails', async () => {
    const file = new File(['image'], 'image.jpg', { type: 'image/jpeg' });
    prepareImageUploadMock.mockRejectedValueOnce(new Error('boom'));

    const { result } = renderHook(() => useImageUploadController({ value: '', onChange: vi.fn() }));

    await act(async () => {
      await result.current.selectFile(file);
    });

    expect(result.current.error).toBe('图片上传失败，请重试');
    expect(result.current.isUploading).toBe(false);
  });

  it('clears pending duplicates when a new selection fails', async () => {
    const onChange = vi.fn();
    const duplicateFile = new File(['duplicate'], 'duplicate.jpg', { type: 'image/jpeg' });
    const failingFile = new File(['failing'], 'failing.jpg', { type: 'image/jpeg' });
    const hash = '1'.repeat(64);
    prepareImageUploadMock.mockResolvedValueOnce({ file: duplicateFile, hash });
    getImagesListMock.mockResolvedValueOnce([r2Image(hash)]);

    const { result } = renderHook(() => useImageUploadController({ value: '', onChange }));

    await act(async () => {
      await result.current.selectFile(duplicateFile);
    });

    expect(result.current.duplicates).toHaveLength(1);
    expect(result.current.hasPendingUpload).toBe(true);

    prepareImageUploadMock.mockRejectedValueOnce(new Error('boom'));

    await act(async () => {
      await result.current.selectFile(failingFile);
    });
    await act(async () => {
      await result.current.forceUpload();
    });

    expect(result.current.duplicates).toEqual([]);
    expect(result.current.hasPendingUpload).toBe(false);
    expect(uploadImageMock).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('ignores stale results when selectFile calls complete out of order', async () => {
    const onChange = vi.fn();
    const slowFile = new File(['slow'], 'slow.jpg', { type: 'image/jpeg' });
    const fastFile = new File(['fast'], 'fast.jpg', { type: 'image/jpeg' });
    const slowPrepared = deferred<{ file: File; hash: string }>();
    prepareImageUploadMock
      .mockReturnValueOnce(slowPrepared.promise)
      .mockResolvedValueOnce({ file: fastFile, hash: '2'.repeat(64) });
    getImagesListMock.mockResolvedValue([]);
    uploadImageMock.mockImplementation((file: File) =>
      Promise.resolve({ url: file === fastFile ? '/fast.jpg' : '/slow.jpg' }),
    );

    const { result } = renderHook(() => useImageUploadController({ value: '', onChange }));

    let slowSelect!: Promise<void>;
    await act(async () => {
      slowSelect = result.current.selectFile(slowFile);
    });
    await act(async () => {
      await result.current.selectFile(fastFile);
    });
    await act(async () => {
      slowPrepared.resolve({ file: slowFile, hash: '1'.repeat(64) });
      await slowSelect;
    });

    expect(uploadImageMock).toHaveBeenCalledTimes(1);
    expect(uploadImageMock).toHaveBeenCalledWith(fastFile, undefined, '2'.repeat(64));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('/fast.jpg');
    expect(result.current.duplicates).toEqual([]);
    expect(result.current.hasPendingUpload).toBe(false);
  });
});
