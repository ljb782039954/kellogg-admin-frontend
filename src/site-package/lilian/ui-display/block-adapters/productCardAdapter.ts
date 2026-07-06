import type { Language, Product, Translation } from "@/cms/types";

// 迁移类型
export interface ProductCardContent {
  productId?: number;
}


import { toProductCardData } from "@/cms/adapters/productCard";
import type { ProductCardProps } from "../components/base/ProductCard";

interface ProductCardAdapterOptions {
  lang: Language;
  variant?: ProductCardProps["variant"];
  formatPriceText: (price?: number) => string;
  categoryNames?: Record<string, Translation>;
}

export function toProductCardViewProps(
  product: Product,
  {
    lang,
    variant = "standard",
    formatPriceText,
    categoryNames = {},
  }: ProductCardAdapterOptions,
): ProductCardProps {
  const card = toProductCardData(product, {
    lang,
    formatPriceText,
    categoryNames,
    includeReleaseDate: variant === "arrival",
    includeDescription: true,
  });

  return {
    title: card.title,
    href: `/product/${product.id}`,
    imageSrc: card.imageSrc,
    tagText: card.tagText,
    quantityText: card.quantityText,
    descriptionText: card.descriptionText,
    priceText: card.priceText,
    originalPriceText: card.originalPriceText,
    releaseText: card.releaseText,
    variant,
  };
}
