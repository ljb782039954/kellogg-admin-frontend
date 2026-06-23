import { describe, expectTypeOf, it } from 'vitest';
import type {
  AvailableBlock,
  BlockType,
  CustomPage,
  PageBlock,
} from './block';

describe('package/types/block', () => {
  it('声明项目 Block 联合类型与页面结构', () => {
    expectTypeOf<BlockType>().toEqualTypeOf<
      | 'carousel'
      | 'categories'
      | 'newArrivals'
      | 'featuredProducts'
      | 'productGrid'
      | 'brandValues'
      | 'statistics'
      | 'testimonials'
      | 'faq'
      | 'textSection'
      | 'imageBanner'
      | 'imageFull'
      | 'imageBannerTag'
      | 'videoSection'
      | 'imageText'
      | 'ctaBanner'
      | 'countdown'
      | 'partnerLogos'
      | 'gallery'
      | 'featureList'
      | 'caseStudies'
    >();
    expectTypeOf<PageBlock>().toHaveProperty('content').toEqualTypeOf<unknown>();
    expectTypeOf<CustomPage>().toHaveProperty('blocks').toEqualTypeOf<PageBlock[]>();
  });

  it('声明页面编辑器使用的可选 Block 模型', () => {
    expectTypeOf<AvailableBlock>().toHaveProperty('canAdd').toEqualTypeOf<boolean>();
  });
});
