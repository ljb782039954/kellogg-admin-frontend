import type { ReviewFormValues } from './review.types';

export function createDefaultReview(): ReviewFormValues {
  return {
    clientName: '',
    country: '',
    rating: 5,
    media: { type: 'video', url: '' },
    content: { zh: '', en: '' },
    sortOrder: 0,
    status: 'published',
  };
}
