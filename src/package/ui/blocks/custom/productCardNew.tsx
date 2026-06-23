import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '@/types';

interface ProductCardNewProps {
    t: (obj: { zh: string; en: string }) => string;
    product: Product;
    index: number;
}

export default function ProductCardNew({ product, t, index }: ProductCardNewProps) {


    return (

        <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (index % 3) * 0.1 }}
            className="group"
        >
            <Link to={`/product/${product.id}`} className="block relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 mb-6">
                <img
                    src={product.image}
                    alt={t(product.name)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {product.releaseDate && (
                    <div className="absolute top-4 left-4 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-gray-900 shadow-sm">
                        {product.releaseDate}
                    </div>
                )}
                {product.tag && (
                    <div className="absolute bottom-4 left-4 px-4 py-1.5 bg-amber-500 text-white rounded-full text-xs font-bold shadow-sm">
                        {t(product.tag)}
                    </div>
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <ArrowRight className="w-5 h-5 text-gray-900" />
                    </div>
                </div>
            </Link>

            <div className="space-y-2">
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                        {t(product.name)}
                    </h3>
                    <span className="text-lg font-medium text-gray-500">¥{product.price}</span>
                </div>
                <p className="text-sm text-gray-400 capitalize">
                    {product.category}
                </p>
            </div>
        </motion.div>

    );
}
