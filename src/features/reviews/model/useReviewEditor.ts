import { useCallback, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { CustomerReview } from '@/types';
import { createReview, updateReview } from '../api/reviews.api';
import { reviewKeys } from '../api/reviews.keys';
import { reviewSchema } from './review.schema';
import { createDefaultReview } from './review.defaults';
import { toReviewFormValues, toCreateReviewInput, toUpdateReviewInput } from './review.mapper';
import type { ReviewFormValues } from './review.types';
import { invalidateEntityLists } from '@/core/entities';

export function useReviewEditor(review?: CustomerReview | null) {
  const queryClient = useQueryClient();
  const isEdit = !!review;

  const form = useForm<ReviewFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(reviewSchema) as any,
    defaultValues: createDefaultReview(),
  });

  useEffect(() => {
    form.reset(toReviewFormValues(review));
  }, [form, review]);

  const mutation = useMutation({
    mutationFn: async (values: ReviewFormValues) => {
      if (isEdit && review) {
        await updateReview(review.id, toUpdateReviewInput(values));
      } else {
        await createReview(toCreateReviewInput(values));
      }
    },
    onSuccess: () => {
      invalidateEntityLists(queryClient, reviewKeys);
    },
  });

  const doSubmit = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (values: any) => {
      await mutation.mutateAsync(values as ReviewFormValues);
    },
    [mutation],
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submit = form.handleSubmit(doSubmit) as any;

  return {
    form,
    isEdit,
    isSaving: mutation.isPending,
    mutationError: mutation.error,
    submit,
  };
}
