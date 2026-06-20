import { useCategoriesQuery } from '@/features/categories';
import { useProductPreviewData } from '@/features/products';
import { usePageOptions } from '@/features/pages';
import type { PropertyEditorResources } from '@/features/page-builder';

export function usePropertyEditorResources(): PropertyEditorResources {
  const { categories, isLoading: catLoading, error: catError } = useCategoriesQuery();
  const { products, isLoading: prodLoading, error: prodError } = useProductPreviewData();
  const { pages, isLoading: pagesLoading, error: pagesError } = usePageOptions();

  return {
    categories,
    products,
    pages,
    isLoading: catLoading || prodLoading || pagesLoading,
    error: catError?.message ?? prodError?.message ?? pagesError?.message ?? null,
  };
}
