import type { ComponentType } from 'react';
import type { BlockType } from '@/types';
import type { BlockPropertyEditorProps, PropertyEditorComponent } from './propertyEditor.types';

// Original editor components from admin/pageBuilder
import { TextSectionPropsEditor } from '@/admin/pageBuilder/propsEditors/TextSectionPropsEditor';
import { ImageBannerPropsEditor } from '@/admin/pageBuilder/propsEditors/ImageBannerPropsEditor';
import { ImageFullPropsEditor } from '@/admin/pageBuilder/propsEditors/ImageFullPropsEditor';
import { ImageBannerTagPropsEditor } from '@/admin/pageBuilder/propsEditors/ImageBannerTagPropsEditor';
import { ProductGridPropsEditor } from '@/admin/pageBuilder/propsEditors/ProductGridPropsEditor';
import { CarouselPropsEditor } from '@/admin/pageBuilder/propsEditors/CarouselPropsEditor';
import { BrandValuesPropsEditor } from '@/admin/pageBuilder/propsEditors/BrandValuesPropsEditor';
import { StatisticsPropsEditor } from '@/admin/pageBuilder/propsEditors/StatisticsPropsEditor';
import { TestimonialsPropsEditor } from '@/admin/pageBuilder/propsEditors/TestimonialsPropsEditor';
import { CategoriesPropsEditor } from '@/admin/pageBuilder/propsEditors/CategoriesPropsEditor';
import { NewArrivalsPropsEditor } from '@/admin/pageBuilder/propsEditors/NewArrivalsPropsEditor';
import { FeaturedProductsPropsEditor } from '@/admin/pageBuilder/propsEditors/FeaturedProductsPropsEditor';
import { ImageTextPropsEditor } from '@/admin/pageBuilder/propsEditors/ImageTextPropsEditor';
import { CountdownPropsEditor } from '@/admin/pageBuilder/propsEditors/CountdownPropsEditor';
import { PartnerLogosPropsEditor } from '@/admin/pageBuilder/propsEditors/PartnerLogosPropsEditor';
import { GalleryPropsEditor } from '@/admin/pageBuilder/propsEditors/GalleryPropsEditor';
import { FeatureListPropsEditor } from '@/admin/pageBuilder/propsEditors/FeatureListPropsEditor';
import { CtaBannerPropsEditor } from '@/admin/pageBuilder/propsEditors/CtaBannerPropsEditor';
import { VideoSectionPropsEditor } from '@/admin/pageBuilder/propsEditors/VideoSectionPropsEditor';
import { FAQPropsEditor } from '@/admin/pageBuilder/propsEditors/FAQPropsEditor';

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
