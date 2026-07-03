import type { LinkType, NavLink, Translation } from '@/core-adminApp/types';
import type { CustomPage } from '@/site-package/kellogg/types/blocks';

export interface LinkPageOption {
  pageId: string;
  path: string;
  title: Translation;
  isFixed: boolean;
}

export function mapPagesToLinkOptions(pages: CustomPage[]): LinkPageOption[] {
  return pages.map((page) => ({
    pageId: page.id,
    path: page.path,
    title: page.title,
    isFixed: page.isFixed,
  }));
}

export function isInternalLinkDeleted(link: NavLink, pages: LinkPageOption[]): boolean {
  if (link.linkType !== 'internal' || !link.href) return false;

  return !pages.some((page) => page.pageId === link.href || page.path === link.href);
}

export function getSelectedPageValue(link: NavLink, pages: LinkPageOption[]): string {
  return pages.find((page) => page.path === link.href)?.pageId || link.href || '';
}

export function updateLinkType(link: NavLink, linkType: LinkType): NavLink {
  return {
    ...link,
    linkType,
    href: '',
    pageDeleted: false,
  };
}

export function updateInternalLink(link: NavLink, pageId: string, pages: LinkPageOption[]): NavLink {
  const page = pages.find((item) => item.pageId === pageId);

  return {
    ...link,
    href: page?.path || pageId,
    pageDeleted: false,
  };
}

export function updateExternalLink(link: NavLink, href: string): NavLink {
  return {
    ...link,
    href,
    pageDeleted: false,
  };
}

export function markLinkDeleted(link: NavLink): NavLink {
  return {
    ...link,
    pageDeleted: true,
  };
}
