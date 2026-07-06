import type { Category, Language, Product, Translation } from "@/cms/types";

// 迁移类型
export interface FeaturedProductsContent {
  title?: Translation;
  subtitle?: Translation;
  maxItems?: number;
}

export interface NewArrivalsContent {
  title?: Translation;
  subtitle?: Translation;
  maxItems?: number;
}


import type { FeaturedProductsProps, NewArrivalsProps } from "../components/blocks";
import { createTranslate } from "../utils/i18n";
import { toProductCardViewProps } from "./productCardAdapter";

interface ProductListAdapterOptions<TContent> {
  content: TContent;
  products: Product[];
  categories: Category[];
  lang: Language;
  formatPriceText: (price?: number) => string;
}

function toCategoryNameMap(categories: Category[]): Record<string, Translation> {
  return Object.fromEntries(categories.map((category) => [category.id, category.name]));
}

export function toNewArrivalsViewProps({
  content,
  products,
  categories,
  lang,
  formatPriceText,
}: ProductListAdapterOptions<NewArrivalsContent>): NewArrivalsProps {
  const translate = createTranslate(lang);
  const categoryNames = toCategoryNameMap(categories);
  const displayProducts = products.slice(0, content.maxItems || 4);

  return {
    titleText: translate(content.title),
    subtitleText: translate(content.subtitle),
    cards: displayProducts.map((product) => ({
      id: String(product.id),
      ...toProductCardViewProps(product, {
        lang,
        variant: "arrival",
        formatPriceText,
        categoryNames,
      }),
    })),
  };
}

export function toFeaturedProductsViewProps({
  content,
  products,
  categories,
  lang,
  formatPriceText,
}: ProductListAdapterOptions<FeaturedProductsContent>): FeaturedProductsProps {
  const translate = createTranslate(lang);
  const categoryNames = toCategoryNameMap(categories);
  const displayProducts = products.slice(0, content.maxItems || 4);

  return {
    titleText: translate(content.title),
    subtitleText: translate(content.subtitle),
    cards: displayProducts.map((product) => ({
      id: String(product.id),
      ...toProductCardViewProps(product, {
        lang,
        formatPriceText,
        categoryNames,
      }),
    })),
  };
}
