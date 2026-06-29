// 组件缩略图预览组件
import React from 'react';
import { type BlockType } from '../types/blocks';

interface BlockThumbnailProps {
  type: BlockType;
  className?: string;
}

// 每种组件类型的缩略图预览
export function BlockThumbnail({ type, className = '' }: BlockThumbnailProps) {
  return (
    <div className={`bg-gray-100 rounded-lg overflow-hidden ${className}`}>
      {thumbnails[type] || <DefaultThumbnail />}
    </div>
  );
}

// 默认缩略图
function DefaultThumbnail() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-200">
      <div className="w-8 h-8 bg-gray-300 rounded" />
    </div>
  );
}

// 轮播图缩略图
function CarouselThumbnail() {
  return (
    <div className="w-full h-full p-2">
      <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded relative">
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          <div className="w-1.5 h-1.5 bg-white rounded-full" />
          <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
          <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
        </div>
        <div className="absolute top-1/2 left-2 -translate-y-1/2 w-3 h-3 bg-white/30 rounded-full" />
        <div className="absolute top-1/2 right-2 -translate-y-1/2 w-3 h-3 bg-white/30 rounded-full" />
      </div>
    </div>
  );
}

// 分类导航缩略图
function CategoriesThumbnail() {
  return (
    <div className="w-full h-full p-2 flex gap-1.5 justify-center items-center">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex flex-col items-center gap-0.5">
          <div className="w-6 h-6 bg-gray-300 rounded-full" />
          <div className="w-5 h-1 bg-gray-300 rounded" />
        </div>
      ))}
    </div>
  );
}

// 新品上市缩略图
function NewArrivalsThumbnail() {
  return (
    <div className="w-full h-full p-2">
      <div className="h-2 w-12 bg-gray-300 rounded mb-1.5 mx-auto" />
      <div className="flex gap-1 justify-center">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col gap-0.5">
            <div className="w-8 h-8 bg-emerald-200 rounded" />
            <div className="w-8 h-1 bg-gray-300 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

// 精选产品缩略图
function FeaturedProductsThumbnail() {
  return (
    <div className="w-full h-full p-2">
      <div className="h-2 w-10 bg-gray-300 rounded mb-1.5 mx-auto" />
      <div className="grid grid-cols-3 gap-1">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="aspect-square bg-amber-200 rounded" />
        ))}
      </div>
    </div>
  );
}

// 产品网格缩略图
function ProductGridThumbnail() {
  return (
    <div className="w-full h-full p-2">
      <div className="h-2 w-8 bg-gray-300 rounded mb-1.5" />
      <div className="grid grid-cols-4 gap-0.5">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="aspect-square bg-blue-200 rounded-sm" />
        ))}
      </div>
    </div>
  );
}

// 品牌价值缩略图
function BrandValuesThumbnail() {
  return (
    <div className="w-full h-full p-2 flex gap-2 justify-center items-center">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col items-center gap-0.5">
          <div className="w-5 h-5 bg-purple-300 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-purple-500 rounded-sm" />
          </div>
          <div className="w-6 h-1 bg-gray-300 rounded" />
        </div>
      ))}
    </div>
  );
}

// 统计数据缩略图
function StatisticsThumbnail() {
  return (
    <div className="w-full h-full p-2 bg-gray-800 rounded flex gap-2 justify-center items-center">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col items-center gap-0.5">
          <div className="text-[8px] font-bold text-white">99+</div>
          <div className="w-5 h-0.5 bg-gray-500 rounded" />
        </div>
      ))}
    </div>
  );
}

// 客户评价缩略图
function TestimonialsThumbnail() {
  return (
    <div className="w-full h-full p-2">
      <div className="h-2 w-10 bg-gray-300 rounded mb-1.5 mx-auto" />
      <div className="flex gap-1 justify-center">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white border rounded p-1 shadow-sm">
            <div className="flex gap-0.5 items-center mb-0.5">
              <div className="w-3 h-3 bg-gray-300 rounded-full" />
              <div className="w-4 h-1 bg-gray-300 rounded" />
            </div>
            <div className="w-10 h-0.5 bg-gray-200 rounded" />
            <div className="w-8 h-0.5 bg-gray-200 rounded mt-0.5" />
          </div>
        ))}
      </div>
    </div>
  );
}

// FAQ 预览缩略图
function FaqPreviewThumbnail() {
  return (
    <div className="w-full h-full p-2">
      <div className="h-2 w-8 bg-gray-300 rounded mb-1.5 mx-auto" />
      <div className="space-y-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-1 bg-white rounded px-1 py-0.5 border">
            <div className="w-2 h-2 bg-blue-400 rounded-full text-[6px] text-white flex items-center justify-center">?</div>
            <div className="flex-1 h-1 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

// 文本区块缩略图
function TextSectionThumbnail() {
  return (
    <div className="w-full h-full p-2 flex flex-col items-center justify-center gap-1">
      <div className="w-12 h-2 bg-gray-400 rounded" />
      <div className="w-16 h-1 bg-gray-300 rounded" />
      <div className="w-14 h-1 bg-gray-300 rounded" />
      <div className="w-10 h-1 bg-gray-300 rounded" />
    </div>
  );
}

// 图片横幅缩略图
function ImageBannerThumbnail() {
  return (
    <div className="w-full h-full p-2">
      <div className="w-full h-full bg-gradient-to-r from-rose-300 to-orange-300 rounded relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white rounded" />
        </div>
      </div>
    </div>
  );
}

// 图片横幅带标签缩略图
function ImageBannerTagThumbnail() {
  return (
    <div className="w-full h-full p-2">
      <div className="w-full h-full bg-gradient-to-r from-rose-300 to-orange-300 rounded relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white rounded" />
        </div>
        <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded text-xs font-bold">NEW</div>
      </div>
    </div>
  );
}

// 图文组件缩略图
function ImageTextThumbnail() {
  return (
    <div className="w-full h-full p-2 flex gap-2">
      <div className="w-1/2 h-full bg-blue-200 rounded" />
      <div className="w-1/2 flex flex-col justify-center gap-1">
        <div className="w-full h-2 bg-gray-400 rounded" />
        <div className="w-full h-1 bg-gray-300 rounded" />
        <div className="w-3/4 h-1 bg-gray-300 rounded" />
        <div className="w-8 h-2 bg-blue-400 rounded mt-1" />
      </div>
    </div>
  );
}

// 倒计时促销缩略图
function CountdownThumbnail() {
  return (
    <div className="w-full h-full p-2">
      <div className="w-full h-full bg-gradient-to-r from-red-500 to-orange-500 rounded flex flex-col items-center justify-center gap-1">
        <div className="w-12 h-1.5 bg-white rounded" />
        <div className="flex gap-1">
          {['03', '12', '45', '30'].map((n, i) => (
            <div key={i} className="w-4 h-5 bg-white rounded flex items-center justify-center">
              <span className="text-[6px] font-bold text-red-500">{n}</span>
            </div>
          ))}
        </div>
        <div className="w-8 h-2 bg-white rounded" />
      </div>
    </div>
  );
}

// 图片画廊缩略图
function GalleryThumbnail() {
  return (
    <div className="w-full h-full p-2">
      <div className="h-1.5 w-8 bg-gray-300 rounded mb-1.5 mx-auto" />
      <div className="grid grid-cols-3 gap-0.5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="aspect-square rounded-sm"
            style={{
              backgroundColor: ['#93C5FD', '#86EFAC', '#FCD34D', '#FDA4AF', '#C4B5FD', '#67E8F9'][i - 1],
            }}
          />
        ))}
      </div>
    </div>
  );
}

// 特性列表缩略图
function FeatureListThumbnail() {
  return (
    <div className="w-full h-full p-2">
      <div className="h-1.5 w-10 bg-gray-300 rounded mb-1.5 mx-auto" />
      <div className="grid grid-cols-3 gap-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-50 rounded p-1 flex flex-col items-center gap-0.5">
            <div className="w-4 h-4 bg-blue-200 rounded flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-500 rounded-sm" />
            </div>
            <div className="w-full h-1 bg-gray-300 rounded" />
            <div className="w-3/4 h-0.5 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

// CTA行动号召缩略图
function CtaBannerThumbnail() {
  return (
    <div className="w-full h-full p-2">
      <div className="w-full h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded flex flex-col items-center justify-center gap-1">
        <div className="w-14 h-2 bg-white rounded" />
        <div className="w-10 h-1 bg-white/60 rounded" />
        <div className="flex gap-1 mt-0.5">
          <div className="w-8 h-2.5 bg-white rounded" />
          <div className="w-8 h-2.5 border border-white rounded" />
        </div>
      </div>
    </div>
  );
}

// 缩略图映射表
const thumbnails: Partial<Record<BlockType, React.ReactNode>> = {
  carousel: <CarouselThumbnail />,
  categories: <CategoriesThumbnail />,
  newArrivals: <NewArrivalsThumbnail />,
  featuredProducts: <FeaturedProductsThumbnail />,
  productGrid: <ProductGridThumbnail />,
  brandValues: <BrandValuesThumbnail />,
  statistics: <StatisticsThumbnail />,
  testimonials: <TestimonialsThumbnail />,
  faq: <FaqPreviewThumbnail />,
  textSection: <TextSectionThumbnail />,
  imageBanner: <ImageBannerThumbnail />,
  imageBannerTag: <ImageBannerTagThumbnail />,
  imageText: <ImageTextThumbnail />,
  countdown: <CountdownThumbnail />,
  gallery: <GalleryThumbnail />,
  featureList: <FeatureListThumbnail />,
  ctaBanner: <CtaBannerThumbnail />,
  videoSection: <VideoThumbnail />,
  partnerLogos: <PartnerLogosThumbnail />,
};

// 视频缩略图
function VideoThumbnail() {
  return (
    <div className="w-full h-full p-2">
      <div className="w-full h-full bg-gray-800 rounded relative flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
          <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-white border-b-[4px] border-b-transparent ml-0.5" />
        </div>
      </div>
    </div>
  );
}

// 合作伙伴缩略图
function PartnerLogosThumbnail() {
  return (
    <div className="w-full h-full p-2 flex flex-wrap gap-1 justify-center items-center">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="w-5 h-3 bg-gray-200 rounded-sm" />
      ))}
    </div>
  );
}

export default BlockThumbnail;
