import type { BulkPrice, Language, Product, Translation } from "../types";

export interface ProductCardData {
  title: string;
  imageSrc?: string;
  tagText?: string;
  quantityText?: string;
  priceText?: string;
  originalPriceText?: string;
  basePrice?: number;
  releaseText?: string;
  categoryText?: string;
  descriptionText?: string;
}

export interface ProductCardDataOptions {
  lang: Language;
  formatPriceText: (price?: number) => string;
  categoryNames?: Record<string, Translation>;
  preferBulkPrice?: boolean;
  includeOriginalPrice?: boolean;
  includeReleaseDate?: boolean;
  includeDescription?: boolean;
  formatQuantityText?: (bulkPrice: BulkPrice, lang: Language) => string;
}

function translate(value: Translation | string | undefined, lang: Language): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[lang] || value.en || value.zh || "";
}

function defaultQuantityText(bulkPrice: BulkPrice, lang: Language): string {
  if (lang === "zh") {
    return bulkPrice.maxQty
      ? `${bulkPrice.minQty}~${bulkPrice.maxQty}件`
      : `${bulkPrice.minQty}+件`;
  }

  return bulkPrice.maxQty
    ? `${bulkPrice.minQty}-${bulkPrice.maxQty} pcs`
    : `${bulkPrice.minQty}+ pcs`;
}

export function toProductCardData(
  product: Product,
  {
    lang,
    formatPriceText,
    categoryNames = {},
    preferBulkPrice = true,
    includeOriginalPrice = true,
    includeReleaseDate = false,
    includeDescription = false,
    formatQuantityText = defaultQuantityText,
  }: ProductCardDataOptions,
): ProductCardData {
  const bulkPrice = product.bulkPrices?.[0];
  const basePrice = preferBulkPrice && bulkPrice ? bulkPrice.price : product.price;
  const categoryName = product.category ? categoryNames[product.category] : undefined;

  return {
    title: translate(product.name, lang),
    imageSrc: product.image || "",
    tagText: product.tag ? translate(product.tag, lang) : undefined,
    quantityText: bulkPrice ? formatQuantityText(bulkPrice, lang) : undefined,
    priceText: formatPriceText(basePrice),
    originalPriceText: includeOriginalPrice && !bulkPrice && product.originalPrice
      ? formatPriceText(product.originalPrice)
      : undefined,
    basePrice,
    releaseText: includeReleaseDate ? product.releaseDate : undefined,
    categoryText: categoryName ? translate(categoryName, lang) : product.category || undefined,
    descriptionText: includeDescription && product.description
      ? translate(product.description, lang)
      : undefined,
  };
}
