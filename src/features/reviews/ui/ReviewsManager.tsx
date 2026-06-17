import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { CustomerReview } from '@/types';
import { ReviewFormDialog } from './ReviewFormDialog';
import { useReviewsManager } from '../model/useReviewsManager';
import { reviewKeys } from '../api/reviews.keys';
import { ReviewsListView } from './ReviewsListView';

export function ReviewsManager() {
  const queryClient = useQueryClient();
  const {
    reviews, total, totalPages, page, isLoading,
    searchTerm, statusFilter,
    changeSearch, changeStatusFilter, changePage,
    removeReview, toggleStatus,
  } = useReviewsManager();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<CustomerReview | null>(null);

  const handleDialogSaved = useCallback(() => {
    setDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
  }, [queryClient]);

  const openCreate = useCallback(() => {
    setEditingReview(null);
    setDialogOpen(true);
  }, []);

  const openEdit = useCallback((review: CustomerReview) => {
    setEditingReview(review);
    setDialogOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (review: CustomerReview) => {
      if (!confirm(`确定要永久删除「${review.client_name}」的评价吗？`)) return;
      await removeReview(review.id);
    },
    [removeReview],
  );

  return (
    <>
      <ReviewsListView
        reviews={reviews}
        total={total}
        totalPages={totalPages}
        page={page}
        isLoading={isLoading}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearchChange={changeSearch}
        onStatusFilterChange={changeStatusFilter}
        onPageChange={changePage}
        onCreate={openCreate}
        onEdit={openEdit}
        onDelete={handleDelete}
        onToggleStatus={toggleStatus}
      />
      {dialogOpen && (
        <ReviewFormDialog
          review={editingReview}
          onClose={() => setDialogOpen(false)}
          onSaved={handleDialogSaved}
        />
      )}
    </>
  );
}
