import { lazy, type ComponentType } from "react";
import type { BlockType } from "./types/blocks";

type KelloggBlockComponent = ComponentType<Record<string, unknown>>;

function lazyBlock(loader: Parameters<typeof lazy>[0]): KelloggBlockComponent {
  return lazy(loader) as unknown as KelloggBlockComponent;
}

export const kelloggBlockComponentMap: Partial<Record<BlockType, KelloggBlockComponent>> = {
  carousel: lazyBlock(() => import("./components/blocks/Carousel")),
  categories: lazyBlock(() => import("./components/blocks/Categories")),
  newArrivals: lazyBlock(() => import("./components/blocks/NewArrivals")),
  featuredProducts: lazyBlock(() => import("./components/blocks/FeaturedProducts")),
  productGrid: lazyBlock(() => import("./components/blocks/ProductGrid")),
  brandValues: lazyBlock(() => import("./components/blocks/BrandValues")),
  statistics: lazyBlock(() => import("./components/blocks/Statistics")),
  testimonials: lazyBlock(() => import("./components/blocks/Testimonials")),
  faq: lazyBlock(() => import("./components/blocks/FAQ")),
  textSection: lazyBlock(() => import("./components/blocks/TextSection")),
  imageBanner: lazyBlock(() => import("./components/blocks/ImageBanner")),
  imageBannerTag: lazyBlock(() => import("./components/blocks/ImageBannerTag")),
  imageFull: lazyBlock(() => import("./components/blocks/ImageFull")),
  imageText: lazyBlock(() => import("./components/blocks/ImageText")),
  countdown: lazyBlock(() => import("./components/blocks/Countdown")),
  partnerLogos: lazyBlock(() => import("./components/blocks/PartnerLogos")),
  gallery: lazyBlock(() => import("./components/blocks/Gallery")),
  featureList: lazyBlock(() => import("./components/blocks/FeatureList")),
  ctaBanner: lazyBlock(() => import("./components/blocks/CtaBanner")),
  videoSection: lazyBlock(() => import("./components/blocks/VideoSection")),
};

export function getKelloggBlockComponent(type: BlockType): KelloggBlockComponent | null {
  return kelloggBlockComponentMap[type] || null;
}
