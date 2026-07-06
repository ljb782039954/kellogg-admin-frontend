import RichText from "@/runtime/components/RichText";
import ProductCard, { type ProductCardProps } from "../base/ProductCard";

export interface ProductListCard extends ProductCardProps {
  id: string;
}

export interface NewArrivalsProps {
  titleText?: string;
  subtitleText?: string;
  cards?: ProductListCard[];
}

export default function NewArrivals({ titleText = "", subtitleText = "", cards = [] }: NewArrivalsProps) {
  if (cards.length === 0) return null;

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
          {cards.map((card) => (
            <ProductCard key={card.id} {...card} variant="arrival" />
          ))}
        </div>
      </div>
    </section>
  );
}



