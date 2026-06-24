import { describe, expect, it } from 'vitest';
import { blockCatalog, getBlockCatalogItem, getAvailableBlocks } from './blockCatalog';
import type { BlockType } from '@/types';

describe('blockCatalog', () => {
  it('every createDefaultContent() returns unique nested objects', () => {
    const item = getBlockCatalogItem('textSection')!;
    const a = item.createDefaultContent() as Record<string, unknown>;
    const b = item.createDefaultContent() as Record<string, unknown>;
    a.title = { zh: 'Modified', en: 'Modified' };
    expect((b.title as Record<string, string>).zh).toBe('标题');
  });

  it('has entries for every BlockType', () => {
    const all: BlockType[] = [
      'carousel', 'categories', 'newArrivals', 'featuredProducts',
      'productGrid', 'brandValues', 'statistics', 'testimonials',
      'faq', 'textSection', 'imageBanner', 'imageFull',
      'imageBannerTag', 'videoSection', 'imageText', 'ctaBanner',
      'countdown', 'partnerLogos', 'gallery', 'featureList',
    ];
    for (const type of all) {
      expect(getBlockCatalogItem(type), `Missing catalog entry for ${type}`).toBeDefined();
    }
  });

  it('has categories in the current package block catalog order', () => {
    const types = Object.keys(blockCatalog) as BlockType[];
    const expectedCategories = [
      ...types.filter((t) => blockCatalog[t].category === 'product'),
      ...types.filter((t) => blockCatalog[t].category === 'marketing'),
      ...types.filter((t) => blockCatalog[t].category === 'content'),
      ...types.filter((t) => blockCatalog[t].category === 'media'),
    ];
    expect(expectedCategories.length).toBe(types.length);
  });
});

describe('getAvailableBlocks', () => {
  it('marks singleton as cannot-add when same type exists', () => {
    const available = getAvailableBlocks([
      { type: 'carousel' },
    ]);
    const carousel = available.find((a) => a.type === 'carousel')!;
    expect(carousel.canAdd).toBe(false);
    expect(carousel.disabledReason).toBe('singleton-exists');
  });

  it('allows adding non-singleton blocks regardless of existing blocks', () => {
    const available = getAvailableBlocks([
      { type: 'textSection' },
    ]);
    const textSection = available.find((a) => a.type === 'textSection')!;
    expect(textSection.canAdd).toBe(true);
  });

  it('allows adding singleton blocks when none of that type exists', () => {
    const available = getAvailableBlocks([
      { type: 'textSection' },
    ]);
    const carousel = available.find((a) => a.type === 'carousel')!;
    expect(carousel.canAdd).toBe(true);
  });
});
