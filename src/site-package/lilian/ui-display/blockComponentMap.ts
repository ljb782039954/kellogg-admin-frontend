import { lazy, type ComponentType } from "react";
import type { BlockType } from "./types";

type BlockComponent = ComponentType<Record<string, unknown>>;

function lazyBlock(loader: Parameters<typeof lazy>[0]): BlockComponent {
  return lazy(loader) as unknown as BlockComponent;
}

export const blockComponentMap: Partial<Record<BlockType, BlockComponent>> = {
  productCard: lazyBlock(() => import("./components/blocks/ProductCardBlock")),
  categories: lazyBlock(() => import("./components/blocks/Categories")),
  newArrivals: lazyBlock(() => import("./components/blocks/NewArrivals")),
  featuredProducts: lazyBlock(() => import("./components/blocks/FeaturedProducts")),
  productGrid: lazyBlock(() => import("./components/blocks/ProductGrid")),
  featureList: lazyBlock(() => import("./components/blocks/FeatureList")),
  inquiry: lazyBlock(() => import("./components/blocks/Inquiry")),
  blogGrid: lazyBlock(() => import("./components/blocks/BlogGrid")),

  imagePairGrid: lazyBlock(() => import("./components/blocks/ImagePairGrid")),
  fullWidthBanner: lazyBlock(() => import("./components/blocks/FullWidthBanner")),
  imageTextSplit: lazyBlock(() => import("./components/blocks/ImageTextSplit")),
  richTextBlock: lazyBlock(() => import("./components/blocks/RichTextBlock")),

  masonryGallery: lazyBlock(() => import("./components/blocks/MasonryGallery")),
  imageCarousel: lazyBlock(() => import("./components/blocks/ImageCarousel")),
  categories2: lazyBlock(() => import("./components/blocks/Categories2")),
  parallaxImage: lazyBlock(() => import("./components/blocks/ParallaxImage")),
  beforeAfterSlider: lazyBlock(() => import("./components/blocks/BeforeAfterSlider")),
  lightboxGallery: lazyBlock(() => import("./components/blocks/LightboxGallery")),
  fullscreenImageBackground: lazyBlock(() => import("./components/blocks/FullscreenImageBackground")),
  videoGrid: lazyBlock(() => import("./components/blocks/VideoGrid")),
  fullscreenVideoPopup: lazyBlock(() => import("./components/blocks/FullscreenVideoPopup")),
  brandManifesto: lazyBlock(() => import("./components/blocks/BrandManifesto")),
  numberCounter: lazyBlock(() => import("./components/blocks/NumberCounter")),
  testimonialMasonry: lazyBlock(() => import("./components/blocks/TestimonialMasonry")),
  faqAccordion: lazyBlock(() => import("./components/blocks/FaqAccordion")),
  blogSidebar: lazyBlock(() => import("./components/base/BlogSidebar")),
  certificationBadges: lazyBlock(() => import("./components/blocks/CertificationBadges")),
  brochureDownload: lazyBlock(() => import("./components/blocks/BrochureDownload")),
  mainHeading: lazyBlock(() => import("./components/blocks/MainHeading")),
  textGrid: lazyBlock(() => import("./components/blocks/TextGrid")),
};

export function getLilianBlockComponent(type: BlockType): BlockComponent | null {
  return blockComponentMap[type] || null;
}
