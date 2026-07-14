import { ProductCard } from "../base";
import type { Language, Product, Translation } from "@/cms/types";
import { createTranslate } from "../../utils/i18n";

// WARNING: This type represents the fields edited in the admin management background.
// Do not modify it lightly; any change requires manual verification.
// Arbitrary alterations may cause page builder block data errors and prevent normal page assembly.
export interface FeaturedProductsContent {
  title?: Translation;
  subtitle?: Translation;
  maxItems?: number;
}

export interface FeaturedProductsProps {
  content: FeaturedProductsContent;
  products: Product[];
  lang: Language;
}

export default function FeaturedProducts({
  content: {
    title,
    subtitle,
    maxItems = 8,
  },
  products: providedProducts = [],
  lang,
}: FeaturedProductsProps) {
  const translate = createTranslate(lang);
  const products = providedProducts.slice(0, maxItems);
  const titleText = title ? translate(title) : "";
  const subtitleText = subtitle ? translate(subtitle) : "";

  if (products.length === 0) return null;

  return (
    <section className="py-8 w-full">
      <div className="container mx-auto px-4">
        {titleText && (
          <div className="mb-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{titleText}</h2>
            {subtitleText && <p className="mt-2 text-gray-600">{subtitleText}</p>}
          </div>
        )}

        <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              lang={lang}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
