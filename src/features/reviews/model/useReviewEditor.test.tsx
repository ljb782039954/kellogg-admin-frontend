import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CustomerReview } from '@/package/types';

const { createReviewMock, updateReviewMock } = vi.hoisted(() => ({
  createReviewMock: vi.fn(),
  updateReviewMock: vi.fn(),
}));

vi.mock('../api/reviews.api', () => ({
  createReview: createReviewMock,
  updateReview: updateReviewMock,
}));

import { useReviewEditor } from './useReviewEditor';

const review: CustomerReview = {
  id: 7,
  client_name: 'Alice',
  country: 'US',
  rating: 4,
  media_type: 'image',
  media_url: '/review.jpg',
  review_text_zh: '很好',
  review_text_en: 'Great',
  sort_order: 2,
  status: 'draft',
  created_at: '2026-06-18',
  updated_at: '2026-06-18',
};

function createWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return {
    client,
    Wrapper({ children }: { children: ReactNode }) {
      return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
    },
  };
}

function fillValidForm(result: { current: ReturnType<typeof useReviewEditor> }) {
  act(() => {
    result.current.form.setValue('clientName', 'Bob');
    result.current.form.setValue('media', { type: 'image', url: '/bob.jpg' });
    result.current.form.setValue('content', { zh: '不错', en: 'Good' });
  });
}

describe('useReviewEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes create defaults and prevents invalid submission', async () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useReviewEditor(), { wrapper: Wrapper });

    expect(result.current.isEdit).toBe(false);
    expect(result.current.form.getValues()).toMatchObject({
      rating: 5,
      status: 'published',
    });

    await act(async () => result.current.submit());
    expect(createReviewMock).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(result.current.form.getFieldState('clientName').error).toBeDefined();
    });
  });

  it('creates a valid review and invalidates the list', async () => {
    createReviewMock.mockResolvedValueOnce({ id: 1, message: 'ok' });
    const { Wrapper, client } = createWrapper();
    const invalidateSpy = vi.spyOn(client, 'invalidateQueries');
    const { result } = renderHook(() => useReviewEditor(), { wrapper: Wrapper });
    fillValidForm(result);

    await act(async () => result.current.submit());

    expect(createReviewMock).toHaveBeenCalledWith(expect.objectContaining({
      client_name: 'Bob',
      media_type: 'image',
      media_url: '/bob.jpg',
      review_text_zh: '不错',
      review_text_en: 'Good',
    }));
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['reviews', 'list'] });
  });

  it('initializes and updates an existing review', async () => {
    updateReviewMock.mockResolvedValueOnce({ message: 'ok' });
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useReviewEditor(review), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.form.getValues('clientName')).toBe('Alice'));
    expect(result.current.isEdit).toBe(true);

    act(() => result.current.form.setValue('rating', 5));
    await act(async () => result.current.submit());

    expect(updateReviewMock).toHaveBeenCalledWith(
      7,
      expect.objectContaining({ rating: 5, client_name: 'Alice' }),
    );
  });

  it('resets the form when the edited review changes and exposes mutation errors', async () => {
    updateReviewMock.mockRejectedValueOnce(new Error('save failed'));
    const { Wrapper } = createWrapper();
    const { result, rerender } = renderHook(
      ({ currentReview }) => useReviewEditor(currentReview),
      { initialProps: { currentReview: review as CustomerReview | null }, wrapper: Wrapper },
    );
    await waitFor(() => expect(result.current.form.getValues('clientName')).toBe('Alice'));

    const nextReview = { ...review, id: 8, client_name: 'Carol' };
    rerender({ currentReview: nextReview });
    await waitFor(() => expect(result.current.form.getValues('clientName')).toBe('Carol'));

    await act(async () => {
      await expect(result.current.submit()).rejects.toThrow('save failed');
    });
    await waitFor(() => expect(result.current.mutationError).toEqual(new Error('save failed')));
  });
});
