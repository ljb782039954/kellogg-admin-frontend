import type { ReviewListFilters } from '../model/review.types';

export const reviewKeys = {
  all: ['reviews'] as const,
  lists: () => [...reviewKeys.all, 'list'] as const,
  list: (filters?: ReviewListFilters) => [...reviewKeys.lists(), filters] as const,
};
