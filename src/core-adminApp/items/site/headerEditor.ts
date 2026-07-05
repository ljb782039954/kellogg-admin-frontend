import { checkPageExists } from '@/core-adminApp/lib/linkUtils';
import type { HeaderContent, NavLink } from '@/cms/types';
import type { CmsCustomPage } from '@/cms/types';

export const MAX_HEADER_MAIN_NAV = 5;

export function normalizeHeaderLink(link: NavLink): NavLink {
  const linkWithLegacyFields = link as NavLink & { linkType?: NavLink['linkType'] };

  return {
    ...link,
    linkType: linkWithLegacyFields.linkType || (link.href?.startsWith('http') ? 'external' : 'internal'),
    children: link.children?.map(normalizeHeaderLink),
  };
}

export function normalizeHeaderContent(header: HeaderContent): HeaderContent {
  return {
    ...header,
    navItems: header.navItems.map(normalizeHeaderLink),
  };
}

export function hasInvalidHeaderLinks(header: HeaderContent, pages: CmsCustomPage[]): boolean {
  return header.navItems.some((item) => (
    !checkPageExists(item.href, item.linkType, pages) ||
    item.children?.some((child) => !checkPageExists(child.href, child.linkType, pages))
  ));
}

export function prepareHeaderForSave(header: HeaderContent): HeaderContent {
  return {
    ...header,
    navItems: normalizeHeaderContent(header).navItems.slice(0, MAX_HEADER_MAIN_NAV),
  };
}
