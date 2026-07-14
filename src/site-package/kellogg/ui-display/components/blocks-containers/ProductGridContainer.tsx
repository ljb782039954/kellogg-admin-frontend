// import { useEffect, useState } from "react";
// import { api } from "@services/api";
// import { useStore } from "@nanostores/react";
// import { $currency, $rates, formatPrice } from "@/cms/lib/currency";
// import type { ProductGridContent } from "../blocks";
// import type { Category, Language, Product, ProductGridSortId  } from "@/cms/types";
// import { ProductGrid as ProductGridView } from "../blocks";
// // import { useProductGrid,} from "@core-webApp/hooks/useProductGrid";
// import { createTranslate } from "../../utils/i18n";

// export interface ProductGridContainerProps extends ProductGridContent {
//   categories: Category[];
//   products: Product[];
//   totalProducts?: number;
//   lang: Language;
//   initialPage?: number;
//   initialCategory?: string;
//   initialSort?: ProductGridSortId;
// }

// const PRODUCT_GRID_SORT_OPTIONS = [
//   { id: "newest", name: { zh: "最新上架", en: "Newest" } },
//   { id: "price-asc", name: { zh: "价格从低到高", en: "Price Low-High" } },
//   { id: "price-desc", name: { zh: "价格从高到低", en: "Price High-Low" } },
//   { id: "sales", name: { zh: "销量优先", en: "Best Selling" } },
// ];

// export default function ProductGridContainer({
//   itemsPerPage: defaultItemsPerPage = 12,
//   category,
//   categories = [],
//   products: initialProducts = [],
//   totalProducts: initialTotal = 0,
//   lang,
//   initialPage = 1,
//   initialCategory: serverInitialCategory,
//   initialSort = "newest",
// }: ProductGridContainerProps) {
//   const currentItemsPerPage = defaultItemsPerPage || 12;
//   const initialCategory = serverInitialCategory || (category && category !== "all" ? category : "all");
//   const currency = useStore($currency);
//   const rates = useStore($rates);
//   const [hasMounted, setHasMounted] = useState(false);
//   const t = createTranslate(lang);

//   useEffect(() => setHasMounted(true), []);

//   const {
//     selectedCategory,
//     sortBy,
//     currentPage,
//     displayedProducts,
//     totalCount,
//     isLoading,
//     setSelectedCategory,
//     setSortBy,
//     setCurrentPage,
//   } = useProductGrid<Product>({
//     initialProducts,
//     initialTotal,
//     initialPage,
//     initialCategory,
//     initialSort,
//     itemsPerPage: currentItemsPerPage,
//     syncUrl: true,
//     fetchProducts: (query, options) => api.getProducts(query as any, options),
//   });

//   // 1. Map category options
//   const categoryOptions = [
//     {
//       id: "all",
//       label: lang === "zh" ? "全部" : "All",
//       selected: selectedCategory === "all",
//     },
//     ...categories.map((cat) => ({
//       id: cat.id,
//       label: t(cat.name),
//       selected: selectedCategory === cat.id,
//     })),
//   ];

//   // 2. Map sort options
//   const sortOptions = PRODUCT_GRID_SORT_OPTIONS.map((option) => ({
//     id: option.id as any,
//     label: t(option.name),
//     selected: sortBy === option.id,
//   }));

//   // 3. Map product items to include raw product and formatting tools
//   const mappedProducts = displayedProducts.map((product) => ({
//     id: String(product.id),
//     product,
//     lang,
//     formatPriceText: (price?: number) => hasMounted
//       ? formatPrice(price, currency, rates)
//       : formatPrice(price),
//   }));

//   // 4. Resolve multi-language labels
//   const labels = {
//     loading: lang === "zh" ? "正在为您加载商品..." : "Loading products...",
//     empty: lang === "zh" ? "暂无商品" : "No products available",
//     total: lang === "zh" ? `共 ${totalCount} 件商品` : `${totalCount} products total`,
//   };

//   return (
//     <ProductGridView
//       categories={categoryOptions}
//       sortOptions={sortOptions}
//       products={mappedProducts}
//       labels={labels}
//       totalCount={totalCount}
//       totalPages={Math.ceil(totalCount / currentItemsPerPage)}
//       currentPage={currentPage}
//       selectedCategory={selectedCategory}
//       sortBy={sortBy as any}
//       isLoading={isLoading}
//       onCategoryChange={setSelectedCategory}
//       onSortChange={setSortBy as any}
//       onPageChange={setCurrentPage}
//     />
//   );
// }
