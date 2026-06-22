import { describe, it, expect } from 'vitest';
import { reviewAdapter } from '@/package/adapters/review.adapter';
import type { CustomerReview } from '@/package/types';

const model: CustomerReview = {
  id: 7, client_name: 'Acme', country: null, rating: 5,
  media_type: 'image', media_url: 'u', review_text_zh: 'z', review_text_en: 'e',
  sort_order: 2, status: 'published', created_at: 't1', updated_at: 't2',
};

describe('reviewAdapter', () => {
  it('fromDto 恒等返回（api 直返 Model 形）', () => {
    expect(reviewAdapter.fromDto(model)).toBe(model);
  });
  it('toInput 取可创建子集，country null→undefined', () => {
    expect(reviewAdapter.toInput(model)).toEqual({
      client_name: 'Acme', country: undefined, rating: 5,
      media_type: 'image', media_url: 'u', review_text_zh: 'z', review_text_en: 'e',
      sort_order: 2, status: 'published',
    });
  });
  it('toRequest 恒等返回 input 作为请求体', () => {
    const input = reviewAdapter.toInput(model);
    expect(reviewAdapter.toRequest(input)).toBe(input);
  });
});
