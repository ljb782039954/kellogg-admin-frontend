import MotionHeader from '../custom/motionHeader';
import { Link } from 'react-router-dom';
import ProductCardFeatured from '../custom/ProductCardFeatured';
import type { Translation, Product } from '@/types';

export interface FeaturedProductsProps {
  title?: Translation;
  subtitle?: Translation;
  maxItems?: number;
}

interface Props {
  t: (obj: { zh: string; en: string }) => string;
  props: FeaturedProductsProps;
  products: Product[];
}

export default function FeaturedProducts({ t, props, products }: Props) {
  const { title, subtitle, maxItems } = props;

  const displayedProducts = maxItems ? products.slice(0, maxItems) : products;

  // 如果没有数据，直接返回null
  if (!displayedProducts || displayedProducts.length === 0) return null;

  return (
    <section className="py-8 w-full">
      <div className="container mx-auto px-4">
        <MotionHeader t={t} title={title} subtitle={subtitle} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {displayedProducts.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="block group"
            >
              <ProductCardFeatured
                key={product.id} t={t}
                product={product}
              />
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
