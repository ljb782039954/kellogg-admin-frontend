export const pageKeys = {
  all: ['pages'] as const,
  lists: () => [...pageKeys.all, 'list'] as const,
  list: () => [...pageKeys.lists()] as const,
  details: () => [...pageKeys.all, 'detail'] as const,
  detail: (id: string) => [...pageKeys.details(), id] as const,
};
