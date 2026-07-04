import { ProductCardStatic, type ProductCardStaticProps } from "../base";

export interface NewArrivalCard {
  id: string;
  href: string;
  card: ProductCardStaticProps;
}

export interface NewArrivalsProps {
  titleText?: string;
  subtitleText?: string;
  cards?: NewArrivalCard[];
}

export default function NewArrivals({
  titleText = "",
  subtitleText = "",
  cards = [],
}: NewArrivalsProps) {
  if (cards.length === 0) return null;

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
          {cards.map((card) => (
            <a key={card.id} href={card.href} className="block">
              <ProductCardStatic {...card.card} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
