import { motion } from 'framer-motion';
import type { Product } from '@/types';

interface Props {
    product: Product;
    index?: number;
    t: (obj: { zh: string; en: string }) => string;
}

export default function ProductCard({
    product,
    index = 0,
    t
}: Props) {

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 group"
        >
            {/* Image */}
            <div className="aspect-[3/4] overflow-hidden relative bg-gray-50">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={t(product.name)}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        No Image
                    </div>
                )}
                {product.tag && (
                    <span className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full shadow-sm">
                        {t(product.tag)}
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 min-h-[3rem] group-hover:text-primary transition-colors">
                    {t(product.name)}
                </h3>
                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">
                            ¥{product.price}
                        </span>
                        {product.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">
                                ¥{product.originalPrice}
                            </span>
                        )}
                    </div>
                    {product.rating && (
                        <div className="flex items-center gap-1 text-xs text-yellow-500">
                            <span>★</span>
                            <span className="font-medium text-gray-600">{product.rating}</span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
