import { describe, expect, it } from 'vitest';
import type { CustomPage } from '@/package/types';
import { createDefaultPage, sanitizePageIndex } from './pages.mapper';

function page(overrides: Partial<CustomPage> = {}): CustomPage {
  return {
    id: 'page_1',
    path: '/one',
    title: { zh: '页面', en: 'Page' },
    isFixed: false,
    type: 'dynamic-block',
    blocks: [
      { id: 'block_1', type: 'textSection', content: { text: 'hello' }, isVisible: true },
    ],
    ...overrides,
  };
}

describe('pages mapper', () => {
  it('creates a lightweight index entry with blockCount and no block content', () => {
    const result = sanitizePageIndex([page()]);

    expect(result[0]).toMatchObject({
      id: 'page_1',
      path: '/one',
      blockCount: 1,
    });
    expect('blocks' in result[0]).toBe(false);
  });

  it('preserves an existing blockCount from an index entry', () => {
    const indexed = { ...page({ blocks: [] }), blockCount: 8 };

    expect(sanitizePageIndex([indexed])[0].blockCount).toBe(8);
  });

  it('creates a dynamic page with matching SEO title defaults', () => {
    expect(createDefaultPage('/new', { zh: '新页', en: 'New Page' }, 'page_new')).toMatchObject({
      id: 'page_new',
      path: '/new',
      type: 'dynamic-block',
      blocks: [],
      seo: {
        title: { zh: '新页', en: 'New Page' },
        description: { zh: '', en: '' },
      },
    });
  });
});
