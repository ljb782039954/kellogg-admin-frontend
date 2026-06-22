import { describe, expect, it } from 'vitest';
import { toFooterForm, createEmptyFooterLink, createEmptyFooterGroup, checkPageExists } from './footer.mapper';
import type { CustomPage } from '@/types';
import type { FooterContent } from '@/package/types';

describe('footer.mapper', () => {
  it('provides defaults for missing data', () => {
    const result = toFooterForm(null);
    expect(result.linkGroups).toEqual([]);
    expect(result.newsletterButton.zh).toBe('订阅');
  });

  it('migrates missing linkType from href', () => {
    const raw: FooterContent = {
      linkGroups: [
        {
          id: 'g1',
          title: { zh: '组', en: 'Group' },
          links: [{ id: 'l1', name: { zh: '链', en: 'Link' }, linkType: 'internal' as const, href: '/home' }],
        },
      ],
      newsletterPlaceholder: { zh: '输入邮箱', en: 'Email' },
      newsletterButton: { zh: '订阅', en: 'Subscribe' },
    };

    const result = toFooterForm(raw);
    expect(result.linkGroups[0].links[0].linkType).toBe('internal');
  });

  it('migrates external linkType from href', () => {
    const raw: FooterContent = {
      linkGroups: [
        {
          id: 'g1',
          title: { zh: '组', en: 'Group' },
          links: [{ id: 'l1', name: { zh: '链', en: 'Link' }, linkType: 'external' as const, href: 'https://example.com' }],
        },
      ],
      newsletterPlaceholder: { zh: '输入邮箱', en: 'Email' },
      newsletterButton: { zh: '订阅', en: 'Subscribe' },
    };

    const result = toFooterForm(raw);
    expect(result.linkGroups[0].links[0].linkType).toBe('external');
  });

  it('generates ids when missing', () => {
    const raw: FooterContent = {
      linkGroups: [
        {
          id: '',
          title: { zh: '组', en: 'Group' },
          links: [{ id: '', name: { zh: '链', en: 'Link' }, linkType: 'internal', href: '/home' }],
        },
      ],
      newsletterPlaceholder: { zh: '输入邮箱', en: 'Email' },
      newsletterButton: { zh: '订阅', en: 'Subscribe' },
    };

    const result = toFooterForm(raw);
    expect(result.linkGroups[0].id).toBeTruthy();
    expect(result.linkGroups[0].links[0].id).toBeTruthy();
  });

  it('checks page existence by path or id', () => {
    const pages: CustomPage[] = [{ id: 'home', path: '/', title: { zh: '首页', en: 'Home' }, isFixed: true, blocks: [] }];
    expect(checkPageExists('/', 'internal', pages)).toBe(true);
    expect(checkPageExists('home', 'internal', pages)).toBe(true);
    expect(checkPageExists('/missing', 'internal', pages)).toBe(false);
    expect(checkPageExists('https://example.com', 'external', pages)).toBe(true);
  });

  it('creates empty link and group helpers', () => {
    expect(createEmptyFooterLink().id).toBeTruthy();
    expect(createEmptyFooterGroup().id).toBeTruthy();
  });
});
