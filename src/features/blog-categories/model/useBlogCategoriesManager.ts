import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  invalidateEntityLists,
  useEntityCollectionController,
} from '@/core/entities';
import type { BlogCategory } from '@/package/types';
import {
  getBlogCategories,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
} from '../api/blogCategories.api';
import { blogCategoryKeys } from '../api/blogCategories.keys';
import type { BlogCategoryFormValues } from './blogCategory.schema';
import { toBlogCategoryInput } from './blogCategory.mapper';
import { createDefaultBlogCategory } from './blogCategory.defaults';

export interface EditingRow {
  id: number | null;
  form: BlogCategoryFormValues;
}

export function useBlogCategoriesManager() {
  const queryClient = useQueryClient();
  const [editingRow, setEditingRow] = useState<EditingRow | null>(null);

  const {
    items: categories,
    isLoading,
    queryError: loadError,
    isCreating,
    isUpdating,
    deleteCommand,
    create,
    update,
    remove,
  } = useEntityCollectionController<
    BlogCategory,
    number,
    BlogCategoryFormValues,
    { id: number; form: BlogCategoryFormValues },
    number
  >({
    keys: blogCategoryKeys,
    operations: {
      load: getBlogCategories,
      create: (form) => createBlogCategory(toBlogCategoryInput(form)),
      update: ({ id, form }) =>
        updateBlogCategory(id, toBlogCategoryInput(form)),
      remove: deleteBlogCategory,
    },
  });

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.sort_order - b.sort_order),
    [categories],
  );

  const reorderMutation = useMutation({
    mutationFn: async ({ from, to }: { from: BlogCategory; to: BlogCategory }) => {
      await Promise.all([
        updateBlogCategory(from.id, { sort_order: to.sort_order }),
        updateBlogCategory(to.id, { sort_order: from.sort_order }),
      ]);
    },
    onSuccess: () => invalidateEntityLists(queryClient, blogCategoryKeys),
    onError: () => {
      toast.error('排序更新失败');
    },
  });

  const startNew = useCallback(() => {
    setEditingRow({ id: null, form: createDefaultBlogCategory() });
  }, []);

  const startEdit = useCallback((category: BlogCategory) => {
    setEditingRow({
      id: category.id,
      form: {
        id: category.id,
        name: { zh: category.name_zh, en: category.name_en },
        slug: category.slug,
        sortOrder: category.sort_order,
        articleCount: category.article_count ?? 0,
      },
    });
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingRow(null);
  }, []);

  const updateEditingForm = useCallback((updater: (form: BlogCategoryFormValues) => BlogCategoryFormValues) => {
    setEditingRow((prev) => {
      if (!prev) return prev;
      return { ...prev, form: updater(prev.form) };
    });
  }, []);

  const saveEditingRow = useCallback(async () => {
    if (!editingRow) return;
    const { name } = editingRow.form;
    if (!name.zh.trim() || !name.en.trim()) {
      toast.error('中文名称和英文名称均为必填项');
      return;
    }

    if (editingRow.id === null) {
      try {
        await create(editingRow.form);
        toast.success('分类创建成功');
        setEditingRow(null);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : '创建失败');
      }
    } else {
      try {
        await update({ id: editingRow.id, form: editingRow.form });
        toast.success('分类更新成功');
        setEditingRow(null);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : '更新失败');
      }
    }
  }, [create, editingRow, update]);

  const removeCategory = useCallback(
    async (category: BlogCategory) => {
      if ((category.article_count ?? 0) > 0) {
        toast.error(`无法删除：该分类下还有 ${category.article_count} 篇文章，请先移除文章再删除分类。`);
        return;
      }
      if (!window.confirm(`确定要删除分类「${category.name_zh} / ${category.name_en}」吗？`)) return;
      try {
        await remove(category.id);
        toast.success('分类已删除');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : '删除失败');
      }
    },
    [remove],
  );

  const reorder = useCallback(
    (category: BlogCategory, direction: 'up' | 'down') => {
      const idx = sortedCategories.findIndex((c) => c.id === category.id);
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= sortedCategories.length) return;
      reorderMutation.mutate({ from: category, to: sortedCategories[swapIdx] });
    },
    [sortedCategories, reorderMutation],
  );

  return {
    categories: sortedCategories,
    isLoading,
    loadError,
    editingRow,
    isSaving: isCreating || isUpdating,
    deletingId: deleteCommand ?? null,
    startNew,
    startEdit,
    cancelEdit,
    updateEditingForm,
    saveEditingRow,
    removeCategory,
    reorder,
  };
}
