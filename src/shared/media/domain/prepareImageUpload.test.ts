import { describe, expect, it, vi } from 'vitest';
import { prepareImageUpload } from './prepareImageUpload';

describe('prepareImageUpload', () => {
  it('returns non-image files unchanged without dimensions or hash', async () => {
    const file = new File(['hello'], 'notes.txt', { type: 'text/plain' });

    await expect(prepareImageUpload(file)).resolves.toEqual({ file });
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
});
