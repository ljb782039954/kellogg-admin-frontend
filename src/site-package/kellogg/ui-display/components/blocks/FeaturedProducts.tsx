import { ProductCardStatic, type ProductCardStaticProps } from "../base";

export interface FeaturedProductCard {
  id: string;
  href: string;
  card: ProductCardStaticProps;
}

export interface FeaturedProductsProps {
  titleText?: string;
  subtitleText?: string;
  cards?: FeaturedProductCard[];
}

export default function FeaturedProducts({
  titleText = "",
  subtitleText = "",
  cards = [],
}: FeaturedProductsProps) {
  if (cards.length === 0) return null;

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
          {cards.map((card) => (
            <a key={card.id} href={card.href} className="block group">
              <ProductCardStatic {...card.card} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
