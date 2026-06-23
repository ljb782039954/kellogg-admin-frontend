import { useCallback, useState } from 'react';
import { nanoid } from 'nanoid';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CustomPage } from '@/types';
import type { PageIndexEntry } from '@/package/types';
import { getPagesIndex, savePagesIndex, savePageDetail, deletePageDetail } from '../api/pages.api';
import { pageKeys } from '../api/pages.keys';
import { sanitizePageIndex, createDefaultPage } from './pages.mapper';

export function usePageList() {
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);

  const { data: pages = [], isLoading } = useQuery({
    queryKey: pageKeys.list(),
    queryFn: getPagesIndex,
  });

  const showSaved = useCallback(() => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }, []);

  const createMutation = useMutation({
    mutationFn: async ({
      title,
      path,
      duplicateSource,
    }: {
      title: { zh: string; en: string };
      path: string;
      duplicateSource?: CustomPage | PageIndexEntry;
    }) => {
      const pageId = `page_${nanoid(8)}`;
      const newPage = createDefaultPage(path, title, pageId);

      if (duplicateSource && 'blocks' in duplicateSource && duplicateSource.blocks) {
        newPage.blocks = duplicateSource.blocks.map((b) => ({
          ...b,
          id: `block_${nanoid(8)}`,
        }));
        if ('seo' in duplicateSource && duplicateSource.seo) {
          newPage.seo = { ...duplicateSource.seo };
        }
      }

      await savePageDetail(pageId, newPage);
      const index = sanitizePageIndex([...pages, newPage]);
      await savePagesIndex(index as unknown as Record<string, unknown>[]);

      return { pageId, newPage };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pageKeys.lists() });
    },
  });

  const updateMetaMutation = useMutation({
    mutationFn: async ({
      pageId,
      updates,
    }: {
      pageId: string;
      updates: { title?: { zh: string; en: string }; path?: string };
    }) => {
      const updated = pages.map((p) =>
        p.id === pageId ? { ...p, ...updates } : p,
      );
      await savePagesIndex(sanitizePageIndex(updated) as unknown as Record<string, unknown>[]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pageKeys.lists() });
      showSaved();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (pageId: string) => {
      await deletePageDetail(pageId);
      const filtered = pages.filter((p) => p.id !== pageId);
      await savePagesIndex(sanitizePageIndex(filtered) as unknown as Record<string, unknown>[]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pageKeys.lists() });
    },
  });

  const addPage = useCallback(
    async (
      title: { zh: string; en: string },
      path: string,
      duplicateSource?: CustomPage | PageIndexEntry,
      navigate?: (path: string) => void,
    ) => {
      const result = await createMutation.mutateAsync({ title, path, duplicateSource });
      navigate?.(`/pages/${result.pageId}/edit`);
    },
    [createMutation],
  );

  const updatePageMeta = useCallback(
    async (pageId: string, updates: { title?: { zh: string; en: string }; path?: string }) => {
      await updateMetaMutation.mutateAsync({ pageId, updates });
    },
    [updateMetaMutation],
  );

  const deletePage = useCallback(
    async (pageId: string) => {
      await deleteMutation.mutateAsync(pageId);
    },
    [deleteMutation],
  );

  const error = (createMutation.error ?? deleteMutation.error ?? updateMetaMutation.error)?.message ?? null;

  return {
    pages: pages as unknown as PageIndexEntry[],
    isLoading,
    saved,
    error,
    addPage,
    updatePageMeta,
    deletePage,
  };
}
