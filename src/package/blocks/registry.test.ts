import { describe, expect, it } from 'vitest';
import type { BlockType } from '@/package/types';
import {
  blockCatalog,
  getAvailableBlocks,
  getBlockCatalogItem,
} from './registry';

const ALL_BLOCK_TYPES: BlockType[] = [
  'carousel', 'categories', 'newArrivals', 'featuredProducts',
  'productGrid', 'brandValues', 'statistics', 'testimonials',
  'faq', 'textSection', 'imageBanner', 'imageFull',
  'imageBannerTag', 'videoSection', 'imageText', 'ctaBanner',
  'countdown', 'partnerLogos', 'gallery', 'featureList',
  'caseStudies',
];

describe('package block registry', () => {
  it('覆盖全部项目 BlockType', () => {
    expect(Object.keys(blockCatalog)).toHaveLength(ALL_BLOCK_TYPES.length);
    for (const type of ALL_BLOCK_TYPES) {
      expect(getBlockCatalogItem(type), type).toBeDefined();
    }
  });

  it('每次创建默认内容都返回独立对象', () => {
    const item = getBlockCatalogItem('textSection')!;
    expect(item.createDefaultContent()).not.toBe(item.createDefaultContent());
  });

  it('按 singleton 元数据控制可添加状态', () => {
    const available = getAvailableBlocks([{ type: 'carousel' }]);
    expect(available.find((item) => item.type === 'carousel')?.canAdd).toBe(false);
    expect(available.find((item) => item.type === 'textSection')?.canAdd).toBe(true);
  });
});
