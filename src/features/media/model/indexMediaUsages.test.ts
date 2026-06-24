import { describe, expect, it } from 'vitest';
import type { R2Image } from '@/shared/media/types';
import { indexMediaUsages } from './indexMediaUsages';

function image(key: string, usages?: R2Image['usages']): R2Image {
  return {
    key,
    name: key,
    url: `/${key}`,
    thumbUrl: `/${key}`,
    size: 100,
    uploaded: '2026-06-18T00:00:00.000Z',
    usages,
  };
}

describe('indexMediaUsages', () => {
  it('indexes referenced images and omits unused images', () => {
    const result = indexMediaUsages([
      image('unused'),
      image('empty', []),
      image('used', [
        { type: 'product', name: 'Dress', id: '1' },
        { type: 'page', name: 'Home' },
      ]),
    ]);

    expect(result).toEqual({
      used: [
        { type: 'product', name: 'Dress', id: '1' },
        { type: 'page', name: 'Home', id: undefined },
      ],
    });
  });

  it('returns cloned usage entries without mutating source data', () => {
    const usages = [{ type: 'product', name: 'Dress', id: '1' }];
    const result = indexMediaUsages([image('used', usages)]);

    expect(result.used).not.toBe(usages);
    expect(result.used[0]).not.toBe(usages[0]);
    expect(usages).toEqual([{ type: 'product', name: 'Dress', id: '1' }]);
  });
});
