import type { BulkPrice, Language, Product } from "@/cms/types";
import { toProductCardData } from "@/cms/adapters/productCard";
import type { ProductCardStaticProps } from "../components/base";

interface ProductCardAdapterOptions {
  lang: Language;
  variant?: ProductCardStaticProps["variant"];
  formatPriceText: (price?: number) => string;
}

function formatKelloggQuantityText(bulkPrice: BulkPrice) {
  return bulkPrice.maxQty
    ? `${bulkPrice.minQty}-${bulkPrice.maxQty} PCS`
    : `${bulkPrice.minQty}+ PCS`;
}

export function toProductCardStaticProps(
  product: Product,
  {
    lang,
    variant = "standard",
    formatPriceText,
  }: ProductCardAdapterOptions,
): ProductCardStaticProps {
  const card = toProductCardData(product, {
    lang,
    formatPriceText,
    preferBulkPrice: variant !== "arrival",
    includeOriginalPrice: false,
    includeReleaseDate: true,
    formatQuantityText: formatKelloggQuantityText,
  });

  return {
    variant,
    title: card.title,
    imageSrc: card.imageSrc,
    tagText: card.tagText,
    releaseText: card.releaseText,
    quantityText: card.quantityText,
    priceText: card.priceText,
    basePrice: card.basePrice,
  };
}
