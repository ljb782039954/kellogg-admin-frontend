import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CustomPage, HeaderContent, NavLink } from '@/types';
import { navigationKeys } from '../api/navigation.keys';
import { getHeader, updateHeader } from '../api/navigation.api';
import { getPagesIndex } from '../api/pagesIndex.api';
import { MAX_MAIN_NAV, toHeaderForm } from './navigation.mapper';

function hasDeletedPage(items: NavLink[], pages: CustomPage[]): boolean {
  return items.some((item) => {
    const mainDeleted =
      item.linkType === 'internal' &&
      item.href &&
      !pages.some((p) => p.id === item.href || p.path === item.href);
    const childDeleted = item.children?.some((child) =>
      child.linkType === 'internal' &&
      child.href &&
      !pages.some((p) => p.id === child.href || p.path === child.href),
    );
    return mainDeleted || childDeleted;
  });
}

export function useNavigationEditor() {
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<HeaderContent | null>(null);
  const [previewLang, setPreviewLang] = useState<'zh' | 'en'>('zh');

  const query = useQuery({
    queryKey: navigationKeys.header(),
    queryFn: getHeader,
  });

  const pagesQuery = useQuery({
    queryKey: navigationKeys.pages(),
    queryFn: getPagesIndex,
  });

  const rawHeader = query.data;
  const pages = useMemo(() => pagesQuery.data ?? [], [pagesQuery.data]);

  useEffect(() => {
    if (rawHeader) {
      setDraft((current) => current ?? toHeaderForm(rawHeader));
    }
  }, [rawHeader]);

  const header = draft ?? toHeaderForm(query.data);

  const mutation = useMutation({
    mutationFn: updateHeader,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: navigationKeys.header() });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const updateNavItems = useCallback((navItems: NavLink[]) => {
    setDraft((prev) => ({ ...(prev ?? toHeaderForm(query.data)), navItems }));
  }, [query.data]);

  const updateHeaderDraft = useCallback((patch: Partial<HeaderContent>) => {
    setDraft((prev) => ({ ...(prev ?? toHeaderForm(query.data)), ...patch }));
  }, [query.data]);

  const save = useCallback(async () => {
    setError(null);
    const headerToSave = {
      ...header,
      navItems: header.navItems.slice(0, MAX_MAIN_NAV),
    };
    await mutation.mutateAsync(headerToSave);
  }, [header, mutation]);

  const hasDeletedPages = useMemo(() => hasDeletedPage(header.navItems, pages), [header.navItems, pages]);

  return useMemo(
    () => ({
      header,
      isLoading: query.isLoading,
      isSaving: mutation.isPending,
      saved,
      error,
      hasDeletedPages,
      previewLang,
      setPreviewLang,
      updateNavItems,
      updateHeader: updateHeaderDraft,
      save,
    }),
    [
      header,
      query.isLoading,
      mutation.isPending,
      saved,
      error,
      hasDeletedPages,
      previewLang,
      updateNavItems,
      updateHeaderDraft,
      save,
    ],
  );
}
