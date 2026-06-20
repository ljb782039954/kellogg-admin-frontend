import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../api/products.api';
import { productKeys } from '../api/products.keys';

export function useProductsSummary(): {
  total: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<unknown>;
} {
  const query = useQuery({
    queryKey: productKeys.list({ pageSize: 1 }),
    queryFn: () => getProducts({ pageSize: 1 }),
  });

  return {
    total: query.data?.total ?? 0,
    isLoading: query.isLoading,
    error: query.error,
    refetch: () => query.refetch(),
  };
}
