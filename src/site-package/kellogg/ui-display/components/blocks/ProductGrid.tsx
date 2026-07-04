import { SlidersHorizontal } from "lucide-react";
import { Pagination, ProductCardStatic, type ProductCardStaticProps } from "../base";

export type ProductGridSortId = "newest" | "price-asc" | "price-desc" | "sales";

export interface ProductGridOption<TId extends string = string> {
  id: TId;
  label: string;
  selected: boolean;
}

export interface ProductGridItem extends ProductCardStaticProps {
  id: string;
  href: string;
}

export interface ProductGridLabels {
  loading: string;
  empty: string;
  total: string;
}

export interface ProductGridProps {
  categories: ProductGridOption[];
  sortOptions: ProductGridOption<ProductGridSortId>[];
  products: ProductGridItem[];
  labels: ProductGridLabels;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  selectedCategory: string;
  sortBy: ProductGridSortId;
  isLoading: boolean;
  onCategoryChange: (categoryId: string) => void;
  onSortChange: (sortId: ProductGridSortId) => void;
  onPageChange: (page: number) => void;
}

export default function ProductGrid({
  categories,
  sortOptions,
  products,
  labels,
  totalCount,
  totalPages,
  currentPage,
  selectedCategory,
  sortBy,
  isLoading,
  onCategoryChange,
  onSortChange,
  onPageChange,
}: ProductGridProps) {
  return (
    <section className="pt-20 w-full">
      <div className="container mx-auto px-4">
        <div className="w-full border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onCategoryChange(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    cat.selected || selectedCategory === cat.id ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(event) => onSortChange(event.target.value as ProductGridSortId)}
                className="px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-800 border-none"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="py-12 relative min-h-[400px]">
          {isLoading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center transition-all duration-300">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
                <p className="text-sm text-gray-500 font-medium tracking-wide">
                  {labels.loading}
                </p>
              </div>
            </div>
          )}

          {products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500">
                {labels.empty}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
                  <a key={product.id} href={product.href} className="block group h-full">
                    <ProductCardStatic {...product} />
                  </a>
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                  totalCount={totalCount}
                  totalText={labels.total}
                />
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
