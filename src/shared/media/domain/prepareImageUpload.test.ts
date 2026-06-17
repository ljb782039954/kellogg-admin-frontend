import { afterEach, describe, expect, it, vi } from 'vitest';
import { prepareImageUpload } from './prepareImageUpload';

function mockObjectUrl(url = 'blob:mock-image') {
  const createObjectURL = vi.fn().mockReturnValue(url);
  const revokeObjectURL = vi.fn();

  vi.stubGlobal('URL', {
    ...URL,
    createObjectURL,
    revokeObjectURL,
  });

  return { createObjectURL, revokeObjectURL, url };
}

function mockImageLoad({ width, height }: { width: number; height: number }) {
  class MockImage {
    width = width;
    height = height;
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;

    set src(_url: string) {
      queueMicrotask(() => this.onload?.());
    }
  }

  vi.stubGlobal('Image', MockImage);
}

function mockImageError() {
  class MockImage {
    width = 0;
    height = 0;
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;

    set src(_url: string) {
      queueMicrotask(() => this.onerror?.());
    }
  }

  vi.stubGlobal('Image', MockImage);
}

describe('prepareImageUpload', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns non-image files unchanged without dimensions or hash', async () => {
    const file = new File(['hello'], 'notes.txt', { type: 'text/plain' });
    const readDimensions = vi.fn();
    const resize = vi.fn();
    const calculateHash = vi.fn();

    await expect(prepareImageUpload(file, {
      maxWidth: 400,
      readDimensions,
      resize,
      calculateHash,
    })).resolves.toEqual({ file });

    expect(readDimensions).not.toHaveBeenCalled();
    expect(resize).not.toHaveBeenCalled();
    expect(calculateHash).not.toHaveBeenCalled();
  });

  it('resizes image files and normalizes empty hashes to undefined', async () => {
    const original = new File(['image'], 'image.jpg', { type: 'image/jpeg' });
    const resized = new File(['resized'], 'image.jpg', { type: 'image/jpeg' });
    const readDimensions = vi.fn().mockResolvedValue({ width: 1200, height: 800 });
    const resize = vi.fn().mockResolvedValue(resized);
    const calculateHash = vi.fn().mockResolvedValue('');

    const prepared = await prepareImageUpload(original, {
      maxWidth: 400,
      readDimensions,
      resize,
      calculateHash,
    });

    expect(readDimensions).toHaveBeenCalledWith(original);
    expect(resize).toHaveBeenCalledWith(original, 400);
    expect(calculateHash).toHaveBeenCalledWith(resized);
    expect(prepared).toEqual({
      file: resized,
      dimensions: { width: 1200, height: 800 },
      hash: undefined,
    });
  });

  it('keeps the original image file when maxWidth is omitted', async () => {
    const file = new File(['image'], 'image.jpg', { type: 'image/jpeg' });
    const resize = vi.fn();
    const calculateHash = vi.fn().mockResolvedValue('1'.repeat(64));

    const prepared = await prepareImageUpload(file, {
      resize,
      calculateHash,
      readDimensions: vi.fn().mockResolvedValue(undefined),
    });

    expect(resize).not.toHaveBeenCalled();
    expect(prepared.file).toBe(file);
    expect(prepared.hash).toBe('1'.repeat(64));
  });

  it('reads dimensions with the default image loader and revokes the object URL on load', async () => {
    const file = new File(['image'], 'image.jpg', { type: 'image/jpeg' });
    const { createObjectURL, revokeObjectURL, url } = mockObjectUrl();
    const calculateHash = vi.fn().mockResolvedValue('1'.repeat(64));
    mockImageLoad({ width: 640, height: 480 });

    const prepared = await prepareImageUpload(file, { calculateHash });

    expect(createObjectURL).toHaveBeenCalledWith(file);
    expect(revokeObjectURL).toHaveBeenCalledWith(url);
    expect(prepared.dimensions).toEqual({ width: 640, height: 480 });
    expect(prepared.file).toBe(file);
    expect(prepared.hash).toBe('1'.repeat(64));
  });

  it('returns undefined dimensions with the default image loader and revokes the object URL on error', async () => {
    const file = new File(['image'], 'image.jpg', { type: 'image/jpeg' });
    const { createObjectURL, revokeObjectURL, url } = mockObjectUrl();
    const calculateHash = vi.fn().mockResolvedValue('1'.repeat(64));
    mockImageError();

    const prepared = await prepareImageUpload(file, { calculateHash });

    expect(createObjectURL).toHaveBeenCalledWith(file);
    expect(revokeObjectURL).toHaveBeenCalledWith(url);
    expect(prepared.dimensions).toBeUndefined();
    expect(prepared.file).toBe(file);
    expect(prepared.hash).toBe('1'.repeat(64));
  });
});
