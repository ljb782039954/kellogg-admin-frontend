import { describe, expect, it } from 'vitest';
import { toHeaderForm, createEmptyNavLink, MAX_MAIN_NAV } from './navigation.mapper';
import type { HeaderContent } from '@/types';

describe('navigation.mapper', () => {
  it('provides defaults for missing data', () => {
    const result = toHeaderForm(null);
    expect(result.navItems).toEqual([]);
    expect(result.logoText).toEqual({ zh: '', en: '' });
  });

  it('migrates missing linkType from href', () => {
    const raw: HeaderContent = {
      logoText: { zh: '', en: '' },
      navItems: [{ id: 'n1', name: { zh: '菜单', en: 'Menu' }, linkType: 'internal' as const, href: '/home' }],
    };

    const result = toHeaderForm(raw);
    expect(result.navItems[0].linkType).toBe('internal');
  });

  it('migrates children recursively', () => {
    const raw: HeaderContent = {
      logoText: { zh: '', en: '' },
      navItems: [
        {
          id: 'n1',
          name: { zh: '菜单', en: 'Menu' },
          linkType: 'internal',
          href: '/home',
          children: [{ id: 'c1', name: { zh: '子', en: 'Sub' }, linkType: 'external' as const, href: 'https://x.com' }],
        },
      ],
    };

    const result = toHeaderForm(raw);
    expect(result.navItems[0].children?.[0].linkType).toBe('external');
  });

  it('generates ids when missing', () => {
    const raw: HeaderContent = {
      logoText: { zh: '', en: '' },
      navItems: [{ id: '', name: { zh: '菜单', en: 'Menu' }, linkType: 'internal', href: '/home' }],
    };

    const result = toHeaderForm(raw);
    expect(result.navItems[0].id).toBeTruthy();
  });

  it('enforces a max main nav constant', () => {
    expect(MAX_MAIN_NAV).toBe(5);
  });

  it('creates an empty nav link', () => {
    expect(createEmptyNavLink().id).toBeTruthy();
  });
});
