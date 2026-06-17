import { nanoid } from 'nanoid';
import type { CustomPage, FooterContent, FooterLink, FooterLinkGroup } from '@/types';

function migrateLinkType(link: FooterLink): FooterLink {
  if (link.linkType) return link;
  return {
    ...link,
    linkType: link.href?.startsWith('http') ? 'external' : ('internal' as const),
  };
}

export function toFooterForm(raw: FooterContent | null | undefined): FooterContent {
  if (!raw) {
    return {
      linkGroups: [],
      newsletterPlaceholder: { zh: '输入邮箱订阅', en: 'Enter email to subscribe' },
      newsletterButton: { zh: '订阅', en: 'Subscribe' },
    };
  }

  return {
    ...raw,
    linkGroups: raw.linkGroups.map((group) => ({
      ...group,
      id: group.id || nanoid(8),
      links: group.links.map((link) => ({
        ...migrateLinkType(link),
        id: link.id || nanoid(8),
      })),
    })),
  };
}

export function createEmptyFooterLink(): FooterLink {
  return {
    id: nanoid(8),
    name: { zh: '新链接', en: 'New Link' },
    linkType: 'internal',
    href: '',
  };
}

export function createEmptyFooterGroup(): FooterLinkGroup {
  return {
    id: nanoid(8),
    title: { zh: '新分组', en: 'New Group' },
    links: [],
  };
}

export function checkPageExists(href: string | undefined, linkType: string, pages: CustomPage[]): boolean {
  if (linkType === 'external') return true;
  if (!href) return false;
  return pages.some((p) => p.id === href || p.path === href);
}
