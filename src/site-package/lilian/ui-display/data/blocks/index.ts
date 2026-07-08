import type { Translation } from "@/cms/types/common";
import type { BlockContentMap, BlockType, BlockCategory, BlockMeta } from "../../types";

import beforeAfterSlider from "./beforeAfterSlider";
import blogGrid from "./blogGrid";
import brandManifesto from "./brandManifesto";
import brochureDownload from "./brochureDownload";
import categories from "./categories";
import certificationBadges from "./certificationBadges";
import categories2 from "./categories2";
import faqAccordion from "./faqAccordion";
import featuredProducts from "./featuredProducts";
import featureList from "./featureList";
import fullWidthBanner from "./fullWidthBanner";
import FullscreenImageBackground from "./fullscreenImageBackground";
import fullscreenVideoPopup from "./fullscreenVideoPopup";
import imageCarousel from "./imageCarousel";
import imagePairGrid from "./imagePairGrid";
import imageTextSplit from "./imageTextSplit";
import inquiry from "./inquiry";
import lightboxGallery from "./lightboxGallery";
import mainHeading from "./mainHeading";
import masonryGallery from "./masonryGallery";
import newArrivals from "./newArrivals";
import numberCounter from "./numberCounter";
import parallaxImage from "./parallaxImage";
import productCard from "./productCard";
import productGrid from "./productGrid";
import richTextBlock from "./richTextBlock";
import textGrid from "./textGrid";
import testimonialMasonry from "./testimonialMasonry";
import videoGrid from "./videoGrid";

export const blockCategories = [
  { id: "product", name: { zh: "商品陈列", en: "Product" }, icon: "ShoppingBag" },
  { id: "marketing", name: { zh: "转化营销", en: "Marketing" }, icon: "Megaphone" },
  { id: "content", name: { zh: "内容品牌", en: "Content" }, icon: "FileText" },
  { id: "image", name: { zh: "图片展示", en: "Image" }, icon: "Image" },
  { id: "video", name: { zh: "视频展示", en: "Video" }, icon: "Video" },
  { id: "text", name: { zh: "文本图文", en: "Text" }, icon: "Type" },
] as const satisfies readonly { id: BlockCategory; name: Translation; icon: string }[];

export const categoryNames: Record<BlockCategory, Translation> = {
  product: { zh: "商品陈列", en: "Product" },
  marketing: { zh: "转化营销", en: "Marketing" },
  content: { zh: "内容品牌", en: "Content" },
  image: { zh: "图片展示", en: "Image" },
  video: { zh: "视频展示", en: "Video" },
  text: { zh: "文本图文", en: "Text" },
};

function block<T extends BlockType>(
  type: T,
  category: BlockCategory,
  nameZh: string,
  nameEn: string,
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
    description: { zh: descriptionEn, en: descriptionEn },
    defaultProps,
  singleton: singleton,

  };
}

export const blockRegistry: BlockMeta[] = [
  block("productCard", "product", "产品卡片", "Product Card", "Single reusable product card connected to the shared Product data model.", productCard, true),
  block("categories", "product", "品类卡片", "Category Cards", "Core collection entrances powered by shared Category data.", categories, true),
  block("newArrivals", "product", "新品网格", "New Arrivals", "Recently released products sorted by launch date.", newArrivals, true),
  block("featuredProducts", "product", "精选商品", "Featured Products", "Curated featured products for home or campaign sections.", featuredProducts, true),
  block("productGrid", "product", "产品卡片网格", "Product Grid", "Full product listing with category filters and sort controls.", productGrid, true),
  block("featureList", "content", "特点列表", "Feature List", "Icon-based list for brand advantages, product highlights, or service promises.", featureList, true),
  block("inquiry", "marketing", "询盘表单", "Inquiry Form", "Structured procurement inquiry form for collection and bulk requests.", inquiry, true),
  block("blogGrid", "content", "博客网格", "Blog Grid", "Editorial article grid connected to shared blog summary data.", blogGrid, true),

  block("imagePairGrid", "image", "双图系列网格", "Image Pair Grid", "Two equal-width images side by side with captions, ideal for two product lines.", imagePairGrid, false),
  block("masonryGallery", "image", "瀑布流图片墙", "Masonry Gallery", "Pinterest-style layout with images of varying heights for a dynamic visual rhythm.", masonryGallery, false),
  block("imageCarousel", "image", "图片轮播", "Image Carousel", "Single image area with dot indicators, supporting auto and manual switching.", imageCarousel, false),
  block("fullWidthBanner", "image", "全宽横幅图", "Full Width Banner", "Single image spanning full width with fixed height, ideal for brand campaigns.", fullWidthBanner, true),
  block("imageTextSplit", "image", "图文分屏", "Image Text Split", "Editorial text and image split layout for brand craft and story sections.", imageTextSplit, false),
  block("categories2", "product", "圆角图片分类", "Categories 2", "Rounded image category shortcuts for collection navigation.", categories2, true),
  block("parallaxImage", "image", "视差滚动图片区", "Parallax Image", "Background image moves slowly with page scroll while foreground text scrolls normally.", parallaxImage, false),
  block("beforeAfterSlider", "image", "分屏对比滑块", "Before After Slider", "Draggable vertical line revealing before and after comparison imagery.", beforeAfterSlider, false),
  block("lightboxGallery", "image", "全屏灯箱画廊", "Lightbox Gallery", "Click thumbnail to open overlay with full-size image navigation.", lightboxGallery, false),

  block("fullscreenImageBackground", "image", "全屏动图背景", "Fullscreen Motion Image Background", "Full-bleed static or animated image background with overlay text.", FullscreenImageBackground, false),
  block("videoGrid", "video", "视频网格", "Video Grid", "External video cards with cover images and responsive embedded playback.", videoGrid, true),
  block("fullscreenVideoPopup", "video", "单视频播放", "Single Video Player", "Click cover to replace it with an embedded external video player.", fullscreenVideoPopup, false),

  block("brandManifesto", "text", "品牌宣言横幅", "Brand Manifesto", "Solid color background with large centered manifesto text.", brandManifesto, true),
  block("numberCounter", "text", "数据数字滚动器", "Number Counter", "Large numbers scrolling from 0 to target value.", numberCounter, false),
  block("testimonialMasonry", "text", "客户评价瀑布流", "Testimonial Masonry", "Masonry layout of review cards with client feedback.", testimonialMasonry, true),
  block("faqAccordion", "text", "FAQ 折叠列表", "FAQ Accordion", "Vertical Q&A list with expandable answers.", faqAccordion, true),
  block("certificationBadges", "text", "认证标志栏", "Certification Badges", "Certification icons arranged horizontally with hover details.", certificationBadges, true),
  block("brochureDownload", "text", "品牌手册下载卡", "Brochure Download", "Cover image, title, and PDF download button for a catalog.", brochureDownload, true),
  block("mainHeading", "text", "主标题", "Main Heading", "Large serif heading for section titles or page headlines.", mainHeading, false),
  block("richTextBlock", "text", "富文本内容", "Rich Text Block", "Paragraph text block for product descriptions, brand stories, or editorial content.", richTextBlock, false),
  block("textGrid", "text", "网格文本", "Text Grid", "Two-column grid of small title and paragraph pairs.", textGrid, false),
];
