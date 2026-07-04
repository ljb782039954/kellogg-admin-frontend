import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '@/core-adminApp/lib/api';
import type { Blog } from '@/cms/types';
import {
  filterBlogsBySearch,
  getNextBlogPublishStatus,
  type BlogStatusFilter,
} from './blogManagementFilter';

interface BlogManagementNotifier {
  success?: (message: string) => void;
  error?: (message: string) => void;
}

interface BlogManagementMessages {
  loadFailure: string;
  deleteConfirm: (blog: Blog) => string;
  deleteSuccess: string;
  deleteFailure: string;
  publishSuccess: string;
  unpublishSuccess: string;
  statusToggleFailure: string;
}

export interface UseBlogManagementOptions {
  categoryAllValue?: string;
  confirmDelete?: (message: string) => boolean;
  messages?: Partial<BlogManagementMessages>;
  notify?: BlogManagementNotifier;
  pageSize?: number;
}

const DEFAULT_MESSAGES: BlogManagementMessages = {
  loadFailure: '无法加载博客列表',
  deleteConfirm: blog => `确定要永久删除「${blog.title_zh}」吗？此操作不可撤销。`,
  deleteSuccess: '文章已删除',
  deleteFailure: '删除失败，请重试',
  publishSuccess: '已发布',
  unpublishSuccess: '已下架为草稿',
  statusToggleFailure: '状态切换失败',
};

export function useBlogManagement(options: UseBlogManagementOptions = {}) {
  const {
    categoryAllValue = 'All',
    confirmDelete,
    messages: customMessages,
    notify,
    pageSize = 10,
  } = options;
  const messages = { ...DEFAULT_MESSAGES, ...customMessages };

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(categoryAllValue);
  const [statusFilter, setStatusFilter] = useState<BlogStatusFilter>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const filteredBlogs = useMemo(
    () => filterBlogsBySearch(blogs, searchTerm),
    [blogs, searchTerm]
  );

  const fetchBlogs = useCallback(async () => {
    setIsLoading(true);

    try {
      const params: {
        page: number;
        pageSize: number;
        status?: BlogStatusFilter;
        category?: string;
      } = { page, pageSize };

      if (statusFilter !== 'all') params.status = statusFilter;
      if (categoryFilter !== categoryAllValue) params.category = categoryFilter;

      const response = await api.getBlogs(params);
      setBlogs(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
      setTotal(response.pagination?.total || 0);
    } catch {
      notify?.error?.(messages.loadFailure);
    } finally {
      setIsLoading(false);
    }
  }, [categoryAllValue, categoryFilter, messages.loadFailure, notify, page, pageSize, statusFilter]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const selectCategoryFilter = (category: string) => {
    setCategoryFilter(category);
    setPage(1);
  };

  const selectStatusFilter = (status: BlogStatusFilter) => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleDelete = async (blog: Blog) => {
    if (confirmDelete && !confirmDelete(messages.deleteConfirm(blog))) return;

    try {
      await api.deleteBlog(blog.id);
      notify?.success?.(messages.deleteSuccess);
      await fetchBlogs();
    } catch {
      notify?.error?.(messages.deleteFailure);
    }
  };

  const handleToggleStatus = async (blog: Blog) => {
    const nextStatus = getNextBlogPublishStatus(blog.status);

    try {
      await api.updateBlog(blog.id, { status: nextStatus });
      notify?.success?.(
        nextStatus === 'published' ? messages.publishSuccess : messages.unpublishSuccess
      );
      setBlogs(previous => previous.map(current => (
        current.id === blog.id ? { ...current, status: nextStatus } : current
      )));
    } catch {
      notify?.error?.(messages.statusToggleFailure);
    }
  };

  return {
    blogs,
    categoryFilter,
    filteredBlogs,
    isLoading,
    page,
    pageSize,
    searchTerm,
    statusFilter,
    total,
    totalPages,
    fetchBlogs,
    handleDelete,
    handleToggleStatus,
    selectCategoryFilter,
    selectStatusFilter,
    setPage,
    setSearchTerm,
  };
}
