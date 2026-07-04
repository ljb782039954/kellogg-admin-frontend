import type { Language } from "@/cms/types";

// 迁移类型
export interface ProductGridContent {
  itemsPerPage?: number;
  category?: string;
}

import type { Category, Product, SortOption } from "@/cms/types";
import { toProductCardStaticProps } from "./productCardAdapter";
import type {
  ProductGridItem,
  ProductGridLabels,
  ProductGridOption,
  ProductGridProps,
  ProductGridSortId,
} from "../components/blocks";
import { createTranslate } from "../utils/i18n";

export const PRODUCT_GRID_SORT_OPTIONS: SortOption[] = [
  { id: "newest", name: { zh: "最新上架", en: "Newest" } },
  { id: "price-asc", name: { zh: "价格从低到高", en: "Price Low-High" } },
  { id: "price-desc", name: { zh: "价格从高到低", en: "Price High-Low" } },
  { id: "sales", name: { zh: "销量优先", en: "Best Selling" } },
];

interface ProductGridAdapterOptions {
  categories: Category[];
  products: Product[];
  totalCount: number;
  currentPage: number;
  itemsPerPage: number;
  selectedCategory: string;
  sortBy: ProductGridSortId;
  isLoading: boolean;
  lang: Language;
  formatPriceText: (price?: number) => string;
  onCategoryChange: (categoryId: string) => void;
  onSortChange: (sortId: ProductGridSortId) => void;
  onPageChange: (page: number) => void;
}

export type ProductGridBackendSort = "newest" | "price_asc" | "price_desc" | "sales";

export interface ProductGridQueryOptions {
  currentPage: number;
  itemsPerPage: number;
  selectedCategory: string;
  sortBy: ProductGridSortId;
}

export function toProductGridInitialCategory(category?: string): string {
  return category && category !== "all" ? category : "all";
}

export function toProductGridBackendSort(sortBy: ProductGridSortId): ProductGridBackendSort {
  return sortBy.replace("-", "_") as ProductGridBackendSort;
}

export function toProductGridQuery({
  currentPage,
  itemsPerPage,
  selectedCategory,
  sortBy,
}: ProductGridQueryOptions) {
  return {
    page: currentPage,
    pageSize: itemsPerPage,
    category: selectedCategory === "all" ? undefined : selectedCategory,
    sort: toProductGridBackendSort(sortBy),
  };
}

export function toProductGridCategoryOptions({
  categories,
  selectedCategory,
  lang,
}: Pick<ProductGridAdapterOptions, "categories" | "selectedCategory" | "lang">): ProductGridOption[] {
  const translate = createTranslate(lang);

  return [
    {
      id: "all",
      label: lang === "zh" ? "全部" : "All",
      selected: selectedCategory === "all",
    },
    ...categories.map((category) => ({
      id: category.id,
      label: translate(category.name),
      selected: selectedCategory === category.id,
    })),
  ];
}

export function toProductGridSortOptions(
  sortBy: ProductGridSortId,
  lang: Language,
): ProductGridOption<ProductGridSortId>[] {
  const translate = createTranslate(lang);

  return PRODUCT_GRID_SORT_OPTIONS.map((option) => ({
    id: option.id as ProductGridSortId,
    label: translate(option.name),
    selected: sortBy === option.id,
  }));
}

export function toProductGridItems({
  products,
  lang,
  formatPriceText,
}: Pick<ProductGridAdapterOptions, "products" | "lang" | "formatPriceText">): ProductGridItem[] {
  return products.map((product) => ({
      id: String(product.id),
      href: `/product/${product.id}`,
      ...toProductCardStaticProps(product, {
        lang,
        formatPriceText,
      }),
    }));
}

export function toProductGridLabels(lang: Language, totalCount: number): ProductGridLabels {
  return {
    loading: lang === "zh" ? "正在为您加载商品..." : "Loading products...",
    empty: lang === "zh" ? "暂无商品" : "No products available",
    total: lang === "zh" ? `共 ${totalCount} 件商品` : `${totalCount} products total`,
  };
}

export function toProductGridViewProps({
  categories,
  products,
  totalCount,
  currentPage,
  itemsPerPage,
  selectedCategory,
  sortBy,
  isLoading,
  lang,
  formatPriceText,
  onCategoryChange,
  onSortChange,
  onPageChange,
}: ProductGridAdapterOptions): ProductGridProps {
  return {
    categories: toProductGridCategoryOptions({ categories, selectedCategory, lang }),
    sortOptions: toProductGridSortOptions(sortBy, lang),
    products: toProductGridItems({ products, lang, formatPriceText }),
    labels: toProductGridLabels(lang, totalCount),
    totalCount,
    totalPages: Math.ceil(totalCount / itemsPerPage),
    currentPage,
    selectedCategory,
    sortBy,
    isLoading,
    onCategoryChange,
    onSortChange,
    onPageChange,
  };
}
