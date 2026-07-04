import type { Language } from "@/cms/types";

// 迁移类型
import type { Translation } from "@/cms/types";
export interface NewArrivalsContent {
  title?: Translation;
  subtitle?: Translation;
  maxItems?: number;
}
import type { NewArrivalsProps } from "../components/blocks";
import type { Product } from "@/cms/types";
import { createTranslate } from "../utils/i18n";
import { toProductCardStaticProps } from "./productCardAdapter";

interface NewArrivalsAdapterOptions {
  content: NewArrivalsContent;
  products: Product[];
  lang: Language;
  formatPriceText: (price?: number) => string;
}

export function toNewArrivalsViewProps({
  content,
  products,
  lang,
  formatPriceText,
}: NewArrivalsAdapterOptions): NewArrivalsProps {
  const translate = createTranslate(lang);
  const displayProducts = content.maxItems ? products.slice(0, content.maxItems) : products;

  return {
    titleText: content.title ? translate(content.title) : "",
    subtitleText: content.subtitle ? translate(content.subtitle) : "",
    cards: displayProducts.map((product) => ({
      id: String(product.id),
      href: `/product/${product.id}`,
      card: toProductCardStaticProps(product, {
        lang,
        variant: "arrival",
        formatPriceText,
      }),
    })),
  };
}
