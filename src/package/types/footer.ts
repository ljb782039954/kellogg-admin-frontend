import type { Translation } from '@/shared/i18n/translation';
import type { LinkType } from './navigation';

export interface FooterLink {
  id: string;
  name: Translation;
  linkType: LinkType;
  href: string;
  pageDeleted?: boolean;
}

export interface FooterLinkGroup {
  id: string;
  title: Translation;
  links: FooterLink[];
}

export interface FooterContent {
  linkGroups: FooterLinkGroup[];
  newsletterPlaceholder: Translation;
  newsletterButton: Translation;
}

export interface FooterGroupInput {
  title_zh: string;
  title_en: string;
  sort_order?: number;
  links?: Array<{
    name_zh: string;
    name_en: string;
    href: string;
    sort_order?: number;
  }>;
}
