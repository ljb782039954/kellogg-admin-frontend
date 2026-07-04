import { useEffect, useMemo } from 'react';
import { useContent } from '@/core-adminApp/context/ContentContext';
import type { LinkType, NavLink } from '@/cms/types';
import {
  getSelectedPageValue,
  isInternalLinkDeleted,
  mapPagesToLinkOptions,
  markLinkDeleted,
  updateExternalLink,
  updateInternalLink,
  updateLinkType,
} from './linkSelector';

interface UseLinkSelectorOptions {
  onChange: (value: NavLink) => void;
  value: NavLink;
}

export function useLinkSelector({
  onChange,
  value,
}: UseLinkSelectorOptions) {
  const { content } = useContent();
  const pages = useMemo(() => mapPagesToLinkOptions(content.pages), [content.pages]);
  const isPageDeleted = useMemo(
    () => isInternalLinkDeleted(value, pages),
    [pages, value]
  );
  const selectedPageValue = useMemo(
    () => getSelectedPageValue(value, pages),
    [pages, value]
  );

  useEffect(() => {
    if (isPageDeleted && !value.pageDeleted) {
      onChange(markLinkDeleted(value));
    }
  }, [isPageDeleted, onChange, value]);

  const handleTypeChange = (linkType: LinkType) => {
    onChange(updateLinkType(value, linkType));
  };

  const handlePageChange = (pageId: string) => {
    onChange(updateInternalLink(value, pageId, pages));
  };

  const handleUrlChange = (href: string) => {
    onChange(updateExternalLink(value, href));
  };

  return {
    isPageDeleted,
    pages,
    selectedPageValue,
    handlePageChange,
    handleTypeChange,
    handleUrlChange,
  };
}
