import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CustomPage, FooterContent, FooterLink, FooterLinkGroup } from '@/types';
import { footerKeys } from '../api/footer.keys';
import { getFooter, updateFooter } from '../api/footer.api';
import { getPagesIndex, navigationKeys } from '@/features/navigation';
import { toFooterForm, checkPageExists, createEmptyFooterLink, createEmptyFooterGroup } from './footer.mapper';

function hasDeletedPage(footer: FooterContent, pages: CustomPage[]): boolean {
  return footer.linkGroups.some((group) =>
    group.links.some(
      (link) =>
        link.linkType === 'internal' &&
        link.href &&
        !checkPageExists(link.href, link.linkType, pages),
    ),
  );
}

export function useFooterEditor() {
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<FooterContent | null>(null);
  const [previewLang, setPreviewLang] = useState<'zh' | 'en'>('zh');

  const query = useQuery({
    queryKey: footerKeys.detail(),
    queryFn: getFooter,
  });

  const pagesQuery = useQuery({
    queryKey: navigationKeys.pages(),
    queryFn: getPagesIndex,
  });

  const footer = draft ?? toFooterForm(query.data);
  const pages = useMemo(() => pagesQuery.data ?? [], [pagesQuery.data]);

  const mutation = useMutation({
    mutationFn: updateFooter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: footerKeys.detail() });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const updateFooterDraft = useCallback(
    (patch: Partial<FooterContent>) => {
      setDraft((prev) => ({ ...(prev ?? toFooterForm(query.data)), ...patch }));
    },
    [query.data],
  );

  const updateLinkGroups = useCallback(
    (linkGroups: FooterLinkGroup[]) => {
      setDraft((prev) => ({ ...(prev ?? toFooterForm(query.data)), linkGroups }));
    },
    [query.data],
  );

  const addLinkGroup = useCallback(() => {
    updateFooterDraft({ linkGroups: [...footer.linkGroups, createEmptyFooterGroup()] });
  }, [footer.linkGroups, updateFooterDraft]);

  const removeLinkGroup = useCallback(
    (index: number) => {
      updateFooterDraft({
        linkGroups: footer.linkGroups.filter((_, i) => i !== index),
      });
    },
    [footer.linkGroups, updateFooterDraft],
  );

  const updateLinkGroup = useCallback(
    (index: number, group: FooterLinkGroup) => {
      const next = [...footer.linkGroups];
      next[index] = group;
      updateFooterDraft({ linkGroups: next });
    },
    [footer.linkGroups, updateFooterDraft],
  );

  const addLinkToGroup = useCallback(
    (groupIndex: number) => {
      const next = [...footer.linkGroups];
      next[groupIndex] = {
        ...next[groupIndex],
        links: [...next[groupIndex].links, createEmptyFooterLink()],
      };
      updateFooterDraft({ linkGroups: next });
    },
    [footer.linkGroups, updateFooterDraft],
  );

  const removeLinkFromGroup = useCallback(
    (groupIndex: number, linkIndex: number) => {
      const next = [...footer.linkGroups];
      next[groupIndex] = {
        ...next[groupIndex],
        links: next[groupIndex].links.filter((_, i) => i !== linkIndex),
      };
      updateFooterDraft({ linkGroups: next });
    },
    [footer.linkGroups, updateFooterDraft],
  );

  const updateLink = useCallback(
    (groupIndex: number, linkIndex: number, link: FooterLink) => {
      const next = [...footer.linkGroups];
      next[groupIndex] = {
        ...next[groupIndex],
        links: next[groupIndex].links.map((l, i) => (i === linkIndex ? link : l)),
      };
      updateFooterDraft({ linkGroups: next });
    },
    [footer.linkGroups, updateFooterDraft],
  );

  const save = useCallback(async () => {
    setError(null);
    await mutation.mutateAsync(footer);
  }, [footer, mutation]);

  const hasDeletedPages = useMemo(() => hasDeletedPage(footer, pages), [footer, pages]);

  return useMemo(
    () => ({
      footer,
      isLoading: query.isLoading,
      isSaving: mutation.isPending,
      saved,
      error,
      hasDeletedPages,
      previewLang,
      setPreviewLang,
      updateFooter: updateFooterDraft,
      updateLinkGroups,
      addLinkGroup,
      removeLinkGroup,
      updateLinkGroup,
      addLinkToGroup,
      removeLinkFromGroup,
      updateLink,
      save,
    }),
    [
      footer,
      query.isLoading,
      mutation.isPending,
      saved,
      error,
      hasDeletedPages,
      previewLang,
      updateFooterDraft,
      updateLinkGroups,
      addLinkGroup,
      removeLinkGroup,
      updateLinkGroup,
      addLinkToGroup,
      removeLinkFromGroup,
      updateLink,
      save,
    ],
  );
}
