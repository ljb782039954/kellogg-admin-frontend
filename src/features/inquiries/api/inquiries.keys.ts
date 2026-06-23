import type { InquiryListFilters } from '@/package/types';

export const inquiryKeys = {
  all: ['inquiries'] as const,
  lists: () => [...inquiryKeys.all, 'list'] as const,
  list: (filters: InquiryListFilters) =>
    [...inquiryKeys.lists(), filters] as const,
};
