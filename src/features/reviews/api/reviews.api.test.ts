import { beforeEach, describe, expect, it, vi } from 'vitest';

const { requestMock } = vi.hoisted(() => ({ requestMock: vi.fn() }));

vi.mock('@/shared/api/client', () => ({
  apiClient: { request: requestMock },
}));

import { createReview, deleteReview, getReviews, updateReview } from './reviews.api';
import { reviewKeys } from './reviews.keys';

const input = {
  client_name: 'Alice',
  media_type: 'image' as const,
  media_url: '/review.jpg',
  review_text_zh: '很好',
  review_text_en: 'Great',
};

describe('reviews api', () => {
  beforeEach(() => requestMock.mockReset());

  it('uses filters in both the query URL and query key', async () => {
    const filters = { page: 2, pageSize: 15, search: 'alice', status: 'draft' as const };
    requestMock.mockResolvedValueOnce({ data: [], pagination: {} });

    await getReviews(filters);

    expect(requestMock).toHaveBeenCalledWith(
      '/api/admin/reviews?page=2&pageSize=15&search=alice&status=draft',
    );
    expect(reviewKeys.list(filters)).toEqual(['reviews', 'list', filters]);
  });

  it('creates a review', async () => {
    requestMock.mockResolvedValueOnce({ id: 1, message: 'ok' });
    await createReview(input);
    expect(requestMock).toHaveBeenCalledWith('/api/admin/reviews', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  });

  it('updates and deletes a review', async () => {
    requestMock.mockResolvedValue({ message: 'ok' });
    await updateReview(3, { status: 'published' });
    expect(requestMock).toHaveBeenLastCalledWith('/api/admin/reviews/3', {
      method: 'PUT',
      body: JSON.stringify({ status: 'published' }),
    });

    await deleteReview(3);
    expect(requestMock).toHaveBeenLastCalledWith('/api/admin/reviews/3', {
      method: 'DELETE',
    });
  });
});
