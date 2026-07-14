import RichText from "@/runtime/components/RichText";
import ProductCard from "../base/ProductCard";
import type { Language, Product, Translation } from "@/cms/types";
import { createTranslate } from "../../utils/i18n";

// WARNING: This type represents the fields edited in the admin management background.
// Do not modify it lightly; any change requires manual verification.
// Arbitrary alterations may cause page builder block data errors and prevent normal page assembly.
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
  content,
  products = [],
  lang,
}: NewArrivalsProps) {
  if (!content) return null;

  const t = createTranslate(lang);
  const displayProducts = products.slice(0, content.maxItems || 4);

  if (displayProducts.length === 0) return null;

  const titleText = t(content.title);
  const subtitleText = t(content.subtitle);

  return (
    <section className="px-6 py-12 bg-panel">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            {titleText && <h2 className="font-luxury-heading text-3xl md:text-4xl font-light">{titleText}</h2>}
            {subtitleText && <RichText value={subtitleText} className="mt-3 text-sm md:text-base text-body max-w-2xl" />}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-9">
          {displayProducts.map((product) => (
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



