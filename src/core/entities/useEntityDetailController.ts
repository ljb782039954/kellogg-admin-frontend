import { useQuery } from '@tanstack/react-query';
import type { EntityDetailCacheKeys } from './cache';

export interface EntityDetailControllerOptions<Model, Id> {
  id: Id | undefined;
  enabled: boolean;
  keys: EntityDetailCacheKeys<Id>;
  load(id: Id): Promise<Model>;
}

export function useEntityDetailController<Model, Id>({
  id,
  enabled,
  keys,
  load,
}: EntityDetailControllerOptions<Model, Id>) {
  const query = useQuery({
    queryKey: keys.detail(id as Id),
    queryFn: () => load(id as Id),
    enabled,
  });

  return {
    model: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    retry: query.refetch,
  };
}
