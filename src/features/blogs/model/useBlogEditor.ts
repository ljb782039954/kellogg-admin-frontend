import { useCallback, useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getBlogCategories, blogCategoryKeys } from '@/features/blog-categories';
import { getBlog, createBlog, updateBlog } from '../api/blogs.api';
import { blogKeys } from '../api/blogs.keys';
import { blogSchema, type BlogFormValues } from './blog.schema';
import { createDefaultBlog } from './blog.defaults';
import { fromBlogResponse, toBlogInput } from './blog.mapper';

export function useBlogEditor(id: number | undefined) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = id !== undefined && id > 0;

  const {
    data: blog,
    isLoading: isFetching,
    error: fetchError,
  } = useQuery({
    queryKey: blogKeys.detail(id ?? 0),
    queryFn: () => getBlog(id!),
    enabled: isEdit,
  });

  const { data: categories = [] } = useQuery({
    queryKey: blogCategoryKeys.lists(),
    queryFn: getBlogCategories,
    staleTime: 60_000,
  });

  const defaultValues = useMemo(() => {
    if (isEdit && blog) return fromBlogResponse(blog);
    return createDefaultBlog();
  }, [isEdit, blog]);

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [form, defaultValues]);

  const saveMutation = useMutation({
    mutationFn: async (values: BlogFormValues) => {
      const payload = toBlogInput(values);
      if (isEdit && id) {
        await updateBlog(id, payload);
        return id;
      }
      const result = await createBlog(payload);
      return result.id;
    },
    onSuccess: (savedId) => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
      toast.success(isEdit ? '文章已更新' : '文章已创建');
      navigate(`/blog/${savedId}/edit`);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : '保存失败，请重试');
    },
  });

  const autoGenerateSlug = useCallback(() => {
    const titleEn = form.getValues('title.en');
    if (!titleEn) return;
    form.setValue('slug', generateSlug(titleEn));
  }, [form]);

  const onTitleEnChange = useCallback(
    (value: string) => {
      form.setValue('title.en', value);
      if (!isEdit && !form.getValues('slug')) {
        form.setValue('slug', generateSlug(value));
      }
    },
    [form, isEdit],
  );

  const save = useCallback(
    async (targetStatus: 'draft' | 'published') => {
      const values = form.getValues();
      if (!values.slug || !values.title.zh || !values.title.en) {
        toast.error('请填写必要字段：Slug、中文标题、英文标题');
        return;
      }
      const payload = { ...values, status: targetStatus };
      if (!payload.publishDate) {
        payload.publishDate = new Date().toISOString().split('T')[0];
      }
      await saveMutation.mutateAsync(payload);
    },
    [form, saveMutation],
  );

  return {
    form,
    isEdit,
    isFetching,
    fetchError,
    isSaving: saveMutation.isPending,
    categories,
    onTitleEnChange,
    autoGenerateSlug,
    save,
  };
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 80);
}
