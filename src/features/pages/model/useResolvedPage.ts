import { useMemo } from 'react';
import { useEntityDetailController } from '@/core/entities';
import type { CustomPage } from '@/types';
import { getPageById } from '../api/pages.api';
import { pageKeys } from '../api/pages.keys';
import { usePageList } from './usePageList';

export function useResolvedPage(pageId: string | undefined): {
  page: CustomPage | undefined;
  isLoading: boolean;
  error: Error | null;
} {
  const { pages, isLoading: isIndexLoading } = usePageList();
  const indexEntry = pages.find((p) => p.id === pageId);

  const {
    model: pageDetail,
    isLoading: isDetailLoading,
    error,
  } = useEntityDetailController({
    id: pageId,
    enabled: !!pageId && !!indexEntry,
    keys: pageKeys,
    load: getPageById,
  });

  const isLoading = isIndexLoading || (!!pageId && isDetailLoading);

  const page = useMemo(() => {
    if (!indexEntry) return undefined;
    return {
      id: indexEntry.id,
      path: indexEntry.path,
      title: indexEntry.title,
      isFixed: indexEntry.isFixed,
      type: indexEntry.type,
      content: pageDetail?.content ?? indexEntry.content,
      blocks: pageDetail?.blocks ?? [],
      seo: pageDetail?.seo,
    } satisfies CustomPage;
  }, [indexEntry, pageDetail]);

  return { page, isLoading, error };
}
