import type { FooterContent, FooterLink, FooterLinkGroup } from '@/core/types';

export function normalizeFooterContent(footer: FooterContent): FooterContent {
  return {
    ...footer,
    linkGroups: footer.linkGroups.map((group) => ({
      ...group,
      links: group.links.map((link) => ({
        ...link,
        linkType: link.linkType || (link.href?.startsWith('http') ? 'external' : 'internal'),
      })),
    })),
  };
}

export function createFooterLink(): FooterLink {
  return {
    id: Date.now().toString(),
    name: { zh: '新链接', en: 'New Link' },
    linkType: 'internal',
    href: '',
  };
}

export function createFooterLinkGroup(): FooterLinkGroup {
  return {
    id: Date.now().toString(),
    title: { zh: '新分组', en: 'New Group' },
    links: [],
  };
}
