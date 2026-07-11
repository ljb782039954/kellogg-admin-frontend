import type {
  BeforeAfterSliderContent,
  // BlogSidebarContent,
  BrochureDownloadContent,
  BrandManifestoContent,
  Categories2Content,
  CategoriesContent,
  CertificationBadgesContent,
  FaqAccordionContent,
  FeaturedProductsContent,
  FeatureListContent,
  FullWidthBannerContent,
  FullscreenImageBackgroundContent,
  LilianExternalVideoItem,
  ImageCarouselContent,
  ImagePairGridContent,
  ImageTextSplitContent,
  LightboxGalleryContent,
  MainHeadingContent,
  MasonryGalleryContent,
  NewArrivalsContent,
  NumberCounterContent,
  ParallaxImageContent,
  ProductGridContent,
  RichTextBlockContent,
  TextGridContent,
  TestimonialMasonryContent,
  VideoGridContent,
} from "../components/blocks";

export interface BlockContentMap {
  // productCard: ProductCardContent;
  categories: CategoriesContent;
  newArrivals: NewArrivalsContent;
  featuredProducts: FeaturedProductsContent;
  productGrid: ProductGridContent;
  featureList: FeatureListContent;
  // inquiry: InquiryContent;
  // blogGrid: BlogGridContent;
  imagePairGrid: ImagePairGridContent;
  masonryGallery: MasonryGalleryContent;
  imageCarousel: ImageCarouselContent;
  fullWidthBanner: FullWidthBannerContent;
  imageTextSplit: ImageTextSplitContent;
  categories2: Categories2Content;
  parallaxImage: ParallaxImageContent;
  beforeAfterSlider: BeforeAfterSliderContent;
  lightboxGallery: LightboxGalleryContent;
  fullscreenImageBackground: FullscreenImageBackgroundContent;
  videoGrid: VideoGridContent;
  fullscreenVideoPopup: LilianExternalVideoItem;
  brandManifesto: BrandManifestoContent;
  numberCounter: NumberCounterContent;
  testimonialMasonry: TestimonialMasonryContent;
  faqAccordion: FaqAccordionContent;
  // blogSidebar: BlogSidebarContent;
  certificationBadges: CertificationBadgesContent;
  brochureDownload: BrochureDownloadContent;
  mainHeading: MainHeadingContent;
  richTextBlock: RichTextBlockContent;
  textGrid: TextGridContent;
}

export type BlockType = keyof BlockContentMap;
