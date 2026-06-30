import { motion } from 'framer-motion';
import {
  Star
} from 'lucide-react';

interface ProductCardFeaturedProps {
  t: (obj: { zh: string; en: string }) => string;
  product: {
    id: number;
    name: { zh: string; en: string };
    image: string;
    price: number;
    originalPrice?: number;
    rating?: number;
    sales?: number;
    tag?: { zh: string; en: string };
  };
}

/**
 * 这个卡片用于展示精选商品列表的卡片
 * @param param0 
 * @returns 
 */

export default function ProductCardFeatured({
  t, product
}: ProductCardFeaturedProps) {

  const style = {
    bg: 'bg-gray-50',
    title: 'text-gray-800',
    subtitle: 'text-gray-500',
    card: 'bg-white',
    cardBorder: 'border-gray-100',
    name: 'text-gray-800',
    price: 'text-gray-900',
    originalPrice: 'text-gray-400',
    button: 'bg-gray-800 text-white hover:bg-gray-700',
    tag: 'bg-red-500 text-white',
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (

    <motion.div
      key={product.id}
      variants={itemVariants}
      className={`group relative rounded-xl overflow-hidden border ${style.cardBorder} ${style.card} shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
    >
      {/* Tag */}
      {product.tag && (
        <span className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full z-10 ${style.tag}`}>
          {t(product.tag)}
        </span>
      )}

      {/* Image */}
      <div className="aspect-[3/4] overflow-hidden">
        <img
          src={product.image}
          alt={t(product.name)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className={`font-medium text-sm md:text-base mb-2 line-clamp-2 ${style.name}`}>
          {t(product.name)}
        </h3>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className={`text-sm ${style.subtitle}`}>
              {product.rating}
            </span>
            {product.sales && (
              <span className={`text-xs ${style.subtitle}`}>
                ({product.sales} sold)
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-lg font-bold ${style.price}`}>
            ¥{product.price}
          </span>
          {product.originalPrice && (
            <span className={`text-sm line-through ${style.originalPrice}`}>
              ¥{product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </motion.div>

  );
}
