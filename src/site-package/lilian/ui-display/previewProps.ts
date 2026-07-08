import type { Language } from "@/cms/types";
import type { BlockContentMap, BlockType } from "./types";
import {
  toBeforeAfterSliderViewProps,
  toBlogGridViewProps,
  // toBlogSidebarViewProps,
  toBrandManifestoViewProps,
  toBrochureDownloadViewProps,
  toCategoriesViewProps,
  toCertificationBadgesViewProps,
  toCategories2ViewProps,
  toFaqAccordionViewProps,
  toFeaturedProductsViewProps,
  toFeatureListViewProps,
  toFullscreenImageBackgroundViewProps,
  toVideoPopupViewProps,
  toFullWidthBannerViewProps,
  toImageCarouselViewProps,
  toImagePairGridViewProps,
  toImageTextSplitViewProps,
  toInquiryViewProps,
  toLightboxGalleryViewProps,
  toMainHeadingViewProps,
  toMasonryGalleryViewProps,
  toNewArrivalsViewProps,
  toNumberCounterViewProps,
  toParallaxImageViewProps,
  toProductCardViewProps,
  toProductGridViewProps,
  toRichTextBlockViewProps,
  toTextGridViewProps,
  toTestimonialMasonryViewProps,
  toVideoGridViewProps,
} from "./block-adapters";
import { mockBlogs, mockCategories, mockProducts } from "./data/db";

function formatPriceText(price?: number) {
  if (price === undefined || price === null) return "";
  return `${Number.isInteger(price) ? price.toFixed(0) : price.toFixed(1)}元`;
}

export function getPreviewProps<T extends BlockType>(
  type: T,
  content: Partial<BlockContentMap[T]>,
  lang: Language,
) {
  switch (type) {
    case "productCard": {
      const productId = (content as BlockContentMap["productCard"]).productId;
      const product = mockProducts.find((item) => item.id === productId) || mockProducts[0];
      return toProductCardViewProps(product, {
        lang,
        formatPriceText,
        categoryNames: Object.fromEntries(mockCategories.map((category) => [category.id, category.name])),
      });
    }
    case "categories":
      return toCategoriesViewProps(content as unknown as BlockContentMap["categories"], {
        categories: mockCategories,
        lang,
      });
    case "newArrivals":
      return toNewArrivalsViewProps({
        content: content as unknown as BlockContentMap["newArrivals"],
        products: [...mockProducts].sort((a, b) => (b.releaseDate || "").localeCompare(a.releaseDate || "")),
        categories: mockCategories,
        lang,
        formatPriceText,
      });
    case "featuredProducts":
      return toFeaturedProductsViewProps({
        content: content as unknown as BlockContentMap["featuredProducts"],
        products: mockProducts.filter((product) => product.isFeatured),
        categories: mockCategories,
        lang,
        formatPriceText,
      });
    case "productGrid": {
      const gridContent = content as unknown as BlockContentMap["productGrid"];
      return toProductGridViewProps({
        content: gridContent,
        categories: mockCategories,
        products: mockProducts,
        selectedCategory: gridContent.category || "all",
        sortBy: "newest",
        isLoading: false,
        lang,
        formatPriceText,
        onCategoryChange: () => {},
        onSortChange: () => {},
      });
    }
    case "featureList":
      return toFeatureListViewProps(content as unknown as BlockContentMap["featureList"], lang);
    case "inquiry":
      return toInquiryViewProps(content as unknown as BlockContentMap["inquiry"], lang);
    case "blogGrid":
      return toBlogGridViewProps({
        content: content as unknown as BlockContentMap["blogGrid"],
        blogs: mockBlogs,
        lang,
      });
    case "imagePairGrid":
      return toImagePairGridViewProps(content as unknown as BlockContentMap["imagePairGrid"], lang);
    case "masonryGallery":
      return toMasonryGalleryViewProps(content as unknown as BlockContentMap["masonryGallery"], lang);
    case "imageCarousel":
      return toImageCarouselViewProps(content as unknown as BlockContentMap["imageCarousel"], lang);
    case "fullWidthBanner":
      return toFullWidthBannerViewProps(content as unknown as BlockContentMap["fullWidthBanner"], lang);
    case "imageTextSplit":
      return toImageTextSplitViewProps(content as unknown as BlockContentMap["imageTextSplit"], lang);
    case "categories2":
      return toCategories2ViewProps(content as unknown as BlockContentMap["categories2"], lang);
    case "parallaxImage":
      return toParallaxImageViewProps(content as unknown as BlockContentMap["parallaxImage"], lang);
    case "beforeAfterSlider":
      return toBeforeAfterSliderViewProps(content as unknown as BlockContentMap["beforeAfterSlider"], lang);
    case "lightboxGallery":
      return toLightboxGalleryViewProps(content as unknown as BlockContentMap["lightboxGallery"], lang);
    case "fullscreenImageBackground":
      return toFullscreenImageBackgroundViewProps(content as unknown as BlockContentMap["fullscreenImageBackground"], lang);
    case "videoGrid":
      return toVideoGridViewProps(content as unknown as BlockContentMap["videoGrid"], lang);
    case "fullscreenVideoPopup":
      return toVideoPopupViewProps(content as unknown as BlockContentMap["fullscreenVideoPopup"], lang);
    case "richTextBlock":
      return toRichTextBlockViewProps(content as unknown as BlockContentMap["richTextBlock"], lang);
    case "mainHeading":
      return toMainHeadingViewProps(content as unknown as BlockContentMap["mainHeading"], lang);
    case "textGrid":
      return toTextGridViewProps(content as unknown as BlockContentMap["textGrid"], lang);
    case "brandManifesto":
      return toBrandManifestoViewProps(content as unknown as BlockContentMap["brandManifesto"], lang);
    case "faqAccordion":
      return toFaqAccordionViewProps(content as unknown as BlockContentMap["faqAccordion"], lang);
    case "numberCounter":
      return toNumberCounterViewProps(content as unknown as BlockContentMap["numberCounter"], lang);
    case "testimonialMasonry":
      return toTestimonialMasonryViewProps(content as unknown as BlockContentMap["testimonialMasonry"], lang);
    // case "blogSidebar":
    //   return toBlogSidebarViewProps(content as unknown as BlockContentMap["blogSidebar"], lang);
    case "certificationBadges":
      return toCertificationBadgesViewProps(content as unknown as BlockContentMap["certificationBadges"], lang);
    case "brochureDownload":
      return toBrochureDownloadViewProps(content as unknown as BlockContentMap["brochureDownload"], lang);
    default:
      return content;
  }
}

