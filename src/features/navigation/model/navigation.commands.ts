import { nanoid } from 'nanoid';
import type { NavLink, HeaderContent } from '@/types';

export const MAX_MAIN_NAV = 5;

export function createEmptyNavLink(): NavLink {
  return {
    id: nanoid(8),
    name: { zh: '新菜单', en: 'New Menu' },
    linkType: 'internal',
    href: '',
    children: [],
  };
}

export function createEmptySubLink(): NavLink {
  return {
    id: nanoid(8),
    name: { zh: '新子菜单', en: 'New Sub Menu' },
    linkType: 'internal',
    href: '',
  };
}

export function addNavItem(items: NavLink[]): NavLink[] {
  if (items.length >= MAX_MAIN_NAV) return items;
  return [...items, createEmptyNavLink()];
}

export function removeNavItem(items: NavLink[], index: number): NavLink[] {
  return items.filter((_, i) => i !== index);
}

export function updateNavItemName(
  items: NavLink[],
  index: number,
  name: { zh: string; en: string },
): NavLink[] {
  return items.map((item, i) => (i === index ? { ...item, name } : item));
}

export function addSubItem(items: NavLink[], parentIndex: number): NavLink[] {
  return items.map((item, i) => {
    if (i !== parentIndex) return item;
    return {
      ...item,
      children: [...(item.children || []), createEmptySubLink()],
    };
  });
}

export function removeSubItem(items: NavLink[], parentIndex: number, subIndex: number): NavLink[] {
  return items.map((item, i) => {
    if (i !== parentIndex) return item;
    return {
      ...item,
      children: (item.children || []).filter((_, si) => si !== subIndex),
    };
  });
}

export function updateSubItemName(
  items: NavLink[],
  parentIndex: number,
  subIndex: number,
  name: { zh: string; en: string },
): NavLink[] {
  return items.map((item, i) => {
    if (i !== parentIndex) return item;
    return {
      ...item,
      children: (item.children || []).map((sub, si) =>
        si === subIndex ? { ...sub, name } : sub,
      ),
    };
  });
}

export function updateSubItemLink(
  items: NavLink[],
  parentIndex: number,
  subIndex: number,
  patch: Partial<NavLink>,
): NavLink[] {
  return items.map((item, i) => {
    if (i !== parentIndex) return item;
    return {
      ...item,
      children: (item.children || []).map((sub, si) =>
        si === subIndex ? { ...sub, ...patch } : sub,
      ),
    };
  });
}

export function trimToMaxNavItems(header: HeaderContent): HeaderContent {
  return {
    ...header,
    navItems: header.navItems.slice(0, MAX_MAIN_NAV),
  };
}
