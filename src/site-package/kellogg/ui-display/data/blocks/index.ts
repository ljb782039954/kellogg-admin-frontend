import type { Translation } from "@/cms/types/common";
import type { BlockContentMap, BlockType, BlockCategory, BlockMeta } from "../../types";

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
// import inquiry from './inquiry';

export const blockCategories = [
  { id: "product", name: { zh: "商品业务", en: "Products" }, icon: "ShoppingBag" },
  { id: "marketing", name: { zh: "营销转化", en: "Marketing" }, icon: "Megaphone" },
  { id: "content", name: { zh: "品牌内容", en: "Content" }, icon: "FileText" },
  { id: "media", name: { zh: "多媒体流", en: "Media" }, icon: "Images" },
] as const satisfies readonly { id: BlockCategory; name: Translation; icon: string }[];

export const categoryNames: Record<BlockCategory, Translation> = {
  product: { zh: "商品业务", en: "Products" },
  marketing: { zh: "营销转化", en: "Marketing" },
  content: { zh: "品牌内容", en: "Content" },
  media: { zh: "多媒体流", en: "Media" },
};

function block<T extends BlockType>(
  type: T,
  category: BlockCategory,
  nameZh: string,
  nameEn: string,
  descriptionZh: string,
  descriptionEn: string,
  defaultProps: Partial<BlockContentMap[T]> = {},
  singleton: boolean,
): BlockMeta<T> {
  return {
    id: type,
    type,
    name: { zh: nameZh, en: nameEn },
    category,
    categoryName: categoryNames[category],
    singleton: singleton,
    description: { zh: descriptionZh, en: descriptionEn },
    defaultProps,
  };
}


export const blockRegistry: BlockMeta[] = [
  block('carousel', 'media', '主图轮播', 'Hero Carousel', '精美的幻灯片大图轮播，支持自动播放与文本 CTA。', 'Hero sliders with auto-play, titles, subtitles, and CTA buttons.', carousel, true),
  block('categories', 'product', '品类卡片', 'Category Cards', '展示商城的几大核心分类，带精美背景图与悬停动效。', 'Displays core store categories with premium background imagery.', categories, true),
  block('newArrivals', 'product', '新品推荐', 'New Arrivals', '自动按上架时间排序展示最新的商品卡片。', 'Automatically fetches and shows recently released products.', newArrivals, true),
  block('featuredProducts', 'product', '精选商品', 'Featured Products', '展示设定为“推荐”的商品爆款。', 'Highlights designated featured best-selling products.', featuredProducts, true),
  block('productGrid', 'product', '商品网格大排版', 'Product Grid', '包含侧栏筛选/分类切换/排序的完整商品列表。', 'Full product directory with sidebar filter, categories and sorters.', productGrid, false),
  block('brandValues', 'content', '品牌价值条款', 'Brand Values', '三列或多列展示品牌的优势（如品质检验、全球配送）。', 'Display key brand advantages in multi-column layouts with icons.', brandValues, true),
  block('statistics', 'content', '里程碑数据', 'Metrics & Stats', '大字号数据统计面板，用于突出展示品牌实力。', 'Stats counter section with clean typography and layout.', statistics, true),
  block('testimonials', 'content', '客户好评见证', 'Testimonials', '卡片滑动或网格展示零售买家的评语和社交头像。', 'Beautiful slider cards showcasing buyers feedback and avatars.', testimonials, true),
  block('faq', 'content', '常见问题折叠面板', 'FAQ Accordion', '优雅的折叠收纳问答，帮助采购商快速获取信息。', 'Clean and modern accordion layout for FAQs.', faq, true),
  block('textSection', 'content', '富文本区块', 'Rich Text Section', '适用于品牌简介、设计理念等大段故事性内容。', 'Paragraph layout designed for brand introduction and stories.', textSection, false),
  block('imageBanner', 'media', '促销大图横幅', 'Promo Banner', '背景大图配居中卡片式文字，用于活动预热。', 'Full width banner featuring a center text card for campaigns.', imageBanner, false),
  block('imageBannerTag', 'media', '带标签图片横幅', 'Tagged Banner', '左上角或顶部带有精美圆角标签的高质感横幅。', 'High-quality promo banner featuring rounded decorative tags.', imageBannerTag, false),
  block('imageFull', 'media', '通栏纯净大图', 'Full Width Image', '无多余文字打扰，纯粹通栏展示大片或细节海报。', 'Clean, text-free full-width banner showcasing detailed photography.', imageFull, false),
  block('imageText', 'content', '图文交错栏', 'Image with Text', '左图右文或左文右图的经典左右对称排版。', 'Classic side-by-side layout with alternating image and text.', imageText, false),
  block('countdown', 'marketing', '闪购倒计时条', 'Countdown Bar', '紧迫感强的数字倒计时横条，用于催促下单。', 'High-conversion banner with real-time countdown timer.', countdown, false),
  block('partnerLogos', 'content', '合作伙伴徽标', 'Partner Logos', '小规格横排徽标滚动展示，增强品牌信誉。', 'Responsive grid of brand logos to build corporate trust.', partnerLogos, false),
  block('gallery', 'media', '网格画廊图集', 'Grid Gallery', '多栏错落网格的穿搭灵感图库，支持轻量悬停说明。', 'Dynamic grid layout of styling shoots with hover overlay captions.', gallery, false),
  block('featureList', 'content', '特性优势清单', 'Feature List', '带图标或序号的直观产品亮点纵向展示清单。', 'Vertical highlights catalog with structured point items.', featureList, false),
  block('ctaBanner', 'marketing', '行动呼吁条', 'CTA Banner Bar', '宽幅渐变色背景条，带醒目的大文字和 CTA 按钮。', 'Vibrant full-width strip prompting immediate actions.', ctaBanner, false),
  block('videoSection', 'media', '视频展示区', 'Video Showcase', '大片级视频视听模块，带封面图与播放控制。', 'Video player block featuring custom poster covers.', videoSection, false),
  block('inquiry', 'marketing', '大货询盘表单', 'Inquiry Form', '高转化率的大宗采购定制询盘提交表单。', 'Bulk procurement and OEM specification inquiry submit form.', {} , false),
];
