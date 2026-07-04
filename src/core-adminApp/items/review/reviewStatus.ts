import type { CustomerReview } from '@/cms/types';

export type ReviewStatusFilter = 'all' | CustomerReview['status'];

export function getNextReviewStatus(status: CustomerReview['status']): CustomerReview['status'] {
  return status === 'published' ? 'draft' : 'published';
}
