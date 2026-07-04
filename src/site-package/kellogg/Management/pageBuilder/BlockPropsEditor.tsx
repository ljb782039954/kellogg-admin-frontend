// 积木块属性编辑面板
import type { ComponentType } from 'react';
import { type PageBlock } from '../../types';
import { componentRegistry } from '../../metadata/componentRegistry';
import * as LucideIcons from 'lucide-react';
import BlockLivePreview from './BlockLivePreview';
import type {
  BrandValuesContent,
  CarouselContent,
  CategoriesContent,
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
} from '@site/ui-display/block-adapters';

// 组件基础编辑器
import { TextSectionPropsEditor } from '../propsEditors/TextSectionPropsEditor';
import { ImageBannerPropsEditor } from '../propsEditors/ImageBannerPropsEditor';
import { ImageFullPropsEditor } from '../propsEditors/ImageFullPropsEditor';
import { ImageBannerTagPropsEditor } from '../propsEditors/ImageBannerTagPropsEditor';
import { ProductGridPropsEditor } from '../propsEditors/ProductGridPropsEditor';
import { LayoutPropsEditor } from '../propsEditors/LayoutPropsEditor';

// 实体/全页面数据编辑器
import { CarouselPropsEditor } from '../propsEditors/CarouselPropsEditor';
import { BrandValuesPropsEditor } from '../propsEditors/BrandValuesPropsEditor';
import { StatisticsPropsEditor } from '../propsEditors/StatisticsPropsEditor';
import { TestimonialsPropsEditor } from '../propsEditors/TestimonialsPropsEditor';
import { CategoriesPropsEditor } from '../propsEditors/CategoriesPropsEditor';
import { NewArrivalsPropsEditor } from '../propsEditors/NewArrivalsPropsEditor';
import { FeaturedProductsPropsEditor } from '../propsEditors/FeaturedProductsPropsEditor';
import { ImageTextPropsEditor } from '../propsEditors/ImageTextPropsEditor';
import { CountdownPropsEditor } from '../propsEditors/CountdownPropsEditor';
import { PartnerLogosPropsEditor } from '../propsEditors/PartnerLogosPropsEditor';
import { GalleryPropsEditor } from '../propsEditors/GalleryPropsEditor';
import { FeatureListPropsEditor } from '../propsEditors/FeatureListPropsEditor';
import { CtaBannerPropsEditor } from '../propsEditors/CtaBannerPropsEditor';
import { VideoSectionPropsEditor } from '../propsEditors/VideoSectionPropsEditor';
import { FAQPropsEditor } from '../propsEditors/FAQPropsEditor';

interface BlockPropsEditorProps {
  block: PageBlock;
  onUpdate: (content: unknown) => void;
}

export function BlockPropsEditor({ block, onUpdate }: BlockPropsEditorProps) {
  const meta = componentRegistry[block.type];

  if (!meta) {
    return (
      <div className="p-8 text-center bg-red-50 border border-dashed border-red-200 rounded-lg">
        <LucideIcons.AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <p className="text-red-600 font-medium">未知组件类型</p>
        <p className="text-red-400 text-sm">{block.type}</p>
      </div>
    );
  }

  const icons = LucideIcons as unknown as Record<string, ComponentType<{ className?: string }>>;
  const IconComponent = icons[meta.icon] || icons.Box || LucideIcons.Square;

  return (
    <div className="h-full flex flex-col">
      {/* 标题栏 */}
      <div className="flex items-center gap-3 pb-4 border-b mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <IconComponent className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold">{meta.name.zh}</h3>
          <p className="text-sm text-gray-500">{meta.description.zh}</p>
        </div>
      </div>

      {/* 真实组件预览 */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold uppercase tracking-widest text-gray-800">
            真实组件预览
          </span>
          <span className="text-xs text-gray-400">
            {block.type}
          </span>
        </div>
        <BlockLivePreview
          type={block.type}
          content={block.content}
          variant="editor"
        />
      </div>

      {/* 编辑内容 */}
      <div className="flex-1 overflow-y-auto border-t pt-6">
        <PropsEditorSwitch block={block} onUpdate={onUpdate} />
      </div>
    </div>
  );
}

// 根据组件类型渲染对应的属性编辑器
function PropsEditorSwitch({
  block,
  onUpdate,
}: {
  block: PageBlock;
  onUpdate: (content: unknown) => void;
}) {
  const content = block.content as Record<string, unknown>;

  switch (block.type) {
    // 全局数据组件（由 ContentContext 管理核心数据，此处编辑外围属性）
    case 'carousel':
      return <CarouselPropsEditor props={content as CarouselContent} onUpdate={onUpdate} />;
    case 'categories':
      return <CategoriesPropsEditor props={content as CategoriesContent} onUpdate={onUpdate} />;
    case 'newArrivals':
      return <NewArrivalsPropsEditor props={content as NewArrivalsContent} onUpdate={onUpdate} />;
    case 'featuredProducts':
      return <FeaturedProductsPropsEditor props={content as FeaturedProductsContent} onUpdate={onUpdate} />;
    case 'brandValues':
      return <BrandValuesPropsEditor props={content as BrandValuesContent} onUpdate={onUpdate} />;
    case 'statistics':
      return <StatisticsPropsEditor props={content as StatisticsContent} onUpdate={onUpdate} />;
    case 'testimonials':
      return <TestimonialsPropsEditor props={content as TestimonialsContent} onUpdate={onUpdate} />;
    case 'faq':
      return <FAQPropsEditor props={content as FAQContent} onUpdate={onUpdate} />;
    // 局部内容组件
    case 'textSection':
      return <TextSectionPropsEditor props={content as TextSectionContent} onUpdate={onUpdate} />;
    case 'imageBanner':
      return <ImageBannerPropsEditor props={content as ImageBannerContent} onUpdate={onUpdate} />;
    case 'imageFull':
      return <ImageFullPropsEditor props={content as ImageFullContent} onUpdate={onUpdate} />;
    case 'imageBannerTag':
      return <ImageBannerTagPropsEditor props={content as ImageBannerTagContent} onUpdate={onUpdate} />;
    case 'productGrid':
      return (
        <div className="space-y-4">
          <LayoutPropsEditor block={block} onUpdate={onUpdate} />
          <ProductGridPropsEditor props={content as ProductGridContent} onUpdate={onUpdate} />
        </div>
      );
    case 'videoSection':
      return <VideoSectionPropsEditor props={content as VideoSectionContent} onUpdate={onUpdate} />;
    case 'imageText':
      return <ImageTextPropsEditor props={content as ImageTextContent} onUpdate={onUpdate} />;
    case 'countdown':
      return <CountdownPropsEditor props={content as CountdownContent} onUpdate={onUpdate} />;
    case 'partnerLogos':
      return <PartnerLogosPropsEditor props={content as PartnerLogosContent} onUpdate={onUpdate} />;
    case 'gallery':
      return <GalleryPropsEditor props={content as GalleryContent} onUpdate={onUpdate} />;
    case 'featureList':
      return <FeatureListPropsEditor props={content as FeatureListContent} onUpdate={onUpdate} />;
    case 'ctaBanner':
      return <CtaBannerPropsEditor props={content as CtaBannerContent} onUpdate={onUpdate} />;


    default:
      return (
        <div className="text-center py-8 text-gray-500">
          暂无属性编辑器
        </div>
      );
  }
}
