import { useCallback, useEffect, useState } from 'react';
import type { CustomerReview, ReviewInput } from '@/types';
import { createReview, updateReview } from '../api/reviews.api';

export function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pat of patterns) {
    const m = url.match(pat);
    if (m) return m[1];
  }
  return null;
}

interface UseReviewFormOptions {
  review?: CustomerReview | null;
  onSaved: () => void;
  onClose: () => void;
}

export function useReviewForm({ review, onSaved, onClose }: UseReviewFormOptions) {
  const isEdit = !!review;
  const [form, setForm] = useState<ReviewInput>({
    client_name: review?.client_name ?? '',
    country: review?.country ?? '',
    rating: review?.rating ?? 5,
    media_type: review?.media_type ?? 'video',
    media_url: review?.media_url ?? '',
    review_text_zh: review?.review_text_zh ?? '',
    review_text_en: review?.review_text_en ?? '',
    sort_order: review?.sort_order ?? 0,
    status: review?.status ?? 'published',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const youtubeId = form.media_type === 'video' ? extractYoutubeId(form.media_url) : null;
  const youtubeThumbnail = youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
    : null;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const setField = useCallback(<K extends keyof ReviewInput>(key: K, value: ReviewInput[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  }, []);

  const validate = useCallback((): string | null => {
    if (!form.client_name.trim()) return '请填写客户名称';
    if (!form.media_url.trim()) return '请填写媒体链接或上传图片';
    if (form.media_type === 'video' && !youtubeId) return 'YouTube 链接无效，请检查格式';
    if (!form.review_text_zh.trim() || !form.review_text_en.trim()) return '请填写中英文评价内容';
    return null;
  }, [form, youtubeId]);

  const handleSave = useCallback(async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsSaving(true);
    try {
      if (isEdit && review) {
        await updateReview(review.id, form);
      } else {
        await createReview(form);
      }
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err?.message || '保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  }, [validate, isEdit, review, form, onSaved, onClose]);

  return {
    form,
    setField,
    isEdit,
    isSaving,
    error,
    youtubeId,
    youtubeThumbnail,
    handleSave,
    onClose,
  };
}
