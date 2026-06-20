import type { ComponentType } from 'react';
import type { BlockType } from '@/types';
import type { BlockPropertyEditorProps, PropertyEditorComponent } from './propertyEditor.types';

// Original editor components from admin/pageBuilder
import { TextSectionPropsEditor } from '@/ui/themes/default/page-builder/property-editors/TextSectionPropsEditor';
import { ImageBannerPropsEditor } from '@/ui/themes/default/page-builder/property-editors/ImageBannerPropsEditor';
import { ImageFullPropsEditor } from '@/ui/themes/default/page-builder/property-editors/ImageFullPropsEditor';
import { ImageBannerTagPropsEditor } from '@/ui/themes/default/page-builder/property-editors/ImageBannerTagPropsEditor';
import { ProductGridPropsEditor } from '@/ui/themes/default/page-builder/property-editors/ProductGridPropsEditor';
import { CarouselPropsEditor } from '@/ui/themes/default/page-builder/property-editors/CarouselPropsEditor';
import { BrandValuesPropsEditor } from '@/ui/themes/default/page-builder/property-editors/BrandValuesPropsEditor';
import { StatisticsPropsEditor } from '@/ui/themes/default/page-builder/property-editors/StatisticsPropsEditor';
import { TestimonialsPropsEditor } from '@/ui/themes/default/page-builder/property-editors/TestimonialsPropsEditor';
import { CategoriesPropsEditor } from '@/ui/themes/default/page-builder/property-editors/CategoriesPropsEditor';
import { NewArrivalsPropsEditor } from '@/ui/themes/default/page-builder/property-editors/NewArrivalsPropsEditor';
import { FeaturedProductsPropsEditor } from '@/ui/themes/default/page-builder/property-editors/FeaturedProductsPropsEditor';
import { ImageTextPropsEditor } from '@/ui/themes/default/page-builder/property-editors/ImageTextPropsEditor';
import { CountdownPropsEditor } from '@/ui/themes/default/page-builder/property-editors/CountdownPropsEditor';
import { PartnerLogosPropsEditor } from '@/ui/themes/default/page-builder/property-editors/PartnerLogosPropsEditor';
import { GalleryPropsEditor } from '@/ui/themes/default/page-builder/property-editors/GalleryPropsEditor';
import { FeatureListPropsEditor } from '@/ui/themes/default/page-builder/property-editors/FeatureListPropsEditor';
import { CtaBannerPropsEditor } from '@/ui/themes/default/page-builder/property-editors/CtaBannerPropsEditor';
import { VideoSectionPropsEditor } from '@/ui/themes/default/page-builder/property-editors/VideoSectionPropsEditor';
import { FAQPropsEditor } from '@/ui/themes/default/page-builder/property-editors/FAQPropsEditor';

function adaptEditor<T>(
  OldEditor: ComponentType<{ props: T; onUpdate: (props: T) => void }>,
): PropertyEditorComponent {
  const Adapted: PropertyEditorComponent = ({ value, onChange }: BlockPropertyEditorProps) => {
    return <OldEditor props={value as T} onUpdate={onChange as (props: T) => void} />;
  };
  return Adapted;
}

export const propertyEditorRegistry: Partial<
  Record<BlockType, PropertyEditorComponent>
> = {
  carousel: adaptEditor(CarouselPropsEditor),
  categories: adaptEditor(CategoriesPropsEditor),
  newArrivals: adaptEditor(NewArrivalsPropsEditor),
  featuredProducts: adaptEditor(FeaturedProductsPropsEditor),
  brandValues: adaptEditor(BrandValuesPropsEditor),
  statistics: adaptEditor(StatisticsPropsEditor),
  testimonials: adaptEditor(TestimonialsPropsEditor),
  faq: adaptEditor(FAQPropsEditor),
  textSection: adaptEditor(TextSectionPropsEditor),
  imageBanner: adaptEditor(ImageBannerPropsEditor),
  imageFull: adaptEditor(ImageFullPropsEditor),
  imageBannerTag: adaptEditor(ImageBannerTagPropsEditor),
  productGrid: adaptEditor(ProductGridPropsEditor),
  videoSection: adaptEditor(VideoSectionPropsEditor),
  imageText: adaptEditor(ImageTextPropsEditor),
  countdown: adaptEditor(CountdownPropsEditor),
  partnerLogos: adaptEditor(PartnerLogosPropsEditor),
  gallery: adaptEditor(GalleryPropsEditor),
  featureList: adaptEditor(FeatureListPropsEditor),
  ctaBanner: adaptEditor(CtaBannerPropsEditor),
};
