import { describe, expect, it } from 'vitest';
import type { R2Image } from '@/shared/media/types';
import { findDuplicateImages } from './findDuplicateImages';

function image(key: string, hash?: string): R2Image {
  return {
    key,
    name: `${key}.jpg`,
    url: `/${key}.jpg`,
    thumbUrl: `/${key}-thumb.jpg`,
    size: 100,
    hash,
    uploaded: '2026-06-16T00:00:00.000Z',
  };
}

describe('findDuplicateImages', () => {
  it('returns matches at or above the threshold sorted by similarity', () => {
    const hash = '1'.repeat(64);
    const oneBitDifferent = `${'1'.repeat(63)}0`;
    const twoBitsDifferent = `${'1'.repeat(62)}00`;
    const farDifferent = '0'.repeat(64);

    const matches = findDuplicateImages(hash, [
      image('no-hash'),
      image('far', farDifferent),
      image('two-bit', twoBitsDifferent),
      image('exact', hash),
      image('one-bit', oneBitDifferent),
    ], 0.95);

    expect(matches.map((match) => match.image.key)).toEqual(['exact', 'one-bit', 'two-bit']);
    expect(matches.map((match) => match.similarity)).toEqual([1, 63 / 64, 62 / 64]);
  });

  it('returns an empty list when the selected hash is missing', () => {
    expect(findDuplicateImages('', [image('exact', '1'.repeat(64))])).toEqual([]);
    expect(findDuplicateImages(undefined, [image('exact', '1'.repeat(64))])).toEqual([]);
  });

  it('returns zero similarity for images without hashes when the threshold allows it', () => {
    const matches = findDuplicateImages('1'.repeat(64), [image('no-hash')], 0);

    expect(matches).toHaveLength(1);
    expect(matches[0].image.key).toBe('no-hash');
    expect(matches[0].similarity).toBe(0);
  });
});
