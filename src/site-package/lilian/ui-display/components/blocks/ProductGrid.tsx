import { SlidersHorizontal } from "lucide-react";
import { Pagination, ProductCard, type ProductCardProps } from "../base";
import type { ProductGridSortId , Translation} from "@/cms/types";

// NOTE 这个Content将被用于后台编辑, 最好放在对应的积木块组件中，方便管理
// WARNING: This type represents the fields edited in the admin management background.
// Do not modify it lightly; any change requires manual verification.
// Arbitrary alterations may cause page builder block data errors and prevent normal page assembly.
export interface ProductGridContent {
  title?: Translation;
  subtitle?: Translation;
  itemsPerPage?: number;
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
  titleText?: string;
  subtitleText?: string;
}

export default function ProductGrid({
  categories,
  sortOptions,
  products,
  sortBy,
  isLoading,
  onCategoryChange,
  onSortChange,
  pagination,
  labels,
  titleText,
  subtitleText,
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
    <section className="px-6 py-12 bg-surface">
      <div className="max-w-6xl mx-auto">
        {(titleText || subtitleText) && (
          <div className="mb-8">
            {titleText && <h2 className="font-luxury-heading text-3xl md:text-4xl font-light">{titleText}</h2>}
            {subtitleText && <p className="mt-3 max-w-2xl text-sm text-body md:text-base">{subtitleText}</p>}
          </div>
        )}

        <div className={`border-y border-border py-4 flex flex-col md:flex-row md:items-center gap-4 ${
          categoryControls ? "md:justify-between" : "md:justify-end"
        }`}>
          {categoryControls && (
            <div className="flex flex-wrap gap-2">
              {categoryControls.items.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => categoryControls.onChange(category.id)}
                  className={`px-4 py-2 text-xs uppercase border transition-colors ${
                    category.selected
                      ? "bg-ink-strong text-on-dark border-ink-strong"
                      : "bg-surface text-body border-border hover:border-subtle"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          )}

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
              <p className="text-sm text-body">{resolvedLabels.loading}</p>
            </div>
          )}

          {products.length === 0 ? (
            <div className="py-16 text-center text-body">{resolvedLabels.empty}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}
        </div>

        {pagination && pagination.totalPages > 1 ? (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalCount={pagination.totalCount}
            totalText={pagination.totalText}
            onPageChange={pagination.onPageChange}
          />
        ) : null}
      </div>
    </section>
  );
}

