import { useQuery } from '@tanstack/react-query';
import type { Category } from '@/package/types';
import { getCategories } from '../api/categories.api';
import { categoryKeys } from '../api/categories.keys';

export function useCategoriesQuery(): {
  categories: Category[];
  isLoading: boolean;
  error: Error | null;
} {
  const query = useQuery({
    queryKey: categoryKeys.list(),
    queryFn: getCategories,
  });

  return {
    categories: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
}
