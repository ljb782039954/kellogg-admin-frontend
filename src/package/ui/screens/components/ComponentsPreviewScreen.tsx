// 预定义组件预览页面

import { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLanguage } from '@/core/app/LanguageContext';
import {
  blockCatalog,
  categoryNames,
  componentsByCategory,
} from '@/package/blocks';
import type { BlockType } from '@/package/types';
import { cn } from '@/shared/utils';
import * as previewData from './previewData';
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
} from '@/package/ui/blocks/blocks';
import { Badge } from '@/package/ui/primitives/badge';
import { ScrollArea } from '@/package/ui/primitives/scroll-area';

function BlockPreview({ type }: { type: BlockType }) {
  const { language } = useLanguage();
  const t = (value: { zh: string; en: string }) => value[language];

  switch (type) {
    case 'carousel':
      return <Carousel t={t} {...previewData.carouselPreview} />;
    case 'categories':
      return <Categories t={t} {...previewData.categoriesPreview} />;
    case 'newArrivals':
      return <NewArrivals t={t} {...previewData.newArrivalsPreview} />;
    case 'featuredProducts':
      return <FeaturedProducts t={t} {...previewData.featuredProductsPreview} />;
    case 'productGrid':
      return <ProductGrid t={t} {...previewData.productGridPreview} />;
    case 'brandValues':
      return <BrandValues t={t} {...previewData.brandValuesPreview} />;
    case 'statistics':
      return <Statistics t={t} {...previewData.statisticsPreview} />;
    case 'testimonials':
      return <Testimonials t={t} {...previewData.testimonialsPreview} />;
    case 'faq':
      return <Faq t={t} {...previewData.faqPreview} />;
    case 'textSection':
      return <TextSection t={t} {...previewData.textSectionPreview} />;
    case 'imageFull':
      return <ImageFull t={t} {...previewData.imageBannerPreview} />;
    case 'imageBanner':
      return <ImageBanner t={t} {...previewData.imageBannerPreview} />;
    case 'imageBannerTag':
      return <ImageBannerTag t={t} {...previewData.imageBannerTagPreview} />;
    case 'imageText':
      return <ImageText t={t} {...previewData.imageTextPreview} />;
    case 'countdown':
      return <Countdown t={t} {...previewData.countdownPreview} />;
    case 'partnerLogos':
      return <PartnerLogos t={t} {...previewData.partnerLogosPreview} />;
    case 'gallery':
      return <Gallery t={t} {...previewData.galleryPreview} />;
    case 'featureList':
      return <FeatureList t={t} {...previewData.featureListPreview} />;
    case 'ctaBanner':
      return <CtaBanner t={t} {...previewData.ctaBannerPreview} />;
    default:
      return <div className="text-gray-500 text-center py-8">暂无预览</div>;
  }
}

export function ComponentsPreviewScreen() {
  const [selectedType, setSelectedType] = useState<BlockType>('carousel');
  const { language } = useLanguage();

  const meta = blockCatalog[selectedType];
  const IconComponent =
    (LucideIcons as unknown as Record<string, LucideIcon>)[meta.icon] ??
    LucideIcons.Box;

  return (
    <div className="flex h-full -m-8">
      <div className="w-72 border-r bg-gray-50/50 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold">预定义组件库</h2>
          <p className="text-sm text-gray-500 mt-1">
            共 {Object.keys(blockCatalog).length} 个组件
          </p>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {Object.entries(componentsByCategory).map(([category, types]) => (
              <div key={category}>
                <h3 className="text-xs font-medium text-gray-400 uppercase mb-2">
                  {categoryNames[category as keyof typeof categoryNames][language]}
                </h3>
                <div className="space-y-1">
                  {types.map((type) => {
                    const blockMeta = blockCatalog[type];
                    const BlockIcon =
                      (LucideIcons as unknown as Record<string, LucideIcon>)[
                        blockMeta.icon
                      ] ?? LucideIcons.Box;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setSelectedType(type)}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors',
                          selectedType === type
                            ? 'bg-primary text-white'
                            : 'hover:bg-gray-100',
                        )}
                      >
                        <BlockIcon className="w-4 h-4" />
                        <span className="text-sm">{blockMeta.name[language]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">{meta.name[language]}</h3>
              <p className="text-sm text-gray-500">{meta.description[language]}</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              {meta.hasGlobalData && <Badge variant="secondary">全局数据</Badge>}
              {meta.singleton && <Badge variant="outline">单例</Badge>}
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 bg-gray-100">
          <div className="p-8">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <BlockPreview type={selectedType} />
            </div>

            <div className="mt-6 bg-white rounded-lg p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <LucideIcons.Info className="w-4 h-4 text-blue-500" />
                组件说明
              </h4>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  <strong>数据来源：</strong>
                  {meta.hasGlobalData
                    ? '使用全局配置数据，在对应的编辑器中管理'
                    : '使用局部数据，在页面编辑器中配置'}
                </p>
                <p>
                  <strong>使用限制：</strong>
                  {meta.singleton ? '每个页面只能使用一次' : '可在同一页面多次使用'}
                </p>
                <p>
                  <strong>默认配置：</strong>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded ml-1">
                    {JSON.stringify(meta.createDefaultContent())}
                  </code>
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
