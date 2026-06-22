import type { EntityDefinition } from '@/core/contracts';
import type { CustomerReview, ReviewInput, ReviewListFilters } from '@/package/types';
import { reviewAdapter } from '@/package/adapters/review.adapter';

export const reviewEntity: EntityDefinition<
  CustomerReview,
  CustomerReview,
  ReviewInput,
  ReviewListFilters
> = {
  key: 'reviews',
  endpoint: '/api/admin/reviews',
  adapter: reviewAdapter,
  capabilities: { list: true, create: true, update: true, delete: true },
  defaultFilters: { page: 1, pageSize: 20 },
  screens: { list: 'reviews' },
};
