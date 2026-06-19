import { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { CustomPage, PageBlock } from '@/types';
import { getPageById, savePageDetail } from '../api/pages.api';
import { pageKeys } from '../api/pages.keys';
import { usePageList } from './usePageList';

export function usePageEditor(pageId: string | undefined) {
  const queryClient = useQueryClient();
  const { pages } = usePageList();

  const [localPage, setLocalPage] = useState<CustomPage | null>(null);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    data: pageDetail,
    isLoading,
  } = useQuery({
    queryKey: pageKeys.detail(pageId!),
    queryFn: () => getPageById(pageId!),
    enabled: !!pageId,
  });

  // Find page from index too (for metadata like title, path)
  const indexPage = pages.find((p) => p.id === pageId);

  // Track whether user has made edits (dirty state)
  const [isDirty, setIsDirty] = useState(false);
  const pageIdRef = useRef(pageId);

  // Initialize local state from query data — on pageId change, or when detail first arrives
  useEffect(() => {
    if (!pageId || !indexPage) return;
    const isNewPage = pageId !== pageIdRef.current;
    if (!isNewPage && isDirty) return;

    pageIdRef.current = pageId;
    setLocalPage({
      id: indexPage.id,
      path: indexPage.path,
      title: indexPage.title,
      isFixed: indexPage.isFixed,
      type: indexPage.type,
      content: pageDetail?.content ?? indexPage.content,
      blocks: pageDetail?.blocks ?? [],
      seo: pageDetail?.seo,
    });
    if (!isDirty) setIsDirty(false);
  }, [pageId, pageDetail, indexPage]);

  // Mark dirty on any block/meta/seo change
  const markDirty = useCallback(() => {
    setIsDirty(true);
  }, []);

  const isFixedLayout = localPage?.type === 'fixed-layout';

  const handleSave = useCallback(async () => {
    if (!localPage || !pageId) return;
    setIsSaving(true);
    setError(null);

    try {
      const finalPage: CustomPage = {
        ...localPage,
        seo: localPage.seo || { title: { zh: '', en: '' }, description: { zh: '', en: '' } },
      };

      await savePageDetail(pageId, finalPage);

      queryClient.setQueryData(pageKeys.detail(pageId), finalPage);
      queryClient.invalidateQueries({ queryKey: pageKeys.list() });

      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败');
    } finally {
      setIsSaving(false);
    }
  }, [localPage, pageId, queryClient]);

  // Block commands
  const handleAddBlock = useCallback((block: PageBlock) => {
    if (!localPage) return;
    setLocalPage({ ...localPage, blocks: [...localPage.blocks, block] });
    setActivePanel(block.id);
    markDirty();
  }, [localPage, markDirty]);

  const handleRemoveBlock = useCallback((blockId: string) => {
    if (!localPage) return;
    setLocalPage({
      ...localPage,
      blocks: localPage.blocks.filter((b) => b.id !== blockId),
    });
    if (activePanel === blockId) setActivePanel(null);
    markDirty();
  }, [localPage, activePanel, markDirty]);

  const handleToggleBlock = useCallback((blockId: string) => {
    if (!localPage) return;
    setLocalPage({
      ...localPage,
      blocks: localPage.blocks.map((b) =>
        b.id === blockId ? { ...b, isVisible: !b.isVisible } : b,
      ),
    });
    markDirty();
  }, [localPage, markDirty]);

  const handleMoveBlock = useCallback((blockId: string, direction: 'up' | 'down') => {
    if (!localPage) return;
    const idx = localPage.blocks.findIndex((b) => b.id === blockId);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= localPage.blocks.length) return;
    const blocks = [...localPage.blocks];
    [blocks[idx], blocks[targetIdx]] = [blocks[targetIdx], blocks[idx]];
    setLocalPage({ ...localPage, blocks });
    markDirty();
  }, [localPage, markDirty]);

  const handleUpdateBlockProps = useCallback((blockId: string, newContent: unknown) => {
    if (!localPage) return;
    setLocalPage({
      ...localPage,
      blocks: localPage.blocks.map((b) =>
        b.id === blockId ? { ...b, content: newContent } : b,
      ),
    });
    markDirty();
  }, [localPage, markDirty]);

  const handleUpdateMeta = useCallback((updates: { title?: { zh: string; en: string }; path?: string }) => {
    if (!localPage) return;
    setLocalPage({ ...localPage, ...updates });
    markDirty();
  }, [localPage, markDirty]);

  const handleUpdateSEO = useCallback((seo: CustomPage['seo']) => {
    if (!localPage) return;
    setLocalPage({ ...localPage, seo });
    markDirty();
  }, [localPage, markDirty]);

  return {
    localPage,
    isLoading,
    isSaving,
    saved,
    error,
    isDirty,
    activePanel,
    setActivePanel,
    isFixedLayout,
    handleSave,
    handleAddBlock,
    handleRemoveBlock,
    handleToggleBlock,
    handleMoveBlock,
    handleUpdateBlockProps,
    handleUpdateMeta,
    handleUpdateSEO,
    setError,
  };
}
