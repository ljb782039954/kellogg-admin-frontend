import type {
  BrandValuesContent,
  CategoriesContent,
  CarouselContent,
  CountdownContent,
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
} from "../block-adapters";

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
  inquiry: Record<string, never>;
  imageBanner: ImageBannerContent;
  imageBannerTag: ImageBannerTagContent;
  videoSection: VideoSectionContent;
  imageText: ImageTextContent;
  ctaBanner: CtaBannerContent;
  countdown: CountdownContent;
  partnerLogos: PartnerLogosContent;
  gallery: GalleryContent;
  featureList: FeatureListContent;
}

export type BlockType = keyof BlockContentMap;
