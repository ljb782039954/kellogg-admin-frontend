import type { CustomerReview } from '@/types';
import { useReviewForm } from '../model/useReviewForm';
import { ReviewFormView } from './ReviewFormView';

interface ReviewFormDialogProps {
  review?: CustomerReview | null;
  onClose: () => void;
  onSaved: () => void;
}

export function ReviewFormDialog({ review, onClose, onSaved }: ReviewFormDialogProps) {
  const {
    form, setField, isEdit, isSaving, error,
    youtubeId, youtubeThumbnail, handleSave,
  } = useReviewForm({ review, onSaved, onClose });

  return (
    <ReviewFormView
      form={form}
      isEdit={isEdit}
      isSaving={isSaving}
      error={error}
      youtubeId={youtubeId}
      youtubeThumbnail={youtubeThumbnail}
      onFieldChange={setField}
      onSave={handleSave}
      onClose={onClose}
    />
  );
}
