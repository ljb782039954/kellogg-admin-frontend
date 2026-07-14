import { motion } from 'framer-motion';
import ProductCard, { type ProductCardProps } from './ProductCard';

interface ProductCardMontionProps extends ProductCardProps {
  index?: number;
}

export default function ProductCardMotion({ index = 0, ...card }: ProductCardMontionProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="h-full">
      <ProductCard {...card} />
    </motion.div>
  );
}
