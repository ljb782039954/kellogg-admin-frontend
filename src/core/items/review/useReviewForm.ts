import { useMemo, useState } from 'react';
import { api } from '@/core/lib/api';
import type { CustomerReview, ReviewInput } from '@/core/types';
import { createReviewInput, validateReviewInput } from './reviewForm';
import { extractYoutubeId, getYoutubeThumbnailUrl } from './reviewYoutube';

interface ReviewFormNotifier {
  success?: (message: string) => void;
  error?: (message: string) => void;
}

interface ReviewFormMessages {
  createSuccess: string;
  updateSuccess: string;
  saveFailure: string;
}

export interface UseReviewFormOptions {
  messages?: Partial<ReviewFormMessages>;
  notify?: ReviewFormNotifier;
  onClose: () => void;
  onSaved: () => void;
  review?: CustomerReview | null;
}

const DEFAULT_MESSAGES: ReviewFormMessages = {
  createSuccess: '评价已创建',
  updateSuccess: '评价已更新',
  saveFailure: '保存失败，请重试',
};

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function useReviewForm({
  messages: customMessages,
  notify,
  onClose,
  onSaved,
  review,
}: UseReviewFormOptions) {
  const messages = { ...DEFAULT_MESSAGES, ...customMessages };
  const isEdit = !!review;
  const [form, setForm] = useState<ReviewInput>(() => createReviewInput(review));
  const [isSaving, setIsSaving] = useState(false);

  const youtubeId = useMemo(
    () => form.media_type === 'video' ? extractYoutubeId(form.media_url) : null,
    [form.media_type, form.media_url]
  );
  const youtubeThumbnail = useMemo(
    () => form.media_type === 'video' ? getYoutubeThumbnailUrl(form.media_url) : null,
    [form.media_type, form.media_url]
  );

  const setField = <K extends keyof ReviewInput>(key: K, value: ReviewInput[K]) => {
    setForm(previous => ({ ...previous, [key]: value }));
  };

  const handleSave = async () => {
    const validationError = validateReviewInput(form);
    if (validationError) {
      notify?.error?.(validationError);
      return;
    }

    setIsSaving(true);

    try {
      if (isEdit && review) {
        await api.updateReview(review.id, form);
        notify?.success?.(messages.updateSuccess);
      } else {
        await api.createReview(form);
        notify?.success?.(messages.createSuccess);
      }

      onSaved();
      onClose();
    } catch (error) {
      notify?.error?.(getErrorMessage(error, messages.saveFailure));
    } finally {
      setIsSaving(false);
    }
  };

  return {
    form,
    isEdit,
    isSaving,
    youtubeId,
    youtubeThumbnail,
    handleSave,
    setField,
  };
}
