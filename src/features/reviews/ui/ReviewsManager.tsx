import { useCallback, useState } from 'react';
import type { CustomerReview } from '@/types';
import { useReviewsList } from '../model/useReviewsList';
import { ReviewsListView } from './ReviewsListView';
import { ReviewFormDialog } from './ReviewFormDialog';

export function ReviewsManager() {
  const {
    reviews, total, totalPages, page, isLoading,
    searchTerm, statusFilter,
    changeSearch, changeStatusFilter, changePage,
    removeReview, toggleStatus,
  } = useReviewsList();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<CustomerReview | null>(null);

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

  const handleDialogSaved = useCallback(() => {
    setDialogOpen(false);
  }, []);

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
