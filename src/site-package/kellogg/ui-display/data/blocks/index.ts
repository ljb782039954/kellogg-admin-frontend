import type { BlockType, ComponentCategory } from '../../types/blocks';

import brandValues from './brandValues';
import carousel from './carousel';
import categories from './categories';
import newArrivals from './newArrivals';
import featuredProducts from './featuredProducts';
import productGrid from './productGrid';
import statistics from './statistics';
import testimonials from './testimonials';
import faq from './faq';
import textSection from './textSection';
import imageBanner from './imageBanner';
import imageBannerTag from './imageBannerTag';
import imageFull from './imageFull';
import imageText from './imageText';
import countdown from './countdown';
import partnerLogos from './partnerLogos';
import gallery from './gallery';
import featureList from './featureList';
import ctaBanner from './ctaBanner';
import videoSection from './videoSection';
import inquiry from './inquiry';

export interface BlockShowcaseMeta {
  type: BlockType | 'inquiry';
  name: { zh: string; en: string };
  description: { zh: string; en: string };
  icon: string;
  category: ComponentCategory;
  defaultProps: any;
}

export const blockShowcaseRegistry: BlockShowcaseMeta[] = [
  {
    type: 'carousel',
    name: { zh: '主图轮播', en: 'Hero Carousel' },
    description: { zh: '精美的幻灯片大图轮播，支持自动播放与文本 CTA。', en: 'Hero sliders with auto-play, titles, subtitles, and CTA buttons.' },
    icon: 'SlidersHorizontal',
    category: 'media',
    defaultProps: carousel
  },
  {
    type: 'categories',
    name: { zh: '品类卡片', en: 'Category Cards' },
    description: { zh: '展示商城的几大核心分类，带精美背景图与悬停动效。', en: 'Displays core store categories with premium background imagery.' },
    icon: 'Grid',
    category: 'product',
    defaultProps: categories
  },
  {
    type: 'newArrivals',
    name: { zh: '新品推荐', en: 'New Arrivals' },
    description: { zh: '自动按上架时间排序展示最新的商品卡片。', en: 'Automatically fetches and shows recently released products.' },
    icon: 'Sparkles',
    category: 'product',
    defaultProps: newArrivals
  },
  {
    type: 'featuredProducts',
    name: { zh: '精选商品', en: 'Featured Products' },
    description: { zh: '展示设定为“推荐”的商品爆款。', en: 'Highlights designated featured best-selling products.' },
    icon: 'Award',
    category: 'product',
    defaultProps: featuredProducts
  },
  {
    type: 'productGrid',
    name: { zh: '商品网格大排版', en: 'Product Grid' },
    description: { zh: '包含侧栏筛选/分类切换/排序的完整商品列表。', en: 'Full product directory with sidebar filter, categories and sorters.' },
    icon: 'LayoutGrid',
    category: 'product',
    defaultProps: productGrid
  },
  {
    type: 'brandValues',
    name: { zh: '品牌价值条款', en: 'Brand Values' },
    description: { zh: '三列或多列展示品牌的优势（如品质检验、全球配送）。', en: 'Display key brand advantages in multi-column layouts with icons.' },
    icon: 'Shield',
    category: 'content',
    defaultProps: brandValues
  },
  {
    type: 'statistics',
    name: { zh: '里程碑数据', en: 'Metrics & Stats' },
    description: { zh: '大字号数据统计面板，用于突出展示品牌实力。', en: 'Stats counter section with clean typography and layout.' },
    icon: 'Percent',
    category: 'content',
    defaultProps: statistics
  },
  {
    type: 'testimonials',
    name: { zh: '客户好评见证', en: 'Testimonials' },
    description: { zh: '卡片滑动或网格展示零售买家的评语和社交头像。', en: 'Beautiful slider cards showcasing buyers feedback and avatars.' },
    icon: 'MessageSquareQuote',
    category: 'content',
    defaultProps: testimonials
  },
  {
    type: 'faq',
    name: { zh: '常见问题折叠面板', en: 'FAQ Accordion' },
    description: { zh: '优雅的折叠收纳问答，帮助采购商快速获取信息。', en: 'Clean and modern accordion layout for FAQs.' },
    icon: 'HelpCircle',
    category: 'content',
    defaultProps: faq
  },
  {
    type: 'textSection',
    name: { zh: '富文本区块', en: 'Rich Text Section' },
    description: { zh: '适用于品牌简介、设计理念等大段故事性内容。', en: 'Paragraph layout designed for brand introduction and stories.' },
    icon: 'FileText',
    category: 'content',
    defaultProps: textSection
  },
  {
    type: 'imageBanner',
    name: { zh: '促销大图横幅', en: 'Promo Banner' },
    description: { zh: '背景大图配居中卡片式文字，用于活动预热。', en: 'Full width banner featuring a center text card for campaigns.' },
    icon: 'Image',
    category: 'media',
    defaultProps: imageBanner
  },
  {
    type: 'imageBannerTag',
    name: { zh: '带标签图片横幅', en: 'Tagged Banner' },
    description: { zh: '左上角或顶部带有精美圆角标签的高质感横幅。', en: 'High-quality promo banner featuring rounded decorative tags.' },
    icon: 'Bookmark',
    category: 'media',
    defaultProps: imageBannerTag
  },
  {
    type: 'imageFull',
    name: { zh: '通栏纯净大图', en: 'Full Width Image' },
    description: { zh: '无多余文字打扰，纯粹通栏展示大片或细节海报。', en: 'Clean, text-free full-width banner showcasing detailed photography.' },
    icon: 'Maximize',
    category: 'media',
    defaultProps: imageFull
  },
  {
    type: 'imageText',
    name: { zh: '图文交错栏', en: 'Image with Text' },
    description: { zh: '左图右文或左文右图的经典左右对称排版。', en: 'Classic side-by-side layout with alternating image and text.' },
    icon: 'Columns',
    category: 'content',
    defaultProps: imageText
  },
  {
    type: 'countdown',
    name: { zh: '闪购倒计时条', en: 'Countdown Bar' },
    description: { zh: '紧迫感强的数字倒计时横条，用于催促下单。', en: 'High-conversion banner with real-time countdown timer.' },
    icon: 'Timer',
    category: 'marketing',
    defaultProps: countdown
  },
  {
    type: 'partnerLogos',
    name: { zh: '合作伙伴徽标', en: 'Partner Logos' },
    description: { zh: '小规格横排徽标滚动展示，增强品牌信誉。', en: 'Responsive grid of brand logos to build corporate trust.' },
    icon: 'Handshake',
    category: 'content',
    defaultProps: partnerLogos
  },
  {
    type: 'gallery',
    name: { zh: '网格画廊图集', en: 'Grid Gallery' },
    description: { zh: '多栏错落网格的穿搭灵感图库，支持轻量悬停说明。', en: 'Dynamic grid layout of styling shoots with hover overlay captions.' },
    icon: 'Images',
    category: 'media',
    defaultProps: gallery
  },
  {
    type: 'featureList',
    name: { zh: '特性优势清单', en: 'Feature List' },
    description: { zh: '带图标或序号的直观产品亮点纵向展示清单。', en: 'Vertical highlights catalog with structured point items.' },
    icon: 'ListChecks',
    category: 'content',
    defaultProps: featureList
  },
  {
    type: 'ctaBanner',
    name: { zh: '行动呼吁条', en: 'CTA Banner Bar' },
    description: { zh: '宽幅渐变色背景条，带醒目的大文字和 CTA 按钮。', en: 'Vibrant full-width strip prompting immediate actions.' },
    icon: 'Megaphone',
    category: 'marketing',
    defaultProps: ctaBanner
  },
  {
    type: 'videoSection',
    name: { zh: '视频展示区', en: 'Video Showcase' },
    description: { zh: '大片级视频视听模块，带封面图与播放控制。', en: 'Video player block featuring custom poster covers.' },
    icon: 'Video',
    category: 'media',
    defaultProps: videoSection
  },
  {
    type: 'inquiry',
    name: { zh: '大货询盘表单', en: 'Inquiry Form' },
    description: { zh: '高转化率的大宗采购定制询盘提交表单。', en: 'Bulk procurement and OEM specification inquiry submit form.' },
    icon: 'MailOpen',
    category: 'marketing',
    defaultProps: inquiry
  }
];
