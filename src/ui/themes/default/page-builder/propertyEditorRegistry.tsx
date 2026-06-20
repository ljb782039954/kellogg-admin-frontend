import type { ComponentType } from 'react';
import type { PropertyEditorProps } from '@/features/page-builder';

import { CarouselPropsEditor } from './property-editors/CarouselPropsEditor';
import { CategoriesPropsEditor } from './property-editors/CategoriesPropsEditor';
import { NewArrivalsPropsEditor } from './property-editors/NewArrivalsPropsEditor';
import { FeaturedProductsPropsEditor } from './property-editors/FeaturedProductsPropsEditor';
import { BrandValuesPropsEditor } from './property-editors/BrandValuesPropsEditor';
import { StatisticsPropsEditor } from './property-editors/StatisticsPropsEditor';
import { TestimonialsPropsEditor } from './property-editors/TestimonialsPropsEditor';
import { FAQPropsEditor } from './property-editors/FAQPropsEditor';
import { TextSectionPropsEditor } from './property-editors/TextSectionPropsEditor';
import { ImageBannerPropsEditor } from './property-editors/ImageBannerPropsEditor';
import { ImageFullPropsEditor } from './property-editors/ImageFullPropsEditor';
import { ImageBannerTagPropsEditor } from './property-editors/ImageBannerTagPropsEditor';
import { CompoundProductGridEditor } from './property-editors/CompoundProductGridEditor';
import { VideoSectionPropsEditor } from './property-editors/VideoSectionPropsEditor';
import { ImageTextPropsEditor } from './property-editors/ImageTextPropsEditor';
import { CountdownPropsEditor } from './property-editors/CountdownPropsEditor';
import { PartnerLogosPropsEditor } from './property-editors/PartnerLogosPropsEditor';
import { GalleryPropsEditor } from './property-editors/GalleryPropsEditor';
import { FeatureListPropsEditor } from './property-editors/FeatureListPropsEditor';
import { CtaBannerPropsEditor } from './property-editors/CtaBannerPropsEditor';

export const defaultPropertyEditorRegistry: Record<
  string,
  ComponentType<PropertyEditorProps<any>>
> = {
  carousel: CarouselPropsEditor,
  categories: CategoriesPropsEditor,
  newArrivals: NewArrivalsPropsEditor,
  featuredProducts: FeaturedProductsPropsEditor,
  brandValues: BrandValuesPropsEditor,
  statistics: StatisticsPropsEditor,
  testimonials: TestimonialsPropsEditor,
  faq: FAQPropsEditor,
  textSection: TextSectionPropsEditor,
  imageBanner: ImageBannerPropsEditor,
  imageFull: ImageFullPropsEditor,
  imageBannerTag: ImageBannerTagPropsEditor,
  productGrid: CompoundProductGridEditor,
  videoSection: VideoSectionPropsEditor,
  imageText: ImageTextPropsEditor,
  countdown: CountdownPropsEditor,
  partnerLogos: PartnerLogosPropsEditor,
  gallery: GalleryPropsEditor,
  featureList: FeatureListPropsEditor,
  ctaBanner: CtaBannerPropsEditor,
};
