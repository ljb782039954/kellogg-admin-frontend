import type { Translation } from '@/types';
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

