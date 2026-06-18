import { describe, expect, it } from 'vitest';
import { customPageSchema, pageBlockSchema, seoSchema } from './pages.schema';

describe('pages schema', () => {
  it('applies block and page defaults', () => {
    expect(pageBlockSchema.parse({ id: 'b1', type: 'textSection' })).toEqual({
      id: 'b1',
      type: 'textSection',
      content: {},
      isVisible: true,
    });

    expect(customPageSchema.parse({
      id: 'p1',
      path: '/',
      title: { zh: '首页', en: 'Home' },
    })).toMatchObject({ isFixed: false, blocks: [] });
  });

  it.each(['fixed-block', 'dynamic-block', 'fixed-layout'] as const)(
    'accepts the %s page type',
    (type) => {
      expect(customPageSchema.safeParse({
        id: 'p1',
        path: '/',
        title: { zh: '首页', en: 'Home' },
        type,
      }).success).toBe(true);
    },
  );

  it('rejects invalid page types and incomplete translations', () => {
    expect(customPageSchema.safeParse({
      id: 'p1',
      path: '/',
      title: { zh: '首页' },
      type: 'other',
    }).success).toBe(false);
  });

  it('validates SEO translations', () => {
    expect(seoSchema.safeParse({
      title: { zh: '标题', en: 'Title' },
      description: { zh: '描述', en: 'Description' },
      targetCountry: 'USA',
    }).success).toBe(true);
  });
});
