import RichText from "@/runtime/components/RichText";
import ProductCard, { type ProductCardProps } from "../base/ProductCard";

export interface FeaturedProductCard extends ProductCardProps {
  id: string;
}

export interface FeaturedProductsProps {
  titleText?: string;
  subtitleText?: string;
  cards?: FeaturedProductCard[];
}

export default function FeaturedProducts({ titleText = "", subtitleText = "", cards = [] }: FeaturedProductsProps) {
  if (cards.length === 0) return null;

  return (
    <section className="px-6 py-12 bg-surface">
      <div className="max-w-6xl mx-auto">
        {(titleText || subtitleText) && (
          <div className="text-center mb-10">
            {titleText && <h2 className="font-luxury-heading text-3xl md:text-4xl font-light">{titleText}</h2>}
            {subtitleText && <RichText value={subtitleText} className="mt-3 text-sm md:text-base text-body max-w-2xl mx-auto" />}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-9">
          {cards.map((card) => (
            <ProductCard key={card.id} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}



