import { combinePageBuilderResources } from '@/core/page-builder';
import { useCategoriesQuery } from '@/features/categories';
import { useProductPreviewData } from '@/features/products';
import { usePageOptions } from '@/features/pages';
import type { Category, Product } from '@/package/types';
import type { PageOption } from '@/package/types';

export interface PropertyEditorResources {
  categories: Category[];
  products: Product[];
  pages: PageOption[];
  isLoading: boolean;
  error: string | null;
}

export function usePageBuilderResources(): PropertyEditorResources {
  const categories = useCategoriesQuery();
  const products = useProductPreviewData();
  const pages = usePageOptions();

  const state = combinePageBuilderResources(
    [
      {
        data: categories.categories,
        isLoading: categories.isLoading,
        error: categories.error,
      },
      {
        data: products.products,
        isLoading: products.isLoading,
        error: products.error,
      },
      {
        data: pages.pages,
        isLoading: pages.isLoading,
        error: pages.error,
      },
    ] as const,
    ([categoryState, productState, pageState]) => ({
      categories: categoryState.data,
      products: productState.data,
      pages: pageState.data,
    }),
  );

  return {
    ...state.resources,
    isLoading: state.isLoading,
    error: state.error,
  };
}
