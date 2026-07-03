import { useCallback, useEffect, useState } from 'react';
import { api } from '@/core-adminApp/lib/api';
import type { BlogCategory } from '@/core-adminApp/types';
import { generateBlogCategorySlug, sanitizeBlogCategorySlug } from './blogCategorySlug';

export interface BlogCategoryEditingRow {
  id: number | null;
  name_zh: string;
  name_en: string;
  slug: string;
}

interface BlogCategoryManagerNotifier {
  success?: (message: string) => void;
  error?: (message: string) => void;
}

interface BlogCategoryManagerMessages {
  loadFailure: string;
  requiredFields: string;
  createSuccess: string;
  updateSuccess: string;
  createFailure: string;
  updateFailure: string;
  deleteBlocked: (category: BlogCategory) => string;
  deleteConfirm: (category: BlogCategory) => string;
  deleteSuccess: string;
  deleteFailure: string;
  reorderFailure: string;
}

export interface UseBlogCategoryManagerOptions {
  notify?: BlogCategoryManagerNotifier;
  confirmDelete?: (message: string) => boolean;
  messages?: Partial<BlogCategoryManagerMessages>;
}

const DEFAULT_MESSAGES: BlogCategoryManagerMessages = {
  loadFailure: '无法加载分类列表',
  requiredFields: '中文名称和英文名称均为必填项',
  createSuccess: '分类创建成功',
  updateSuccess: '分类更新成功',
  createFailure: '创建失败',
  updateFailure: '更新失败',
  deleteBlocked: category => `无法删除：该分类下还有 ${category.article_count} 篇文章，请先移除文章再删除分类。`,
  deleteConfirm: category => `确定要删除分类「${category.name_zh} / ${category.name_en}」吗？`,
  deleteSuccess: '分类已删除',
  deleteFailure: '删除失败',
  reorderFailure: '排序更新失败',
};

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function createEditingRow(category: BlogCategory): BlogCategoryEditingRow {
  return {
    id: category.id,
    name_zh: category.name_zh,
    name_en: category.name_en,
    slug: category.slug,
  };
}

function createNewEditingRow(): BlogCategoryEditingRow {
  return {
    id: null,
    name_zh: '',
    name_en: '',
    slug: '',
  };
}

export function useBlogCategoryManager(options: UseBlogCategoryManagerOptions = {}) {
  const {
    confirmDelete,
    messages: customMessages,
    notify,
  } = options;
  const messages = { ...DEFAULT_MESSAGES, ...customMessages };

  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingRow, setEditingRow] = useState<BlogCategoryEditingRow | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.getBlogCategories();
      setCategories(data);
    } catch {
      notify?.error?.(messages.loadFailure);
    } finally {
      setIsLoading(false);
    }
  }, [messages.loadFailure, notify]);

  useEffect(() => {
    load();
  }, [load]);

  const startEdit = (category: BlogCategory) => {
    setEditingRow(createEditingRow(category));
  };

  const startNew = () => {
    setEditingRow(createNewEditingRow());
  };

  const cancelEdit = () => {
    setEditingRow(null);
  };

  const updateEditingRow = (patch: Partial<BlogCategoryEditingRow>) => {
    setEditingRow(current => current ? { ...current, ...patch } : current);
  };

  const updateEditingEnglishName = (name_en: string) => {
    setEditingRow(current => current ? {
      ...current,
      name_en,
      slug: current.slug || generateBlogCategorySlug(name_en),
    } : current);
  };

  const updateEditingSlug = (slug: string) => {
    updateEditingRow({ slug: sanitizeBlogCategorySlug(slug) });
  };

  const handleSave = async () => {
    if (!editingRow) return;

    if (!editingRow.name_zh.trim() || !editingRow.name_en.trim()) {
      notify?.error?.(messages.requiredFields);
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        name_zh: editingRow.name_zh.trim(),
        name_en: editingRow.name_en.trim(),
        slug: editingRow.slug.trim() || undefined,
      };

      if (editingRow.id === null) {
        await api.createBlogCategory(payload);
        notify?.success?.(messages.createSuccess);
      } else {
        await api.updateBlogCategory(editingRow.id, payload);
        notify?.success?.(messages.updateSuccess);
      }

      setEditingRow(null);
      await load();
    } catch (error) {
      notify?.error?.(
        getErrorMessage(error, editingRow.id ? messages.updateFailure : messages.createFailure)
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (category: BlogCategory) => {
    if ((category.article_count ?? 0) > 0) {
      notify?.error?.(messages.deleteBlocked(category));
      return;
    }

    if (confirmDelete && !confirmDelete(messages.deleteConfirm(category))) return;

    setDeletingId(category.id);

    try {
      await api.deleteBlogCategory(category.id);
      notify?.success?.(messages.deleteSuccess);
      await load();
    } catch (error) {
      notify?.error?.(getErrorMessage(error, messages.deleteFailure));
    } finally {
      setDeletingId(null);
    }
  };

  const handleReorder = async (category: BlogCategory, direction: 'up' | 'down') => {
    const index = categories.findIndex(current => current.id === category.id);
    const swapIndex = direction === 'up' ? index - 1 : index + 1;

    if (swapIndex < 0 || swapIndex >= categories.length) return;

    const swapCategory = categories[swapIndex];

    try {
      await Promise.all([
        api.updateBlogCategory(category.id, { sort_order: swapCategory.sort_order }),
        api.updateBlogCategory(swapCategory.id, { sort_order: category.sort_order }),
      ]);
      await load();
    } catch {
      notify?.error?.(messages.reorderFailure);
    }
  };

  return {
    categories,
    deletingId,
    editingRow,
    isLoading,
    isSaving,
    cancelEdit,
    handleDelete,
    handleReorder,
    handleSave,
    setEditingRow,
    startEdit,
    startNew,
    updateEditingEnglishName,
    updateEditingRow,
    updateEditingSlug,
  };
}
