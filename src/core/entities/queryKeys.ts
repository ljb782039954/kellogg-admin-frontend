export function createEntityQueryKeys<
  const EntityKey extends string,
  Id extends string | number = string | number,
  Filters = Record<string, unknown>,
>(entityKey: EntityKey) {
  const all = [entityKey] as const;
  const lists = () => [...all, 'list'] as const;
  const details = () => [...all, 'detail'] as const;

  return {
    all,
    lists,
    list: (filters?: Filters) => [...lists(), filters] as const,
    details,
    detail: (id: Id) => [...details(), id] as const,
  };
}
