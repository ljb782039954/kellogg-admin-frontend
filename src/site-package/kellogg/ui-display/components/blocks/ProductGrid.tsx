import { SlidersHorizontal } from "lucide-react";
import { Pagination, ProductCard, type ProductCardProps } from "../base";
import { type ProductGridSortId } from '@/cms/types'

export interface ProductGridContent {
  itemsPerPage?: number;
  // category?: string; 这个不需要
}

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
}

export interface ProductGridPagination {
  currentPage: number;
  totalPages: number;
  totalCount?: number;
  totalText?: string;
  onPageChange: (page: number) => void;
}

export interface ProductGridProps {
  sortOptions: ProductGridOption<ProductGridSortId>[];
  products: ProductGridItem[];
  sortBy: ProductGridSortId;
  onSortChange: (sortId: ProductGridSortId) => void;

  categories?: ProductGridOption[];
  onCategoryChange?: (categoryId: string) => void;
  pagination?: ProductGridPagination;
  isLoading?: boolean;
  labels?: Partial<ProductGridLabels>;
}

export default function ProductGrid({
  categories,
  sortOptions,
  products,
  sortBy,
  pagination,
  isLoading,
  labels,
  onCategoryChange,
  onSortChange,
}: ProductGridProps) {
  const resolvedLabels = {
    loading: "Loading products...",
    empty: "No products available",
    ...labels,
  };
  const categoryControls = categories?.length && onCategoryChange
    ? { items: categories, onChange: onCategoryChange }
    : null;

  return (
    <section className="pt-20 w-full">
      <div className="container mx-auto px-4">
        <div className="w-full border-b border-gray-200">
          <div className={`flex flex-col md:flex-row md:items-center gap-4 py-4 ${
            categoryControls ? "md:justify-between" : "md:justify-end"
          }`}>
            {categoryControls && (
              <div className="flex flex-wrap gap-2">
                {categoryControls.items.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => categoryControls.onChange(cat.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      cat.selected ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}

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
                  {resolvedLabels.loading}
                </p>
              </div>
            </div>
          )}

          {products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500">
                {resolvedLabels.empty}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>

              {pagination && pagination.totalPages > 1 && (
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={pagination.onPageChange}
                  totalCount={pagination.totalCount}
                  totalText={pagination.totalText}
                />
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
