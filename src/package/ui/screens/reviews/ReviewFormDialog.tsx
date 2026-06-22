import type { CustomerReview } from '@/package/types';
import { useReviewEditor } from '@/features/reviews/model/useReviewEditor';
import { ReviewFormView } from './ReviewFormView';

interface ReviewFormDialogProps {
  review?: CustomerReview | null;
  onClose: () => void;
  onSaved: () => void;
}

export function ReviewFormDialog({ review, onClose, onSaved }: ReviewFormDialogProps) {
  const { form, isEdit, isSaving, mutationError, submit } = useReviewEditor(review);

  return (
    <ReviewFormView
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      form={form as any}
      isEdit={isEdit}
      isSaving={isSaving}
      mutationError={mutationError}
      onSubmit={async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (submit as any)();
        onSaved();
      }}
      onClose={onClose}
    />
  );
}
