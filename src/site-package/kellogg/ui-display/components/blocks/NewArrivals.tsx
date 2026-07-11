import { ProductCard } from "../base";
import type { Language, Product, Translation } from "@/cms/types";
import { createTranslate } from "../../utils/i18n";

export interface NewArrivalsContent {
  title?: Translation;
  subtitle?: Translation;
  maxItems?: number;
}

export interface NewArrivalsProps {
  content: NewArrivalsContent;
  products: Product[];
  lang: Language;
}

export default function NewArrivals({
  content: {
  title,
  subtitle,
  maxItems,
  },
  products: initialProducts = [],
  lang,
}: NewArrivalsProps) {
  const translate = createTranslate(lang);
  const products = maxItems ? initialProducts.slice(0, maxItems) : initialProducts;
  const titleText = title ? translate(title) : "";
  const subtitleText = subtitle ? translate(subtitle) : "";

  if (products.length === 0) return null;

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        {titleText && (
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-gray-900">{titleText}</h2>
            {subtitleText && <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-600">{subtitleText}</p>}
          </div>
        )}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-2 md:gap-4 px-4 pb-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              lang={lang}
              variant="arrival"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
