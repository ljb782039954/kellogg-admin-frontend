import { useCallback, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import { useEntityEditorController } from '@/core/entities';
import type { Blog, BlogInput } from '@/package/types';

export function useBlogEditor(id: number | undefined) {
  const navigate = useNavigate();
  const isEdit = id !== undefined && id > 0;

  const editor = useEntityEditorController<Blog, number, BlogInput>({
    id,
    enabled: isEdit,
    keys: blogKeys,
    operations: {
      load: getBlog,
      create: async (payload) => {
        const result = await createBlog(payload);
        return result.id;
      },
      update: async (savedId, payload) => {
        await updateBlog(savedId, payload);
        return savedId;
      },
    },
    onSaved: (savedId) => {
      toast.success(isEdit ? '文章已更新' : '文章已创建');
      navigate(`/blog/${savedId}/edit`);
    },
    onError: (error) => {
      toast.error(error.message || '保存失败，请重试');
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: blogCategoryKeys.lists(),
    queryFn: getBlogCategories,
    staleTime: 60_000,
  });

  const defaultValues = useMemo(() => {
    if (isEdit && editor.model) return fromBlogResponse(editor.model);
    return createDefaultBlog();
  }, [isEdit, editor.model]);

  const form = useForm<BlogFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(blogSchema) as any,
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [form, defaultValues]);

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
      await editor.save(toBlogInput(payload));
    },
    [form, editor],
  );

  return {
    form,
    isEdit,
    isFetching: editor.isLoading,
    fetchError: editor.fetchError,
    isSaving: editor.isSaving,
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
