
import type { Translation } from "@/cms/types/common";


// ============================================
// 积木块系统 (Block-based System)
// ============================================

export type BlockType =
  | 'carousel'
  | 'categories'
  | 'newArrivals'
  | 'featuredProducts'
  | 'productGrid'
  | 'brandValues'
  | 'statistics'
  | 'testimonials'
  | 'faq'
  | 'textSection'
  | 'imageBanner'
  | 'imageFull' 
  | 'imageBannerTag'
  | 'videoSection'
  | 'imageText'
  | 'ctaBanner'
  | 'countdown'
  | 'partnerLogos'
  | 'gallery'
  | 'featureList'
;

export interface PageBlock {
  id: string;          // 唯一ID，用于拖拽排序
  type: BlockType;     // 组件类型
  content: any;        // 该组件的具体属性 (统一使用 content)
  isVisible: boolean;   // 是否可见 (统一使用 isVisible)
}

export interface CustomPage {
  id: string;          // 页面标识ID (如 'home')
  path: string;        // 路由地址 (如 '/', '/products')
  title: Translation;  // 页面名称/标题
  isFixed: boolean;    // 是否为固定系统页面 (不可删除)
  type?: 'fixed-block' | 'dynamic-block' | 'fixed-layout'; // 显式页面类型
  content?: any;       // 页面特有配置内容 (如 fixed-layout 的专有配置)
  blocks: PageBlock[]; // 存放积木块数组
  seo?: {
    title: Translation;
    description: Translation;
    keywords?: Translation;
    targetCountry?: string; // 用于 GEO 优化，例如 "USA", "UK"
  };
}

