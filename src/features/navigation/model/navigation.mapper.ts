import { nanoid } from 'nanoid';
import type { HeaderContent, NavLink } from '@/package/types';

function migrateNavLink(link: NavLink): NavLink {
  const linkType = link.linkType || (link.href?.startsWith('http') ? 'external' : 'internal');
  return {
    ...link,
    id: link.id || nanoid(8),
    linkType,
    children: link.children?.map(migrateNavLink),
  };
}

export function toHeaderForm(raw: HeaderContent | null | undefined): HeaderContent {
  if (!raw) {
    return { logoText: { zh: '', en: '' }, navItems: [] };
  }

  return {
    ...raw,
    navItems: raw.navItems.map(migrateNavLink),
  };
}

export function createEmptyNavLink(): NavLink {
  return {
    id: nanoid(8),
    name: { zh: '新菜单', en: 'New Menu' },
    linkType: 'internal',
    href: '',
    children: [],
  };
}

export const MAX_MAIN_NAV = 5;
