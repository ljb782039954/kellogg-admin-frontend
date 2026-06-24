import type { Translation } from '@/shared/i18n/translation';
export type { ReviewListFilters } from '@/package/types';

export type ReviewFormValues = {
  clientName: string;
  country: string;
  rating: number;
  media: {
    type: 'video' | 'image';
    url: string;
  };
  content: Translation;
  sortOrder: number;
  status: 'published' | 'draft';
};
