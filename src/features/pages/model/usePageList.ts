import { useCallback, useState } from 'react';
import { nanoid } from 'nanoid';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { CustomPage } from '@/types';
import { getPagesIndex, savePagesIndex, deletePageDetail } from '../api/pages.api';
import { pageKeys } from '../api/pages.keys';
import { sanitizePageIndex, createDefaultPage } from './pages.mapper';

export function usePageList() {
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: pages = [], isLoading } = useQuery({
    queryKey: pageKeys.list(),
    queryFn: getPagesIndex,
  });

  const invalidateList = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: pageKeys.list() });
  }, [queryClient]);

  const addPage = useCallback(async (
    title: { zh: string; en: string },
    path: string,
    duplicateSource?: CustomPage,
    navigate?: (path: string) => void,
  ) => {
    const pageId = `page_${nanoid(8)}`;
    const newPage = createDefaultPage(path, title, pageId);

    if (duplicateSource) {
      newPage.blocks = duplicateSource.blocks.map((b) => ({
        ...b,
        id: `block_${nanoid(8)}`,
      }));
      newPage.seo = duplicateSource.seo ? { ...duplicateSource.seo } : undefined;
    }

    const updated = [...pages, newPage as unknown as CustomPage];
    await savePagesIndex(sanitizePageIndex(updated));
    invalidateList();
    navigate?.(`/pages/${pageId}/edit`);
  }, [pages, invalidateList]);

  const updatePageMeta = useCallback(async (
    pageId: string,
    updates: { title?: { zh: string; en: string }; path?: string },
  ) => {
    const updated = pages.map((p) =>
      p.id === pageId ? { ...p, ...updates } : p,
    );
    await savePagesIndex(sanitizePageIndex(updated));
    invalidateList();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }, [pages, invalidateList]);

  const deletePage = useCallback(async (pageId: string) => {
    await deletePageDetail(pageId);
    const filtered = pages.filter((p) => p.id !== pageId);
    await savePagesIndex(sanitizePageIndex(filtered));
    invalidateList();
  }, [pages, invalidateList]);

  return {
    pages,
    isLoading,
    saved,
    error,
    setError,
    addPage,
    updatePageMeta,
    deletePage,
  };
}
