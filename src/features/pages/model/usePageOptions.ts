import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPagesIndex } from '../api/pages.api';
import { pageKeys } from '../api/pages.keys';
import type { Translation } from '@/types';

export interface PageOption {
  pageId: string;
  path: string;
  title: Translation;
  isFixed: boolean;
}

export function usePageOptions(): {
  pages: PageOption[];
  isLoading: boolean;
  error: Error | null;
} {
  const query = useQuery({
    queryKey: pageKeys.list(),
    queryFn: getPagesIndex,
  });

  const pages = useMemo<PageOption[]>(
    () =>
      (query.data ?? []).map((p) => ({
        pageId: p.id,
        path: p.path,
        title: p.title,
        isFixed: p.isFixed,
      })),
    [query.data],
  );

  return { pages, isLoading: query.isLoading, error: query.error };
}
