import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CustomerReview } from '@/types';
import { getReviews, createReview, updateReview, deleteReview } from '../api/reviews.api';
import { reviewKeys } from '../api/reviews.keys';

const PAGE_SIZE = 15;

export function useReviewsManager() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, searchTerm ? 400 : 0);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filters: Record<string, unknown> = {
    page,
    pageSize: PAGE_SIZE,
    ...(statusFilter !== 'all' && { status: statusFilter }),
    ...(debouncedSearch && { search: debouncedSearch }),
  };

  const query = useQuery({
    queryKey: reviewKeys.list(filters),
    queryFn: () => getReviews(filters),
  });

  const reviews = query.data?.data ?? [];
  const totalPages = query.data?.pagination?.totalPages ?? 1;
  const total = query.data?.pagination?.total ?? 0;

  const invalidateList = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
  }, [queryClient]);

  const createMutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => invalidateList(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<import('@/types').ReviewInput> }) =>
      updateReview(id, data),
    onSuccess: () => invalidateList(),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => invalidateList(),
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

  const saveReview = useCallback(
    async (form: import('@/types').ReviewInput, editingId?: number) => {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, data: form });
      } else {
        await createMutation.mutateAsync(form);
      }
    },
    [createMutation, updateMutation],
  );

  const removeReview = useCallback(
    async (id: number) => {
      await deleteMutation.mutateAsync(id);
    },
    [deleteMutation],
  );

  const toggleStatus = useCallback(
    async (review: CustomerReview) => {
      const next = review.status === 'published' ? 'draft' : 'published';
      await updateMutation.mutateAsync({ id: review.id, data: { status: next } });
    },
    [updateMutation],
  );

  return {
    reviews,
    total,
    totalPages,
    page,
    isLoading: query.isLoading,
    searchTerm,
    statusFilter,
    changeSearch,
    changeStatusFilter,
    changePage,
    saveReview,
    removeReview,
    toggleStatus,
    isSaving: createMutation.isPending || updateMutation.isPending,
  };
}
