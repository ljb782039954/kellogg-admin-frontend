import { useCallback, useEffect, useState } from 'react';
import { api } from '@/core/lib/api';
import type { CustomerReview } from '@/core/types';
import {
  getNextReviewStatus,
  type ReviewStatusFilter,
} from './reviewStatus';

interface CustomerReviewsNotifier {
  success?: (message: string) => void;
  error?: (message: string) => void;
}

interface CustomerReviewsMessages {
  loadFailure: string;
  deleteConfirm: (review: CustomerReview) => string;
  deleteSuccess: string;
  deleteFailure: string;
  publishSuccess: string;
  unpublishSuccess: string;
  statusToggleFailure: string;
}

export interface UseCustomerReviewsManagementOptions {
  confirmDelete?: (message: string) => boolean;
  messages?: Partial<CustomerReviewsMessages>;
  notify?: CustomerReviewsNotifier;
  pageSize?: number;
  searchDebounceMs?: number;
}

const DEFAULT_MESSAGES: CustomerReviewsMessages = {
  loadFailure: '无法加载评价列表',
  deleteConfirm: review => `确定要永久删除「${review.client_name}」的评价吗？`,
  deleteSuccess: '评价已删除',
  deleteFailure: '删除失败',
  publishSuccess: '已发布',
  unpublishSuccess: '已下架为草稿',
  statusToggleFailure: '状态切换失败',
};

export function useCustomerReviewsManagement(options: UseCustomerReviewsManagementOptions = {}) {
  const {
    confirmDelete,
    messages: customMessages,
    notify,
    pageSize = 15,
    searchDebounceMs = 400,
  } = options;
  const messages = { ...DEFAULT_MESSAGES, ...customMessages };

  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReviewStatusFilter>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<CustomerReview | null>(null);

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);

    try {
      const params: {
        page: number;
        pageSize: number;
        search?: string;
        status?: CustomerReview['status'];
      } = { page, pageSize };

      if (statusFilter !== 'all') params.status = statusFilter;
      if (searchTerm) params.search = searchTerm;

      const response = await api.getAdminReviews(params);
      setReviews((response.data || []) as CustomerReview[]);
      setTotalPages(response.pagination?.totalPages || 1);
      setTotal(response.pagination?.total || 0);
    } catch {
      notify?.error?.(messages.loadFailure);
    } finally {
      setIsLoading(false);
    }
  }, [messages.loadFailure, notify, page, pageSize, searchTerm, statusFilter]);

  useEffect(() => {
    const delay = searchTerm ? searchDebounceMs : 0;
    const timer = window.setTimeout(fetchReviews, delay);
    return () => window.clearTimeout(timer);
  }, [fetchReviews, searchDebounceMs, searchTerm]);

  const updateSearchTerm = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const updateStatusFilter = (status: ReviewStatusFilter) => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleDelete = async (review: CustomerReview) => {
    if (confirmDelete && !confirmDelete(messages.deleteConfirm(review))) return;

    try {
      await api.deleteReview(review.id);
      notify?.success?.(messages.deleteSuccess);
      await fetchReviews();
    } catch {
      notify?.error?.(messages.deleteFailure);
    }
  };

  const handleToggleStatus = async (review: CustomerReview) => {
    const nextStatus = getNextReviewStatus(review.status);

    try {
      await api.updateReview(review.id, { status: nextStatus });
      notify?.success?.(
        nextStatus === 'published' ? messages.publishSuccess : messages.unpublishSuccess
      );
      setReviews(previous => previous.map(current => (
        current.id === review.id ? { ...current, status: nextStatus } : current
      )));
    } catch {
      notify?.error?.(messages.statusToggleFailure);
    }
  };

  const openCreate = () => {
    setEditingReview(null);
    setDialogOpen(true);
  };

  const openEdit = (review: CustomerReview) => {
    setEditingReview(review);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  return {
    dialogOpen,
    editingReview,
    isLoading,
    page,
    reviews,
    searchTerm,
    statusFilter,
    total,
    totalPages,
    closeDialog,
    fetchReviews,
    handleDelete,
    handleToggleStatus,
    openCreate,
    openEdit,
    setPage,
    updateSearchTerm,
    updateStatusFilter,
  };
}
