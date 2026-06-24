import type { ReviewListFilters } from '../model/review.types';
import { createEntityQueryKeys } from '@/core/entities';

export const reviewKeys = createEntityQueryKeys<
  'reviews',
  number,
  ReviewListFilters
>('reviews');
