import { useEffect, useMemo, useState } from 'react';
import { useContent } from '@/core-adminApp/context/ContentContext';
import type { HeaderContent, NavLink } from '@/cms/types';
import {
  hasInvalidHeaderLinks,
  normalizeHeaderContent,
  prepareHeaderForSave,
} from './headerEditor';

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function useHeaderEditor() {
  const { content, updateHeader, isLoading: contextLoading } = useContent();
  const [localHeader, setLocalHeader] = useState<HeaderContent>(() => normalizeHeaderContent(content.header));
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLocalHeader(normalizeHeaderContent(content.header));
  }, [content.header]);

  const hasDeletedPages = useMemo(
    () => hasInvalidHeaderLinks(localHeader, content.pages),
    [content.pages, localHeader]
  );

  const showSaved = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  const updateNavItems = (navItems: NavLink[]) => {
    setLocalHeader((previous) => ({
      ...previous,
      navItems,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      await updateHeader(prepareHeaderForSave(localHeader));
      showSaved();
    } catch (err) {
      setError(getErrorMessage(err, '保存失败'));
    } finally {
      setIsSaving(false);
    }
  };

  return {
    contextLoading,
    error,
    hasDeletedPages,
    isSaving,
    localHeader,
    saved,
    handleSave,
    setError,
    updateNavItems,
  };
}
