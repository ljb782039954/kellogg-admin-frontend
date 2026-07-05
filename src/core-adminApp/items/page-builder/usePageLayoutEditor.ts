import { useCallback, useEffect, useMemo, useState } from 'react';
import { nanoid } from 'nanoid';
import { useContent } from '@/core-adminApp/context/ContentContext';
import type { CmsCustomPage, CmsPageBlock } from '@/cms/types';
import {
  createDefaultBlocks,
  ensurePageSeo,
  moveBlockByOffset,
  reorderBlocksById,
  updateBlockContent,
  toggleBlockVisibility,
} from './pageBuilderUtils';

interface PageBuilderNotifyPayload {
  title: string;
  description?: string;
  variant?: 'destructive';
}

interface UsePageLayoutEditorOptions {
  confirmLeave?: (message: string) => boolean;
  notify?: (payload: PageBuilderNotifyPayload) => void;
  onNavigateToPages: () => void;
  openPreview?: (path: string) => void;
  pageId?: string;
}

function clonePage<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function usePageLayoutEditor({
  confirmLeave = (message) => window.confirm(message),
  notify,
  onNavigateToPages,
  openPreview = (path) => window.open(`http://localhost:5173${path}?preview=true`, '_blank'),
  pageId,
}: UsePageLayoutEditorOptions) {
  const { findPage, updatePage } = useContent();
  const page = useMemo(() => findPage(pageId || ''), [findPage, pageId]);

  const [localPage, setLocalPage] = useState<CmsCustomPage | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (!page) return;

    if (page.type === 'fixed-layout') {
      notify?.({
        title: '该页面无需积木编辑',
        description: '该页面属于系统固定布局，已自动返回列表。',
        variant: 'destructive',
      });
      onNavigateToPages();
      return;
    }

    if (!localPage) {
      setLocalPage(clonePage(page));
    }
  }, [localPage, notify, onNavigateToPages, page]);

  const updateLocalPage = useCallback((updates: Partial<CmsCustomPage>) => {
    setLocalPage((previous) => previous ? { ...previous, ...updates } : null);
    setHasChanges(true);
  }, []);

  const handleSave = useCallback(async () => {
    if (!localPage || !pageId) return;

    await updatePage(pageId, ensurePageSeo(localPage));
    setHasChanges(false);

    notify?.({
      title: '保存成功',
      description: '页面更改已保存到服务器',
    });
  }, [localPage, notify, pageId, updatePage]);

  const handleReorderBlocks = useCallback((activeId: string, overId?: string | null) => {
    if (!localPage) return;

    updateLocalPage({
      blocks: reorderBlocksById(localPage.blocks, activeId, overId),
    });
  }, [localPage, updateLocalPage]);

  const handleAddBlock = useCallback((block: CmsPageBlock) => {
    if (!localPage) return;

    updateLocalPage({
      blocks: [...localPage.blocks, block],
    });
    setSelectedBlockId(block.id);
  }, [localPage, updateLocalPage]);

  const handleRemoveBlock = useCallback((blockId: string) => {
    if (!localPage) return;

    updateLocalPage({
      blocks: localPage.blocks.filter((block) => block.id !== blockId),
    });

    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
  }, [localPage, selectedBlockId, updateLocalPage]);

  const handleToggleBlock = useCallback((blockId: string) => {
    if (!localPage) return;

    updateLocalPage({
      blocks: toggleBlockVisibility(localPage.blocks, blockId),
    });
  }, [localPage, updateLocalPage]);

  const handleMoveBlockUp = useCallback((blockId: string) => {
    if (!localPage) return;

    updateLocalPage({
      blocks: moveBlockByOffset(localPage.blocks, blockId, -1),
    });
  }, [localPage, updateLocalPage]);

  const handleMoveBlockDown = useCallback((blockId: string) => {
    if (!localPage) return;

    updateLocalPage({
      blocks: moveBlockByOffset(localPage.blocks, blockId, 1),
    });
  }, [localPage, updateLocalPage]);

  const handleUpdateBlockProps = useCallback((blockId: string, content: unknown) => {
    if (!localPage) return;

    updateLocalPage({
      blocks: updateBlockContent(localPage.blocks, blockId, content),
    });
  }, [localPage, updateLocalPage]);

  const handleReset = useCallback(() => {
    if (!localPage) return;

    const defaultBlocks = createDefaultBlocks().map((block) => ({
      ...block,
      id: `block_${nanoid(8)}`,
    }));

    updateLocalPage({ blocks: defaultBlocks });
    setSelectedBlockId(null);
    setIsResetDialogOpen(false);

    notify?.({
      title: '已重置',
      description: '页面布局已恢复为默认积木块设置',
    });
  }, [localPage, notify, updateLocalPage]);

  const handlePreview = useCallback(() => {
    openPreview(localPage?.path || '/');
  }, [localPage, openPreview]);

  const handleBack = useCallback(() => {
    if (hasChanges && !confirmLeave('有未保存的更改，确定要离开吗？')) return;
    onNavigateToPages();
  }, [confirmLeave, hasChanges, onNavigateToPages]);

  const selectedBlock = useMemo(
    () => localPage?.blocks.find((block) => block.id === selectedBlockId),
    [localPage?.blocks, selectedBlockId]
  );

  return {
    hasChanges,
    isAddDialogOpen,
    isResetDialogOpen,
    localPage,
    selectedBlock,
    selectedBlockId,
    handleAddBlock,
    handleBack,
    handleMoveBlockDown,
    handleMoveBlockUp,
    handlePreview,
    handleRemoveBlock,
    handleReorderBlocks,
    handleReset,
    handleSave,
    handleToggleBlock,
    handleUpdateBlockProps,
    setIsAddDialogOpen,
    setIsResetDialogOpen,
    setSelectedBlockId,
    updateLocalPage,
  };
}
