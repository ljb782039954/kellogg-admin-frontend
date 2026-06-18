import type { CustomerReview, ReviewInput } from '@/types';
import type { ReviewFormValues } from './review.types';
import { createDefaultReview } from './review.defaults';

export { reviewSchema } from './review.schema';
export type { ReviewFormValues } from './review.types';

export function toReviewFormValues(review: CustomerReview | null | undefined): ReviewFormValues {
  if (!review) return createDefaultReview();

  return {
    clientName: review.client_name,
    country: review.country ?? '',
    rating: review.rating,
    media: { type: review.media_type, url: review.media_url },
    content: { zh: review.review_text_zh, en: review.review_text_en },
    sortOrder: review.sort_order,
    status: review.status,
  };
}

export function toCreateReviewInput(form: ReviewFormValues): ReviewInput {
  return {
    client_name: form.clientName,
    country: form.country || undefined,
    rating: form.rating,
    media_type: form.media.type,
    media_url: form.media.url,
    review_text_zh: form.content.zh,
    review_text_en: form.content.en,
    sort_order: form.sortOrder,
    status: form.status,
  };
}

export function toUpdateReviewInput(form: ReviewFormValues): Partial<ReviewInput> {
  return toCreateReviewInput(form);
}
