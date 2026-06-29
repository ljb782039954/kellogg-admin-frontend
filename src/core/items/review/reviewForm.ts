import type { CustomerReview, ReviewInput } from '@/core/types';
import { extractYoutubeId } from './reviewYoutube';

export function createReviewInput(review?: CustomerReview | null): ReviewInput {
  return {
    client_name: review?.client_name ?? '',
    country: review?.country ?? '',
    rating: review?.rating ?? 5,
    media_type: review?.media_type ?? 'video',
    media_url: review?.media_url ?? '',
    review_text_zh: review?.review_text_zh ?? '',
    review_text_en: review?.review_text_en ?? '',
    sort_order: review?.sort_order ?? 0,
    status: review?.status ?? 'published',
  };
}

export function validateReviewInput(form: ReviewInput): string | null {
  if (!form.client_name.trim()) {
    return '请填写客户名称';
  }

  if (!form.media_url.trim()) {
    return '请填写媒体链接或上传图片';
  }

  if (form.media_type === 'video' && !extractYoutubeId(form.media_url)) {
    return 'YouTube 链接无效，请检查格式';
  }

  if (!form.review_text_zh.trim() || !form.review_text_en.trim()) {
    return '请填写中英文评价内容';
  }

  return null;
}
