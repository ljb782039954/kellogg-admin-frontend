import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CustomPage, HeaderContent, NavLink } from '@/types';
import { navigationKeys } from '../api/navigation.keys';
import { getHeader, updateHeader } from '../api/navigation.api';
import { getPagesIndex } from '../api/pagesIndex.api';
import { toHeaderForm } from './navigation.mapper';
import {
  addNavItem,
  removeNavItem,
  updateNavItemName,
  addSubItem,
  removeSubItem,
  updateSubItemName,
  updateSubItemLink,
  trimToMaxNavItems,
} from './navigation.commands';

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

  const header = draft ?? toHeaderForm(query.data);
  const pages = useMemo(() => pagesQuery.data ?? [], [pagesQuery.data]);

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

  const updateNavItems = useCallback((newItems: NavLink[]) => {
    setDraft((prev) => ({
      ...(prev ?? toHeaderForm(query.data)),
      navItems: newItems,
    }));
  }, [query.data]);

  const updateHeaderDraft = useCallback((patch: Partial<HeaderContent>) => {
    setDraft((prev) => ({ ...(prev ?? toHeaderForm(query.data)), ...patch }));
  }, [query.data]);

  // View-facing commands — delegate to pure functions then update draft
  const handleAddItem = useCallback(() => {
    updateNavItems(addNavItem(header.navItems));
  }, [header.navItems, updateNavItems]);

  const handleRemoveItem = useCallback((index: number) => {
    updateNavItems(removeNavItem(header.navItems, index));
  }, [header.navItems, updateNavItems]);

  const handleUpdateItemName = useCallback(
    (index: number, name: { zh: string; en: string }) => {
      updateNavItems(updateNavItemName(header.navItems, index, name));
    },
    [header.navItems, updateNavItems],
  );

  const handleAddSubItem = useCallback((parentIndex: number) => {
    updateNavItems(addSubItem(header.navItems, parentIndex));
  }, [header.navItems, updateNavItems]);

  const handleRemoveSubItem = useCallback(
    (parentIndex: number, subIndex: number) => {
      updateNavItems(removeSubItem(header.navItems, parentIndex, subIndex));
    },
    [header.navItems, updateNavItems],
  );

  const handleUpdateSubItemName = useCallback(
    (parentIndex: number, subIndex: number, name: { zh: string; en: string }) => {
      updateNavItems(updateSubItemName(header.navItems, parentIndex, subIndex, name));
    },
    [header.navItems, updateNavItems],
  );

  const handleUpdateSubItemLink = useCallback(
    (parentIndex: number, subIndex: number, patch: Partial<NavLink>) => {
      updateNavItems(updateSubItemLink(header.navItems, parentIndex, subIndex, patch));
    },
    [header.navItems, updateNavItems],
  );

  const save = useCallback(async () => {
    setError(null);
    await mutation.mutateAsync(trimToMaxNavItems(header));
  }, [header, mutation]);

  const hasDeletedPages = useMemo(
    () => hasDeletedPage(header.navItems, pages),
    [header.navItems, pages],
  );

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
      handleAddItem,
      handleRemoveItem,
      handleUpdateItemName,
      handleAddSubItem,
      handleRemoveSubItem,
      handleUpdateSubItemName,
      handleUpdateSubItemLink,
      updateHeader: updateHeaderDraft,
      save,
    }),
    [
      header, query.isLoading, mutation.isPending, saved, error,
      hasDeletedPages, previewLang,
      handleAddItem, handleRemoveItem, handleUpdateItemName,
      handleAddSubItem, handleRemoveSubItem,
      handleUpdateSubItemName, handleUpdateSubItemLink,
      updateHeaderDraft, save,
    ],
  );
}
