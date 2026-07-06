import ProductCard, { type ProductCardProps } from "../base/ProductCard";

export default function ProductCardBlock(props: ProductCardProps) {
  return (
    <section className="max-w-sm mx-auto px-6 py-12">
      <ProductCard {...props} />
    </section>
  );
}



