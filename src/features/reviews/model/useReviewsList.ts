import { useCallback, useEffect, useState } from 'react';
import type { CustomerReview } from '@/package/types';
import { getReviews, deleteReview, updateReview } from '../api/reviews.api';
import { reviewKeys } from '../api/reviews.keys';
import type { ReviewListFilters } from './review.types';
import { usePaginatedEntityListController } from '@/core/entities';

const PAGE_SIZE = 15;

function buildFilters(searchTerm: string, statusFilter: 'all' | 'published' | 'draft', page: number): ReviewListFilters {
  return {
    page,
    pageSize: PAGE_SIZE,
    ...(searchTerm ? { search: searchTerm } : {}),
    ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
  };
}

export function useReviewsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, searchTerm ? 400 : 0);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filters = buildFilters(debouncedSearch, statusFilter, page);

  const listController = usePaginatedEntityListController<
    CustomerReview,
    ReviewListFilters,
    Awaited<ReturnType<typeof getReviews>>,
    Awaited<ReturnType<typeof getReviews>>['pagination'],
    { id: number; status: 'published' | 'draft' },
    number
  >({
    keys: reviewKeys,
    filters,
    load: getReviews,
    select: (response) => ({
      items: response.data,
      pagination: response.pagination,
    }),
    mutations: {
      update: {
        execute: ({ id, status }) => updateReview(id, { status }),
      },
      remove: {
        execute: deleteReview,
      },
    },
  });

  const reviews = listController.items;
  const totalPages = listController.pagination?.totalPages ?? 1;
  const total = listController.pagination?.total ?? 0;

  const changeSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const changeStatusFilter = useCallback((status: 'all' | 'published' | 'draft') => {
    setStatusFilter(status);
    setPage(1);
  }, []);

  const changePage = useCallback((p: number) => {
    setPage(p);
  }, []);

  const removeReview = useCallback(
    async (id: number) => {
      await listController.remove(id);
    },
    [listController],
  );

  const toggleStatus = useCallback(
    async (review: CustomerReview) => {
      const next = review.status === 'published' ? 'draft' : 'published';
      await listController.update({ id: review.id, status: next });
    },
    [listController],
  );

  return {
    reviews,
    total,
    totalPages,
    page,
    isLoading: listController.isLoading,
    queryError: listController.error,
    searchTerm,
    statusFilter,
    changeSearch,
    changeStatusFilter,
    changePage,
    removeReview,
    toggleStatus,
  };
}
