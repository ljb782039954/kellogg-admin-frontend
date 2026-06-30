// 预定义组件预览页面

import { useState } from 'react';
import { componentRegistry, componentsByCategory, categoryNames } from '@/site-package/kellogg/metadata/componentRegistry';
import type { BlockType } from '../types/blocks';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/core/context/LanguageContext';

import * as previewData from '../metadata/blocksContent';
import {
  Carousel,
  Categories,
  NewArrivals,
  FeaturedProducts,
  ProductGrid,
  BrandValues,
  Statistics,
  Testimonials,
  Faq,
  TextSection,
  ImageFull,
  ImageBanner,
  ImageBannerTag,
  // VideoSection,
  ImageText,
  Countdown,
  PartnerLogos,
  Gallery,
  FeatureList,
  CtaBanner
} from '@site/components-web/blocks';

// 组件预览渲染器
function BlocksPreview({ type }: { type: BlockType }) {
  const { language } = useLanguage();
  const t = (obj: { zh: string; en: string }) => obj[language];

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

// 主页面组件
export default function ComponentsPreview() {
  const [selectedType, setSelectedType] = useState<BlockType>('carousel');
  const { language } = useLanguage();

  const meta = componentRegistry[selectedType];
  const IconComponent = (LucideIcons as unknown as Record<string, LucideIcon>)[meta.icon] || LucideIcons.Box;

  return (
    <div className="flex h-full -m-8">
      {/* 左侧组件列表 */}
      <div className="w-72 border-r bg-gray-50/50 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold">预定义组件库</h2>
          <p className="text-sm text-gray-500 mt-1">共 {Object.keys(componentRegistry).length} 个组件</p>
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
                    const compMeta = componentRegistry[type];
                    const CompIcon = (LucideIcons as unknown as Record<string, LucideIcon>)[compMeta.icon] || LucideIcons.Box;
                    return (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors',
                          selectedType === type
                            ? 'bg-primary text-white'
                            : 'hover:bg-gray-100'
                        )}
                      >
                        <CompIcon className="w-4 h-4" />
                        <span className="text-sm">{compMeta.name[language]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* 右侧预览区域 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 组件信息 */}
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
              {meta.hasGlobalData && (
                <Badge variant="secondary">全局数据</Badge>
              )}
              {meta.singleton && (
                <Badge variant="outline">单例</Badge>
              )}
            </div>
          </div>
        </div>

        {/* 预览内容 */}
        <ScrollArea className="flex-1 bg-gray-100">
          <div className="p-8">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <BlocksPreview type={selectedType} />
            </div>

            {/* 组件说明 */}
            <div className="mt-6 bg-white rounded-lg p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <LucideIcons.Info className="w-4 h-4 text-blue-500" />
                组件说明
              </h4>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  <strong>数据来源：</strong>
                  {meta.hasGlobalData ? '使用全局配置数据，在对应的编辑器中管理' : '使用局部数据，在页面编辑器中配置'}
                </p>
                <p>
                  <strong>使用限制：</strong>
                  {meta.singleton ? '每个页面只能使用一次' : '可在同一页面多次使用'}
                </p>
                {meta.defaultProps && Object.keys(meta.defaultProps).length > 0 && (
                  <p>
                    <strong>默认配置：</strong>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded ml-1">
                      {JSON.stringify(meta.defaultProps)}
                    </code>
                  </p>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
