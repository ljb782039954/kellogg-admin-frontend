import { createElement, type ComponentType } from 'react';
import type { BlockPreviewProps } from '@/core/contracts';
import { blockCatalog, blockPreviewId } from '@/package/blocks';
import type { BlockType } from '@/package/types';
import {
  BrandValues,
  Carousel,
  Categories,
  Countdown,
  CtaBanner,
  Faq,
  FeatureList,
  FeaturedProducts,
  Gallery,
  ImageBanner,
  ImageBannerTag,
  ImageFull,
  ImageText,
  NewArrivals,
  PartnerLogos,
  ProductGrid,
  Statistics,
  Testimonials,
  TextSection,
  VideoSection,
} from './blocks';

type LegacyBlockComponent = ComponentType<Record<string, unknown>>;

const legacyComponents: Partial<Record<BlockType, LegacyBlockComponent>> = {
  carousel: Carousel as unknown as LegacyBlockComponent,
  categories: Categories as unknown as LegacyBlockComponent,
  newArrivals: NewArrivals as unknown as LegacyBlockComponent,
  featuredProducts: FeaturedProducts as unknown as LegacyBlockComponent,
  productGrid: ProductGrid as unknown as LegacyBlockComponent,
  brandValues: BrandValues as unknown as LegacyBlockComponent,
  statistics: Statistics as unknown as LegacyBlockComponent,
  testimonials: Testimonials as unknown as LegacyBlockComponent,
  faq: Faq as unknown as LegacyBlockComponent,
  textSection: TextSection as unknown as LegacyBlockComponent,
  imageFull: ImageFull as unknown as LegacyBlockComponent,
  imageBanner: ImageBanner as unknown as LegacyBlockComponent,
  imageBannerTag: ImageBannerTag as unknown as LegacyBlockComponent,
  imageText: ImageText as unknown as LegacyBlockComponent,
  countdown: Countdown as unknown as LegacyBlockComponent,
  partnerLogos: PartnerLogos as unknown as LegacyBlockComponent,
  gallery: Gallery as unknown as LegacyBlockComponent,
  featureList: FeatureList as unknown as LegacyBlockComponent,
  ctaBanner: CtaBanner as unknown as LegacyBlockComponent,
  videoSection: VideoSection as unknown as LegacyBlockComponent,
};

function createLegacyBlockView(type: BlockType): ComponentType<BlockPreviewProps> {
  function LegacyBlockView({ content, resources }: BlockPreviewProps) {
    const Component = legacyComponents[type];
    if (!Component) {
      return <div className="p-6 text-center text-gray-400">暂无 {type} 预览组件</div>;
    }

    const resourceProps =
      resources && typeof resources === 'object'
        ? resources as Record<string, unknown>
        : {};

    return createElement(Component, {
      ...resourceProps,
      props: content,
      t: (value: { zh?: string; en?: string } | undefined) =>
        value?.zh ?? value?.en ?? '',
    });
  }

  return LegacyBlockView;
}

export const blockViews = Object.fromEntries(
  (Object.keys(blockCatalog) as BlockType[]).map((type) => [
    blockPreviewId(type),
    createLegacyBlockView(type),
  ]),
) as Record<string, ComponentType<BlockPreviewProps>>;
