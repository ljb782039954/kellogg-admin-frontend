import { describe, expect, it } from 'vitest';
import type { R2Image } from '@/shared/media/types';
import { findSimilarMediaAssets, similarMatchLabel } from './findSimilarMediaAssets';

function image(key: string, overrides: Partial<R2Image> = {}): R2Image {
  return {
    key,
    name: `${key}.jpg`,
    url: `/${key}.jpg`,
    thumbUrl: `/${key}-thumb.jpg`,
    size: 1000,
    uploaded: '2026-06-18T00:00:00.000Z',
    ...overrides,
  };
}

describe('findSimilarMediaAssets', () => {
  it('classifies hash matches and excludes the selected image', () => {
    const hash = '1'.repeat(64);
    const result = findSimilarMediaAssets(image('selected', { hash }), [
      image('selected', { hash }),
      image('exact', { hash }),
      image('high', { hash: `${'1'.repeat(60)}0000` }),
      image('far', { hash: '0'.repeat(64), size: 3000 }),
    ]);

    expect(result.map((item) => [item.image.key, item.matchType])).toEqual([
      ['exact', 'exact_hash'],
      ['high', 'high_similarity'],
    ]);
  });

  it('falls back to dimensions and file-size heuristics in priority order', () => {
    const selected = image('selected', { dimensions: '800x600', size: 1000 });
    const result = findSimilarMediaAssets(selected, [
      image('close', { size: 1040 }),
      image('same-size', { size: 1000 }),
      image('same-dimensions', { dimensions: '800x600', size: 1500 }),
      image('exact-metadata', { dimensions: '800x600', size: 1000 }),
    ]);

    expect(result.map((item) => item.matchType)).toEqual([
      'exact',
      'dimension',
      'size',
      'close_size',
    ]);
  });

  it('supports a custom similarity policy and handles zero-byte assets', () => {
    const result = findSimilarMediaAssets(
      image('selected', { size: 0 }),
      [image('other', { size: 1 })],
      { hashExactThreshold: 1, hashHighThreshold: 0.99, sizeDiffRatio: 1 },
    );

    expect(result).toEqual([]);
  });

  it('formats reason codes for display', () => {
    expect(similarMatchLabel('VISUAL_IDENTICAL')).toContain('100%');
    expect(similarMatchLabel('VISUAL_HIGH_SIMILARITY', 0.875)).toBe('视觉相似度: 88%');
    expect(similarMatchLabel('SAME_DIMENSIONS_SIZE')).toBe('尺寸与大小完全相同');
    expect(similarMatchLabel('UNKNOWN')).toBe('');
  });
});
