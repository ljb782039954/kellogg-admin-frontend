import { useCallback, useEffect, useMemo, useState } from 'react';
import { useContent } from '@/core-adminApp/context/ContentContext';
import { checkPageExists } from '@/core-adminApp/lib/linkUtils';
import type { FooterContent, FooterLink, FooterLinkGroup, Translation } from '@/cms/types';
import { createFooterLink, createFooterLinkGroup, normalizeFooterContent } from './footerEditor';

export function useFooterEditor() {
  const { content, updateFooter } = useContent();
  const [localFooter, setLocalFooter] = useState<FooterContent>(() => normalizeFooterContent(content.footer));
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLocalFooter(normalizeFooterContent(content.footer));
  }, [content.footer]);

  const isLinkInvalid = useCallback((link: FooterLink) => {
    return link.pageDeleted || !checkPageExists(link.href, link.linkType, content.pages);
  }, [content.pages]);

  const hasDeletedPages = useMemo(() => {
    return localFooter.linkGroups.some((group) => group.links.some(isLinkInvalid));
  }, [isLinkInvalid, localFooter.linkGroups]);

  const showSaved = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      await updateFooter(localFooter);
      showSaved();
    } finally {
      setIsSaving(false);
    }
  };

  const updateNewsletterPlaceholder = (value: Translation) => {
    setLocalFooter((previous) => ({ ...previous, newsletterPlaceholder: value }));
  };

  const updateNewsletterButton = (value: Translation) => {
    setLocalFooter((previous) => ({ ...previous, newsletterButton: value }));
  };

  const updateLinkGroup = <K extends keyof FooterLinkGroup>(
    index: number,
    field: K,
    value: FooterLinkGroup[K]
  ) => {
    setLocalFooter((previous) => ({
      ...previous,
      linkGroups: previous.linkGroups.map((group, groupIndex) => (
        groupIndex === index ? { ...group, [field]: value } : group
      )),
    }));
  };

  const addLinkToGroup = (groupIndex: number) => {
    setLocalFooter((previous) => ({
      ...previous,
      linkGroups: previous.linkGroups.map((group, index) => (
        index === groupIndex
          ? { ...group, links: [...group.links, createFooterLink()] }
          : group
      )),
    }));
  };

  const updateLinkName = (groupIndex: number, linkIndex: number, value: Translation) => {
    setLocalFooter((previous) => ({
      ...previous,
      linkGroups: previous.linkGroups.map((group, currentGroupIndex) => (
        currentGroupIndex === groupIndex
          ? {
              ...group,
              links: group.links.map((link, currentLinkIndex) => (
                currentLinkIndex === linkIndex ? { ...link, name: value } : link
              )),
            }
          : group
      )),
    }));
  };

  const updateLinkData = (groupIndex: number, linkIndex: number, value: FooterLink) => {
    setLocalFooter((previous) => ({
      ...previous,
      linkGroups: previous.linkGroups.map((group, currentGroupIndex) => (
        currentGroupIndex === groupIndex
          ? {
              ...group,
              links: group.links.map((link, currentLinkIndex) => (
                currentLinkIndex === linkIndex ? { ...link, ...value } : link
              )),
            }
          : group
      )),
    }));
  };

  const removeLinkFromGroup = (groupIndex: number, linkIndex: number) => {
    setLocalFooter((previous) => ({
      ...previous,
      linkGroups: previous.linkGroups.map((group, currentGroupIndex) => (
        currentGroupIndex === groupIndex
          ? { ...group, links: group.links.filter((_, currentLinkIndex) => currentLinkIndex !== linkIndex) }
          : group
      )),
    }));
  };

  const addLinkGroup = () => {
    setLocalFooter((previous) => ({
      ...previous,
      linkGroups: [...previous.linkGroups, createFooterLinkGroup()],
    }));
  };

  const removeLinkGroup = (index: number) => {
    setLocalFooter((previous) => ({
      ...previous,
      linkGroups: previous.linkGroups.filter((_, groupIndex) => groupIndex !== index),
    }));
  };

  return {
    hasDeletedPages,
    isSaving,
    localFooter,
    saved,
    addLinkGroup,
    addLinkToGroup,
    handleSave,
    isLinkInvalid,
    removeLinkFromGroup,
    removeLinkGroup,
    updateLinkData,
    updateLinkGroup,
    updateLinkName,
    updateNewsletterButton,
    updateNewsletterPlaceholder,
  };
}
