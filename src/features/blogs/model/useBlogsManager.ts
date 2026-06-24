import { useCallback, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  Blog,
  BlogInput,
  BlogsQuery,
  BlogStatusFilter,
  PaginatedBlogs,
} from '@/package/types';
import { getBlogs, deleteBlog, updateBlog } from '../api/blogs.api';
import { blogKeys } from '../api/blogs.keys';
import {
  updateEntityDetail,
  usePaginatedEntityListController,
} from '@/core/entities';

export type { BlogStatusFilter } from '@/package/types';

const PAGE_SIZE = 10;

interface BlogUpdateCommand {
  id: number;
  data: Partial<BlogInput>;
}

export function useBlogsManager() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<BlogStatusFilter>('all');
  const [page, setPage] = useState(1);

  const queryParams = useMemo(
    () => ({
      page,
      pageSize: PAGE_SIZE,
      status: statusFilter === 'all' ? undefined : statusFilter,
      category: categoryFilter === 'All' ? undefined : categoryFilter,
    }),
    [page, statusFilter, categoryFilter],
  );

  const listController = usePaginatedEntityListController<
    Blog,
    BlogsQuery,
    PaginatedBlogs,
    PaginatedBlogs['pagination'],
    BlogUpdateCommand,
    number
  >({
    keys: blogKeys,
    filters: queryParams,
    load: getBlogs,
    select: (response) => ({
      items: response.data,
      pagination: response.pagination,
    }),
    mutations: {
      update: {
        execute: ({ id, data }) => updateBlog(id, data),
        onSuccess: (_result, variables) => {
          updateEntityDetail<Blog, number>(
            queryClient,
            blogKeys,
            variables.id,
            (old) => old ? { ...old, ...variables.data } : old,
          );
        },
        onError: () => {
          toast.error('状态切换失败');
        },
      },
      remove: {
        execute: deleteBlog,
        onSuccess: () => {
          toast.success('文章已删除');
        },
        onError: (error) => {
          toast.error(error.message || '删除失败，请重试');
        },
      },
    },
  });

  const blogs = listController.items;
  const total = listController.pagination?.total ?? 0;
  const totalPages = listController.pagination?.totalPages ?? 1;

  const removeBlog = useCallback(
    async (blog: Blog) => {
      if (!window.confirm(`确定要永久删除「${blog.title_zh}」吗？此操作不可撤销。`)) return;
      await listController.remove(blog.id);
    },
    [listController],
  );

  const toggleStatus = useCallback(
    (blog: Blog) => {
      const nextStatus = blog.status === 'published' ? 'draft' : 'published';
      void listController.update({ id: blog.id, data: { status: nextStatus } });
      toast.success(nextStatus === 'published' ? '已发布' : '已下架为草稿');
    },
    [listController],
  );

  const setCategory = useCallback((value: string) => {
    setCategoryFilter(value);
    setPage(1);
  }, []);

  const setStatus = useCallback((value: BlogStatusFilter) => {
    setStatusFilter(value);
    setPage(1);
  }, []);

  const goToPage = useCallback((value: number) => {
    setPage((prev) => {
      const next = Math.max(1, Math.min(totalPages, value));
      return next === prev ? prev : next;
    });
  }, [totalPages]);

  const filteredBlogs = useMemo(() => {
    if (!searchTerm) return blogs;
    const q = searchTerm.toLowerCase();
    return blogs.filter(
      (b) =>
        b.title_zh.toLowerCase().includes(q) ||
        b.title_en.toLowerCase().includes(q) ||
        (b.category || '').toLowerCase().includes(q),
    );
  }, [blogs, searchTerm]);

  return {
    blogs: filteredBlogs,
    allBlogs: blogs,
    isLoading: listController.isLoading,
    listError: listController.error,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategory,
    statusFilter,
    setStatus,
    page,
    totalPages,
    total,
    goToPage,
    nextPage: () => goToPage(page + 1),
    prevPage: () => goToPage(page - 1),
    removeBlog,
    toggleStatus,
    isDeleting: listController.isRemoving,
    isUpdating: listController.isUpdating,
  };
}
