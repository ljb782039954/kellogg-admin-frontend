import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
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
    data: pageDetail,
    isLoading: isDetailLoading,
    error,
  } = useQuery({
    queryKey: pageKeys.detail(pageId!),
    queryFn: () => getPageById(pageId!),
    enabled: !!pageId && !!indexEntry,
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
