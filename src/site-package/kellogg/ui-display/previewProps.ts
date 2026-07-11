// import type { FormEvent } from "react";
import type { Language } from "@/cms/types";
import type { BlockType } from "./types/blocks";

import { mockCategories, mockProducts } from "./data/db";

type ShowcaseBlockType = BlockType;

const getImageUrl = (src: string) => src;

export function getPreviewProps(
  type: ShowcaseBlockType,
  content: any,
  lang: Language,
): any {
  switch (type) {
    case "carousel":
      return {content, lang};
    case "categories":
      return {content,  categories: mockCategories, lang };
    case "newArrivals":
      return {
        content,
        products: [...mockProducts].sort((a, b) => (b.releaseDate || "").localeCompare(a.releaseDate || "")),
        lang,
      };
    case "featuredProducts":
      return {
        ...content,
        products: mockProducts.filter((product) => product.isFeatured),
        lang,
      };
    case "productGrid":
      return {
        sortOptions: [
          { id: "newest", label: lang === "zh" ? "最新上架" : "Newest", selected: true },
          { id: "price-asc", label: lang === "zh" ? "价格从低到高" : "Price Low-High", selected: false },
          { id: "price-desc", label: lang === "zh" ? "价格从高到低" : "Price High-Low", selected: false },
          { id: "sales", label: lang === "zh" ? "销量优先" : "Best Selling", selected: false },
        ],
        products: mockProducts
          .slice(0, content?.itemsPerPage || 12)
          .map((product) => ({
            id: String(product.id),
            product,
            lang,
          })),
        sortBy: "newest",
        onSortChange: () => {},
        labels: {
          loading: lang === "zh" ? "正在加载商品..." : "Loading products...",
          empty: lang === "zh" ? "暂无商品" : "No products available",
        },
      };
    case "brandValues":
      return { content, lang };
    case "statistics":
      return { content, lang };
    case "testimonials":
      return { content, lang };
    case "faq":
      return { content, lang };
    case "textSection":
      return { content, lang };
    case "imageBanner":
      return { content, lang };
    case "imageBannerTag":
      return {content,  lang, getImageUrl };
    case "imageFull":
      return { content, lang };
    case "imageText":
      return { content, lang };
    case "partnerLogos":
      return { content, lang };
    case "gallery":
      return { content, lang };
    case "featureList":
      return { content, lang };
    case "ctaBanner":
      return { content, lang, getImageUrl };
    case "videoSection":
      return { content, lang };
    // case "inquiry":
    //   return { content, lang };
    default:
      return {};
  }
}
