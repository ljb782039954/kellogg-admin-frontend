import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CustomerReview } from '@/package/types';

const { getReviewsMock, deleteReviewMock, updateReviewMock } = vi.hoisted(() => ({
  getReviewsMock: vi.fn(),
  deleteReviewMock: vi.fn(),
  updateReviewMock: vi.fn(),
}));

vi.mock('../api/reviews.api', () => ({
  getReviews: getReviewsMock,
  deleteReview: deleteReviewMock,
  updateReview: updateReviewMock,
}));

import { useReviewsList } from './useReviewsList';

const review: CustomerReview = {
  id: 1,
  client_name: 'Alice',
  country: 'US',
  rating: 5,
  media_type: 'image',
  media_url: '/review.jpg',
  review_text_zh: '很好',
  review_text_en: 'Great',
  sort_order: 0,
  status: 'published',
  created_at: '2026-06-18',
  updated_at: '2026-06-18',
};

function createWrapper() {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
  return {
    client,
    Wrapper({ children }: { children: ReactNode }) {
      return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
    },
  };
}

describe('useReviewsList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getReviewsMock.mockResolvedValue({
      data: [review],
      pagination: { page: 1, pageSize: 15, total: 1, totalPages: 1 },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('loads reviews with the default filters', async () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useReviewsList(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(getReviewsMock).toHaveBeenCalledWith({ page: 1, pageSize: 15 });
    expect(result.current.reviews).toEqual([review]);
    expect(result.current.total).toBe(1);
  });

  it('debounces search and resets the page', async () => {
    vi.useFakeTimers();
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useReviewsList(), { wrapper: Wrapper });
    await act(async () => {
      await vi.runOnlyPendingTimersAsync();
    });

    act(() => result.current.changePage(3));
    act(() => result.current.changeSearch('alice'));
    expect(result.current.page).toBe(3);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(400);
    });

    expect(result.current.page).toBe(1);
    expect(getReviewsMock).toHaveBeenCalledWith({
      page: 1,
      pageSize: 15,
      search: 'alice',
    });
  });

  it('changes status filter and resets the page', async () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useReviewsList(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => result.current.changePage(2));
    act(() => result.current.changeStatusFilter('draft'));

    await waitFor(() => expect(getReviewsMock).toHaveBeenCalledWith({
      page: 1,
      pageSize: 15,
      status: 'draft',
    }));
    expect(result.current.page).toBe(1);
  });

  it('deletes reviews and toggles status with list invalidation', async () => {
    deleteReviewMock.mockResolvedValueOnce({ message: 'ok' });
    updateReviewMock.mockResolvedValueOnce({ message: 'ok' });
    const { Wrapper, client } = createWrapper();
    const invalidateSpy = vi.spyOn(client, 'invalidateQueries');
    const { result } = renderHook(() => useReviewsList(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => result.current.removeReview(1));
    expect(deleteReviewMock).toHaveBeenCalledWith(1);

    await act(async () => result.current.toggleStatus(review));
    expect(updateReviewMock).toHaveBeenCalledWith(1, { status: 'draft' });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['reviews', 'list'] });
  });

  it('exposes list query errors', async () => {
    getReviewsMock.mockReset();
    getReviewsMock.mockRejectedValueOnce(new Error('load failed'));
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useReviewsList(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.queryError).toEqual(new Error('load failed')));
  });
});
