import type {
  CategoriesContent,
  CarouselContent,
  CtaBannerContent,
  FAQContent,
  FeatureListContent,
  FeaturedProductsContent,
  GalleryContent,
  ImageBannerContent,
  ImageBannerTagContent,
  ImageFullContent,
  ImageTextContent,
  NewArrivalsContent,
  PartnerLogosContent,
  ProductGridContent,
  StatisticsContent,
  TestimonialsContent,
  TextSectionContent,
  VideoSectionContent,
  BrandValuesContent, 
} from "../components/blocks";

export interface BlockContentMap {
  carousel: CarouselContent;
  categories: CategoriesContent;
  newArrivals: NewArrivalsContent;
  featuredProducts: FeaturedProductsContent;
  productGrid: ProductGridContent;
  brandValues: BrandValuesContent;
  statistics: StatisticsContent;
  testimonials: TestimonialsContent;
  faq: FAQContent;
  textSection: TextSectionContent;
  imageFull: ImageFullContent;
  imageBanner: ImageBannerContent;
  imageBannerTag: ImageBannerTagContent;
  videoSection: VideoSectionContent;
  imageText: ImageTextContent;
  ctaBanner: CtaBannerContent;
  partnerLogos: PartnerLogosContent;
  gallery: GalleryContent;
  featureList: FeatureListContent;
  // inquiry: Record<string, never>; 这个组件实际不需要进入管理/编辑中
}

export type BlockType = keyof BlockContentMap;
