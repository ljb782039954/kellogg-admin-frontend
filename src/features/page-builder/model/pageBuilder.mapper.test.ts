import { describe, expect, it } from 'vitest';
import type { CustomPage } from '@/types';
import { toPageBuilderDraft, toSavablePage } from './pageBuilder.mapper';

function fullPage(overrides: Partial<CustomPage> = {}): CustomPage {
  return {
    id: 'home',
    path: '/',
    title: { zh: '首页', en: 'Home' },
    isFixed: true,
    type: 'dynamic-block',
    blocks: [
      { id: 'b1', type: 'textSection', content: { text: 'Hello' }, isVisible: true },
    ],
    seo: {
      title: { zh: 'SEO标题', en: 'SEO Title' },
      description: { zh: 'SEO描述', en: 'SEO Description' },
      keywords: { zh: '关键词', en: 'keywords' },
      targetCountry: 'USA',
    },
    ...overrides,
  };
}

describe('toPageBuilderDraft', () => {
  it('fills missing SEO with defaults', () => {
    const page = fullPage({ seo: undefined });
    const draft = toPageBuilderDraft(page);

    expect(draft.seo.title).toEqual({ zh: '', en: '' });
    expect(draft.seo.description).toEqual({ zh: '', en: '' });
    expect(draft.seo.keywords).toEqual({ zh: '', en: '' });
    expect(draft.seo.targetCountry).toBe('');
  });

  it('does not share mutable references with the source page', () => {
    const page = fullPage();
    const draft = toPageBuilderDraft(page);

    draft.blocks[0].content = { text: 'modified' };
    expect((page.blocks[0].content as Record<string, unknown>).text).toBe('Hello');

    draft.title.en = 'Modified';
    expect(page.title.en).toBe('Home');

    draft.seo.title.en = 'Modified SEO';
    expect(page.seo!.title.en).toBe('SEO Title');
  });

  it('keeps full SEO when present', () => {
    const page = fullPage();
    const draft = toPageBuilderDraft(page);

    expect(draft.seo.title.zh).toBe('SEO标题');
    expect(draft.seo.targetCountry).toBe('USA');
  });
});

describe('toSavablePage', () => {
  it('preserves all fields through round-trip', () => {
    const page = fullPage();
    const draft = toPageBuilderDraft(page);
    const result = toSavablePage(draft);

    expect(result.id).toBe('home');
    expect(result.path).toBe('/');
    expect(result.title).toEqual({ zh: '首页', en: 'Home' });
    expect(result.isFixed).toBe(true);
    expect(result.type).toBe('dynamic-block');
    expect(result.blocks).toHaveLength(1);
    expect(result.seo?.title.en).toBe('SEO Title');
  });

  it('does not share mutable references between draft and result', () => {
    const page = fullPage();
    const draft = toPageBuilderDraft(page);
    const result = toSavablePage(draft);

    result.blocks[0].content = { text: 'mutated' };
    expect((draft.blocks[0].content as Record<string, unknown>).text).toBe('Hello');
  });

  it('strips blockCount from index entries', () => {
    const page = fullPage();
    const draft = toPageBuilderDraft(page);
    const result = toSavablePage(draft);

    expect(result).not.toHaveProperty('blockCount');
  });
});
