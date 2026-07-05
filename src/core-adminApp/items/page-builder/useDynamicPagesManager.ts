import { useCallback, useMemo, useState } from 'react';
import { useContent } from '@/core-adminApp/context/ContentContext';
import type { Translation } from '@/cms/types';
import type { CmsCustomPage } from '@/cms/types';
import {
  createDynamicPage,
  createDuplicateForm,
  filterPages,
  groupPagesByBuilderType,
  sanitizePagePathInput,
  validatePageForm,
} from './pageBuilderUtils';

interface PageBuilderNotifyPayload {
  title: string;
  description?: string;
  variant?: 'destructive';
}

interface UseDynamicPagesManagerOptions {
  notify?: (payload: PageBuilderNotifyPayload) => void;
  onNavigateToEdit: (pageId: string) => void;
}

export function useDynamicPagesManager({
  notify,
  onNavigateToEdit,
}: UseDynamicPagesManagerOptions) {
  const { content, addPage, deletePage, updatePage } = useContent();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deletePageId, setDeletePageId] = useState<string | null>(null);
  const [duplicateSourcePage, setDuplicateSourcePage] = useState<CmsCustomPage | null>(null);
  const [editPage, setEditPage] = useState<CmsCustomPage | null>(null);
  const [newPageTitle, setNewPageTitle] = useState<Translation>({ zh: '', en: '' });
  const [newPagePath, setNewPagePathState] = useState('');

  const setNewPagePath = useCallback((value: string) => {
    setNewPagePathState(sanitizePagePathInput(value));
  }, []);

  const resetPageForm = useCallback(() => {
    setNewPageTitle({ zh: '', en: '' });
    setNewPagePathState('');
    setDuplicateSourcePage(null);
    setEditPage(null);
  }, []);

  const openCreateDialog = useCallback(() => {
    resetPageForm();
    setIsCreateDialogOpen(true);
  }, [resetPageForm]);

  const closeCreateDialog = useCallback(() => {
    resetPageForm();
    setIsCreateDialogOpen(false);
  }, [resetPageForm]);

  const handleCreateDialogOpenChange = useCallback((open: boolean) => {
    if (!open) {
      resetPageForm();
    }
    setIsCreateDialogOpen(open);
  }, [resetPageForm]);

  const handleCreatePage = useCallback(async () => {
    const validationError = validatePageForm(content.pages, newPageTitle, newPagePath);
    if (validationError) {
      notify?.(validationError);
      return;
    }

    const newPage = createDynamicPage(newPageTitle, newPagePath, duplicateSourcePage);
    await addPage(newPage);

    resetPageForm();
    setIsCreateDialogOpen(false);

    notify?.({
      title: duplicateSourcePage ? '页面复制成功' : '页面创建成功',
      description: `已创建页面「${newPageTitle.zh}」`,
    });

    onNavigateToEdit(newPage.id);
  }, [addPage, content.pages, duplicateSourcePage, newPagePath, newPageTitle, notify, onNavigateToEdit, resetPageForm]);

  const handleUpdatePageSettings = useCallback(async () => {
    if (!editPage) return;

    const validationError = validatePageForm(content.pages, newPageTitle, newPagePath, editPage.id);
    if (validationError) {
      notify?.(validationError);
      return;
    }

    const updatedPage: CmsCustomPage = {
      ...editPage,
      path: `/${newPagePath.replace(/^\//, '')}`,
      title: {
        zh: newPageTitle.zh.trim(),
        en: newPageTitle.en.trim() || newPageTitle.zh.trim(),
      },
    };

    await updatePage(editPage.id, updatedPage);
    resetPageForm();
    setIsCreateDialogOpen(false);

    notify?.({
      title: '设置更新成功',
      description: `页面「${newPageTitle.zh}」设置已保存`,
    });
  }, [content.pages, editPage, newPagePath, newPageTitle, notify, resetPageForm, updatePage]);

  const handleOpenEditDialog = useCallback((page: CmsCustomPage) => {
    setEditPage(page);
    setNewPageTitle(page.title);
    setNewPagePathState(page.path.replace(/^\//, ''));
    setIsCreateDialogOpen(true);
  }, []);

  const handleDeletePage = useCallback(async () => {
    if (!deletePageId) return;

    const page = content.pages.find((currentPage) => currentPage.id === deletePageId);
    if (page?.isFixed) {
      notify?.({
        title: '无法删除',
        description: '系统固定页面不能被删除',
        variant: 'destructive',
      });
      setDeletePageId(null);
      return;
    }

    await deletePage(deletePageId);
    setDeletePageId(null);

    notify?.({
      title: '删除成功',
      description: '页面已删除',
    });
  }, [content.pages, deletePage, deletePageId, notify]);

  const handleEditPage = useCallback((pageId: string) => {
    onNavigateToEdit(pageId);
  }, [onNavigateToEdit]);

  const handleOpenDuplicateDialog = useCallback((page: CmsCustomPage) => {
    const duplicateForm = createDuplicateForm(page);
    setDuplicateSourcePage(page);
    setNewPageTitle(duplicateForm.title);
    setNewPagePathState(duplicateForm.path);
    setIsCreateDialogOpen(true);
  }, []);

  const filteredPages = useMemo(
    () => filterPages(content.pages, searchQuery),
    [content.pages, searchQuery]
  );

  const { fixedBlockPages, dynamicBlockPages, fixedLayoutPages } = useMemo(
    () => groupPagesByBuilderType(filteredPages),
    [filteredPages]
  );

  return {
    deletePageId,
    duplicateSourcePage,
    dynamicBlockPages,
    editPage,
    filteredPages,
    fixedBlockPages,
    fixedLayoutPages,
    isCreateDialogOpen,
    newPagePath,
    newPageTitle,
    searchQuery,
    closeCreateDialog,
    handleCreateDialogOpenChange,
    handleCreatePage,
    handleDeletePage,
    handleEditPage,
    handleOpenDuplicateDialog,
    handleOpenEditDialog,
    handleUpdatePageSettings,
    openCreateDialog,
    setDeletePageId,
    setDuplicateSourcePage,
    setEditPage,
    setIsCreateDialogOpen,
    setNewPagePath,
    setNewPageTitle,
    setSearchQuery,
  };
}
