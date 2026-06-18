import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CustomerReview } from '@/types';
import { getReviews, deleteReview, updateReview } from '../api/reviews.api';
import { reviewKeys } from '../api/reviews.keys';
import type { ReviewListFilters } from './review.types';

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
  const queryClient = useQueryClient();
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

  const query = useQuery({
    queryKey: reviewKeys.list(filters),
    queryFn: () => getReviews(filters),
  });

  const reviews = query.data?.data ?? [];
  const totalPages = query.data?.pagination?.totalPages ?? 1;
  const total = query.data?.pagination?.total ?? 0;

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteReview(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: reviewKeys.lists() }),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'published' | 'draft' }) =>
      updateReview(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: reviewKeys.lists() }),
  });

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
      await deleteMutation.mutateAsync(id);
    },
    [deleteMutation],
  );

  const toggleStatus = useCallback(
    async (review: CustomerReview) => {
      const next = review.status === 'published' ? 'draft' : 'published';
      await toggleMutation.mutateAsync({ id: review.id, status: next });
    },
    [toggleMutation],
  );

  return {
    reviews,
    total,
    totalPages,
    page,
    isLoading: query.isLoading,
    queryError: query.error,
    searchTerm,
    statusFilter,
    changeSearch,
    changeStatusFilter,
    changePage,
    removeReview,
    toggleStatus,
  };
}
