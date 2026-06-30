import MotionHeader from '../custom/motionHeader';
import ProductCardNew from '../custom/productCardNew';
import { useMemo } from 'react';
import type { Translation, Product } from '@/types';

export interface NewArrivalsProps {
  title?: Translation;
  subtitle?: Translation;
  maxItems?: number;
}

interface Props {
  t: (obj: { zh: string; en: string }) => string;
  props: NewArrivalsProps;
  products: Product[];
}

export default function NewArrivals({ t, props, products }: Props) {
  const { title, subtitle, maxItems, } = props;

  const displayProducts = useMemo(() => {
    return products.slice(0, maxItems);
  }, [products, maxItems]);

  // 如果没有数据，直接返回null
  if (!displayProducts || displayProducts.length === 0) return null;

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <MotionHeader t={t} title={title} subtitle={subtitle} />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 px-4 pb-4">
          {displayProducts.map((product, index) => (
            <ProductCardNew key={product.id} product={product} t={t} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
