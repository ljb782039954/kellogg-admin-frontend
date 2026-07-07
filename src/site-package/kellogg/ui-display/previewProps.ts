import type { FormEvent } from "react";
import type { Language } from "@/cms/types";
import type { BlockType } from "./types/blocks";
import type { InquirySectionProps } from "./components/blocks-fixed/InquirySection";
import { mockCategories, mockProducts } from "./data/db";
import {
  toBrandValuesViewProps,
  toCarouselViewProps,
  toCategoriesViewProps,
  toCountdownViewProps,
  toCtaBannerViewProps,
  toFAQViewProps,
  toFeatureListViewProps,
  toFeaturedProductsViewProps,
  toGalleryViewProps,
  toImageBannerTagViewProps,
  toImageBannerViewProps,
  toImageFullViewProps,
  toImageTextViewProps,
  toNewArrivalsViewProps,
  toPartnerLogosViewProps,
  toProductGridViewProps,
  toStatisticsViewProps,
  toTestimonialsViewProps,
  toTextSectionViewProps,
  toVideoSectionViewProps,
} from "./block-adapters";

type ShowcaseBlockType = BlockType | "inquiry";

const getImageUrl = (src: string) => src;

function formatPriceText(price?: number) {
  if (price === undefined || price === null) return "";
  return `$${price.toFixed(2)} USD`;
}

function emptyInquiryValues() {
  return {
    name: "",
    email: "",
    phone: "",
    country: "",
    company: "",
    product_type: "",
    quantity: "",
    message: "",
  };
}

function toInquiryPreviewProps(content: any, lang: Language): InquirySectionProps {
  const isZh = lang === "zh";

  return {
    titleText: content?.title?.[lang] || (isZh ? "获取您的专属大货定制报价" : "Request Your Custom Bulk Quote"),
    values: emptyInquiryValues(),
    text: {
      name: isZh ? "姓名" : "Name",
      email: isZh ? "邮箱" : "Email",
      phone: isZh ? "电话" : "Phone",
      country: isZh ? "国家/地区" : "Country",
      company: isZh ? "公司" : "Company",
      productType: isZh ? "产品类型" : "Product Type",
      quantity: isZh ? "采购数量" : "Quantity",
      message: isZh ? "需求说明" : "Message",
      submit: isZh ? "提交询盘" : "Submit Inquiry",
      success: isZh ? "提交成功" : "Submitted",
      successMsg: isZh ? "我们会尽快与您联系。" : "We will contact you shortly.",
      back: isZh ? "返回表单" : "Back to form",
      placeholders: {
        name: isZh ? "请输入您的姓名" : "Your name",
        email: isZh ? "请输入您的邮箱" : "Your email",
        phone: isZh ? "请输入您的电话" : "Your phone number",
        country: isZh ? "您所在的国家/地区" : "Your country or region",
        company: isZh ? "公司名称" : "Company name",
        productType: isZh ? "例如 Hoodie / T-shirt" : "E.g. Hoodie / T-shirt",
        quantity: isZh ? "例如 500 件" : "E.g. 500 pcs",
        message: content?.subtitle?.[lang] || (isZh ? "请描述您的定制需求。" : "Tell us about your custom requirements."),
      },
    },
    isSubmitting: false,
    isSuccess: false,
    turnstileLang: lang,
    onValuesChange: () => {},
    onTurnstileTokenChange: () => {},
    onSubmit: (event: FormEvent<HTMLFormElement>) => event.preventDefault(),
    onBack: () => {},
  };
}

export function getPreviewProps(
  type: ShowcaseBlockType,
  content: any,
  lang: Language,
): any {
  switch (type) {
    case "carousel":
      return toCarouselViewProps(content, lang);
    case "categories":
      return toCategoriesViewProps(content, { categories: mockCategories, lang });
    case "newArrivals":
      return toNewArrivalsViewProps({
        content,
        products: [...mockProducts].sort((a, b) => (b.releaseDate || "").localeCompare(a.releaseDate || "")),
        lang,
        formatPriceText,
      });
    case "featuredProducts":
      return toFeaturedProductsViewProps({
        content,
        products: mockProducts.filter((product) => product.isFeatured),
        lang,
        formatPriceText,
      });
    case "productGrid":
      return toProductGridViewProps({
        categories: mockCategories,
        products: mockProducts,
        totalCount: mockProducts.length,
        currentPage: 1,
        itemsPerPage: 12,
        selectedCategory: "all",
        sortBy: "newest",
        isLoading: false,
        lang,
        formatPriceText,
        onCategoryChange: () => {},
        onSortChange: () => {},
        onPageChange: () => {},
      });
    case "brandValues":
      return toBrandValuesViewProps(content, lang);
    case "statistics":
      return toStatisticsViewProps(content, lang);
    case "testimonials":
      return toTestimonialsViewProps(content, lang);
    case "faq":
      return toFAQViewProps(content, lang);
    case "textSection":
      return toTextSectionViewProps(content, lang);
    case "imageBanner":
      return toImageBannerViewProps(content, lang);
    case "imageBannerTag":
      return toImageBannerTagViewProps(content, { lang, getImageUrl });
    case "imageFull":
      return toImageFullViewProps(content, lang);
    case "imageText":
      return toImageTextViewProps(content, lang);
    case "countdown":
      return toCountdownViewProps(content, lang);
    case "partnerLogos":
      return toPartnerLogosViewProps(content, lang);
    case "gallery":
      return toGalleryViewProps(content, lang);
    case "featureList":
      return toFeatureListViewProps(content, lang);
    case "ctaBanner":
      return toCtaBannerViewProps(content, { lang, getImageUrl });
    case "videoSection":
      return toVideoSectionViewProps(content, lang);
    case "inquiry":
      return toInquiryPreviewProps(content, lang);
    default:
      return {};
  }
}
