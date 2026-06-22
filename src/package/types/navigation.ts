import type { Translation } from '@/shared/i18n/translation';

export type LinkType = 'internal' | 'external';

export interface NavLink {
  id: string;
  name: Translation;
  linkType: LinkType;
  href: string;
  pageDeleted?: boolean;
  children?: NavLink[];
}

export interface HeaderContent {
  logoText: Translation;
  navItems: NavLink[];
}

export interface PageOption {
  pageId: string;
  path: string;
  title: Translation;
  isFixed: boolean;
}
