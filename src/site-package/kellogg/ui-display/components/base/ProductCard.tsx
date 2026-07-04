import { motion } from 'framer-motion';
import ProductCardStatic, { type ProductCardStaticProps } from './ProductCardStatic';

interface ProductCardProps extends ProductCardStaticProps {
  index?: number;
}

export default function ProductCard({ index = 0, ...card }: ProductCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="h-full">
      <ProductCardStatic {...card} />
    </motion.div>
  );
}
