import { useCallback, useEffect, useState } from 'react';
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

  // Initialize local state from query data
  useEffect(() => {
    if (pageId && indexPage) {
      const full = pageDetail ?? indexPage;
      setLocalPage({
        ...indexPage,
        blocks: full.blocks ?? [],
        seo: full.seo ?? indexPage.seo,
        content: full.content ?? indexPage.content,
      });
    }
  }, [pageId, indexPage, pageDetail]);

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
  }, [localPage]);

  const handleRemoveBlock = useCallback((blockId: string) => {
    if (!localPage) return;
    setLocalPage({
      ...localPage,
      blocks: localPage.blocks.filter((b) => b.id !== blockId),
    });
    if (activePanel === blockId) setActivePanel(null);
  }, [localPage, activePanel]);

  const handleToggleBlock = useCallback((blockId: string) => {
    if (!localPage) return;
    setLocalPage({
      ...localPage,
      blocks: localPage.blocks.map((b) =>
        b.id === blockId ? { ...b, isVisible: !b.isVisible } : b,
      ),
    });
  }, [localPage]);

  const handleMoveBlock = useCallback((blockId: string, direction: 'up' | 'down') => {
    if (!localPage) return;
    const idx = localPage.blocks.findIndex((b) => b.id === blockId);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= localPage.blocks.length) return;
    const blocks = [...localPage.blocks];
    [blocks[idx], blocks[targetIdx]] = [blocks[targetIdx], blocks[idx]];
    setLocalPage({ ...localPage, blocks });
  }, [localPage]);

  const handleUpdateBlockProps = useCallback((blockId: string, newContent: unknown) => {
    if (!localPage) return;
    setLocalPage({
      ...localPage,
      blocks: localPage.blocks.map((b) =>
        b.id === blockId ? { ...b, content: newContent } : b,
      ),
    });
  }, [localPage]);

  const handleUpdateMeta = useCallback((updates: { title?: { zh: string; en: string }; path?: string }) => {
    if (!localPage) return;
    setLocalPage({ ...localPage, ...updates });
  }, [localPage]);

  const handleUpdateSEO = useCallback((seo: CustomPage['seo']) => {
    if (!localPage) return;
    setLocalPage({ ...localPage, seo });
  }, [localPage]);

  return {
    localPage,
    isLoading,
    isSaving,
    saved,
    error,
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
