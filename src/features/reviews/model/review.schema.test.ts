import { describe, expect, it } from 'vitest';
import { createDefaultReview } from './review.defaults';
import { reviewSchema } from './review.schema';

function validReview() {
  return {
    ...createDefaultReview(),
    clientName: 'Alice',
    media: { type: 'video' as const, url: 'https://youtu.be/abcdefghijk' },
    content: { zh: '很好', en: 'Great' },
  };
}

describe('review schema', () => {
  it('accepts a complete review form', () => {
    expect(reviewSchema.safeParse(validReview()).success).toBe(true);
  });

  it.each([
    ['clientName', { clientName: '' }],
    ['rating below range', { rating: 0 }],
    ['rating above range', { rating: 6 }],
    ['media url', { media: { type: 'video', url: '' } }],
    ['Chinese content', { content: { zh: '', en: 'Great' } }],
    ['English content', { content: { zh: '很好', en: '' } }],
    ['negative sort order', { sortOrder: -1 }],
  ])('rejects invalid %s', (_name, patch) => {
    expect(reviewSchema.safeParse({ ...validReview(), ...patch }).success).toBe(false);
  });

  it('rejects non-integer sort order and unsupported status', () => {
    expect(reviewSchema.safeParse({ ...validReview(), sortOrder: 1.5 }).success).toBe(false);
    expect(reviewSchema.safeParse({ ...validReview(), status: 'archived' }).success).toBe(false);
  });
});
