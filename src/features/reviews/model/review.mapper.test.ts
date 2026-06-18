import { describe, expect, it } from 'vitest';
import type { CustomerReview } from '@/types';
import {
  toCreateReviewInput,
  toReviewFormValues,
  toUpdateReviewInput,
} from './review.mapper';

const review: CustomerReview = {
  id: 1,
  client_name: 'Alice',
  country: null,
  rating: 4,
  media_type: 'video',
  media_url: 'https://youtu.be/abcdefghijk',
  review_text_zh: '很好',
  review_text_en: 'Great',
  sort_order: 2,
  status: 'draft',
  created_at: '2026-06-18',
  updated_at: '2026-06-18',
};

describe('review mapper', () => {
  it('returns defaults when no review is provided', () => {
    expect(toReviewFormValues(undefined)).toEqual({
      clientName: '',
      country: '',
      rating: 5,
      media: { type: 'video', url: '' },
      content: { zh: '', en: '' },
      sortOrder: 0,
      status: 'published',
    });
  });

  it('maps an API review to the form model', () => {
    expect(toReviewFormValues(review)).toEqual({
      clientName: 'Alice',
      country: '',
      rating: 4,
      media: { type: 'video', url: 'https://youtu.be/abcdefghijk' },
      content: { zh: '很好', en: 'Great' },
      sortOrder: 2,
      status: 'draft',
    });
  });

  it('maps the form model to create and update inputs', () => {
    const form = toReviewFormValues(review);
    expect(toCreateReviewInput(form)).toEqual({
      client_name: 'Alice',
      country: undefined,
      rating: 4,
      media_type: 'video',
      media_url: 'https://youtu.be/abcdefghijk',
      review_text_zh: '很好',
      review_text_en: 'Great',
      sort_order: 2,
      status: 'draft',
    });
    expect(toUpdateReviewInput(form)).toEqual(toCreateReviewInput(form));
  });
});
