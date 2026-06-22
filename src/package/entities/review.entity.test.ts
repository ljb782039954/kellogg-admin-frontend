import { describe, it, expect } from 'vitest';
import { reviewEntity } from '@/package/entities/review.entity';
import { reviewAdapter } from '@/package/adapters/review.adapter';

describe('reviewEntity', () => {
  it('键、端点、能力、屏幕 id 正确', () => {
    expect(reviewEntity.key).toBe('reviews');
    expect(reviewEntity.endpoint).toBe('/api/admin/reviews');
    expect(reviewEntity.capabilities).toEqual({ list: true, create: true, update: true, delete: true });
    expect(reviewEntity.screens.list).toBe('reviews');
    expect(reviewEntity.adapter).toBe(reviewAdapter);
  });
  it('defaultFilters 含分页', () => {
    expect(reviewEntity.defaultFilters).toEqual({ page: 1, pageSize: 20 });
  });
});
