import { useQuery } from '@tanstack/react-query';
import type { Product } from '@/package/types';
import { getProducts } from '../api/products.api';
import { productKeys } from '../api/products.keys';

export function useProductPreviewData(): {
  products: Product[];
  isLoading: boolean;
  error: Error | null;
} {
  const query = useQuery({
    queryKey: productKeys.list({ pageSize: 20 }),
    queryFn: () => getProducts({ pageSize: 20 }),
  });

  return {
    products: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
}
