import type { EntityAdapter } from '@/core/contracts';
import type { CustomerReview, ReviewInput } from '@/package/types';

export const reviewAdapter: EntityAdapter<CustomerReview, CustomerReview, ReviewInput> = {
  fromDto(dto: CustomerReview): CustomerReview {
    return dto;
  },
  toInput(model: CustomerReview): ReviewInput {
    return {
      client_name: model.client_name,
      country: model.country ?? undefined,
      rating: model.rating,
      media_type: model.media_type,
      media_url: model.media_url,
      review_text_zh: model.review_text_zh,
      review_text_en: model.review_text_en,
      sort_order: model.sort_order,
      status: model.status,
    };
  },
  toRequest(input: ReviewInput): unknown {
    return input;
  },
};
