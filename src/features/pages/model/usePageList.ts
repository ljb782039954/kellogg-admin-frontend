import { useCallback, useState } from 'react';
import { nanoid } from 'nanoid';
import { useQueryClient } from '@tanstack/react-query';
import { useEntityCollectionController } from '@/core/entities';
import type { CustomPage } from '@/types';
import type { PageIndexEntry } from '@/package/types';
import {
  deletePageDetail,
  getPagesIndex,
  savePageDetail,
  savePagesIndex,
} from '../api/pages.api';
import { pageKeys } from '../api/pages.keys';
import { sanitizePageIndex, createDefaultPage } from './pages.mapper';

interface CreatePageCommand {
  pageId: string;
  title: { zh: string; en: string };
  path: string;
  duplicateSource?: CustomPage | PageIndexEntry;
}

interface UpdatePageMetaCommand {
  pageId: string;
  updates: { title?: { zh: string; en: string }; path?: string };
}

export function usePageList() {
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);

  const showSaved = useCallback(() => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }, []);

  const {
    items: pages,
    isLoading,
    error,
    create,
    update,
    remove,
  } = useEntityCollectionController<
    CustomPage,
    string,
    CreatePageCommand,
    UpdatePageMetaCommand,
    string
  >({
    keys: pageKeys,
    operations: {
      load: getPagesIndex,
      create: async ({ pageId, title, path, duplicateSource }) => {
        const newPage = createDefaultPage(path, title, pageId);

        if (
          duplicateSource &&
          'blocks' in duplicateSource &&
          duplicateSource.blocks
        ) {
          newPage.blocks = duplicateSource.blocks.map((block) => ({
            ...block,
            id: `block_${nanoid(8)}`,
          }));
          if ('seo' in duplicateSource && duplicateSource.seo) {
            newPage.seo = { ...duplicateSource.seo };
          }
        }

        await savePageDetail(pageId, newPage);
        const currentPages =
          queryClient.getQueryData<CustomPage[]>(pageKeys.list()) ?? [];
        const index = sanitizePageIndex([...currentPages, newPage]);
        await savePagesIndex(index as unknown as Record<string, unknown>[]);
      },
      update: async ({ pageId, updates }) => {
        const currentPages =
          queryClient.getQueryData<CustomPage[]>(pageKeys.list()) ?? [];
        const updated = currentPages.map((page) =>
          page.id === pageId ? { ...page, ...updates } : page,
        );
        await savePagesIndex(
          sanitizePageIndex(updated) as unknown as Record<string, unknown>[],
        );
      },
      remove: async (pageId) => {
        await deletePageDetail(pageId);
        const currentPages =
          queryClient.getQueryData<CustomPage[]>(pageKeys.list()) ?? [];
        const filtered = currentPages.filter((page) => page.id !== pageId);
        await savePagesIndex(
          sanitizePageIndex(filtered) as unknown as Record<string, unknown>[],
        );
      },
    },
  });

  const addPage = useCallback(
    async (
      title: { zh: string; en: string },
      path: string,
      duplicateSource?: CustomPage | PageIndexEntry,
      navigate?: (path: string) => void,
    ) => {
      const pageId = `page_${nanoid(8)}`;
      await create({ pageId, title, path, duplicateSource });
      navigate?.(`/pages/${pageId}/edit`);
    },
    [create],
  );

  const updatePageMeta = useCallback(
    async (
      pageId: string,
      updates: { title?: { zh: string; en: string }; path?: string },
    ) => {
      await update({ pageId, updates });
      showSaved();
    },
    [showSaved, update],
  );

  const deletePage = useCallback(
    async (pageId: string) => {
      await remove(pageId);
    },
    [remove],
  );

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
