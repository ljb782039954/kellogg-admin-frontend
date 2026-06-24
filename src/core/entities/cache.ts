import type { QueryClient, QueryKey } from '@tanstack/react-query';

export interface EntityListCacheKeys {
  lists(): QueryKey;
}

export interface EntityDetailCacheKeys<Id> {
  detail(id: Id): QueryKey;
}

export type EntityCacheKeys<Id> =
  EntityListCacheKeys &
  EntityDetailCacheKeys<Id>;

export function invalidateEntityLists(
  queryClient: QueryClient,
  keys: EntityListCacheKeys,
) {
  return queryClient.invalidateQueries({ queryKey: keys.lists() });
}

export function invalidateEntityDetail<Id>(
  queryClient: QueryClient,
  keys: EntityDetailCacheKeys<Id>,
  id: Id,
) {
  return queryClient.invalidateQueries({ queryKey: keys.detail(id) });
}

export function setEntityDetail<Model, Id>(
  queryClient: QueryClient,
  keys: EntityDetailCacheKeys<Id>,
  id: Id,
  model: Model,
): void {
  queryClient.setQueryData(keys.detail(id), model);
}

export function updateEntityDetail<Model, Id>(
  queryClient: QueryClient,
  keys: EntityDetailCacheKeys<Id>,
  id: Id,
  update: (current: Model | undefined) => Model | undefined,
): void {
  queryClient.setQueryData<Model | undefined>(keys.detail(id), update);
}
