import { SlidersHorizontal } from "lucide-react";
import RichText from "@/runtime/components/RichText";
import ProductCard, { type ProductCardProps } from "../base/ProductCard";

export type ProductGridSortId = "newest" | "price-asc" | "price-desc" | "sales";

export interface ProductGridOption<TId extends string = string> {
  id: TId;
  label: string;
  selected: boolean;
}

export interface ProductGridItem extends ProductCardProps {
  id: string;
}

export interface ProductGridLabels {
  loading: string;
  empty: string;
  total: string;
}

export interface ProductGridProps {
  titleText?: string;
  subtitleText?: string;
  categories: ProductGridOption[];
  sortOptions: ProductGridOption<ProductGridSortId>[];
  products: ProductGridItem[];
  labels: ProductGridLabels;
  totalCount: number;
  selectedCategory: string;
  sortBy: ProductGridSortId;
  isLoading: boolean;
  onCategoryChange: (categoryId: string) => void;
  onSortChange: (sortId: ProductGridSortId) => void;
}

export default function ProductGrid({
  titleText = "",
  subtitleText = "",
  categories,
  sortOptions,
  products,
  labels,
  totalCount,
  selectedCategory,
  sortBy,
  isLoading,
  onCategoryChange,
  onSortChange,
}: ProductGridProps) {
  return (
    <section className="px-6 py-12 bg-surface">
      <div className="max-w-6xl mx-auto">
        {(titleText || subtitleText) && (
          <div className="mb-8">
            {titleText && <h2 className="font-luxury-heading text-3xl md:text-4xl font-light">{titleText}</h2>}
            {subtitleText && <RichText value={subtitleText} className="mt-3 text-sm md:text-base text-body max-w-2xl" />}
          </div>
        )}

        <div className="border-y border-border py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => onCategoryChange(category.id)}
                className={`px-4 py-2 text-xs uppercase border transition-colors ${
                  category.selected || selectedCategory === category.id
                    ? "bg-ink-strong text-on-dark border-ink-strong"
                    : "bg-surface text-body border-border hover:border-subtle"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-sm text-body">
            <SlidersHorizontal className="w-4 h-4" />
            <select
              value={sortBy}
              onChange={(event) => onSortChange(event.target.value as ProductGridSortId)}
              className="border border-border bg-surface px-3 py-2 text-sm text-ink-strong outline-none focus:border-ink-strong"
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="relative min-h-[320px] py-8">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-overlay backdrop-blur-sm">
              <p className="text-sm text-body">{labels.loading}</p>
            </div>
          )}

          {products.length === 0 ? (
            <div className="py-16 text-center text-body">{labels.empty}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}
        </div>

        <p className="text-xs uppercase text-subtle">
          {labels.total || `${totalCount}`}
        </p>
      </div>
    </section>
  );
}



