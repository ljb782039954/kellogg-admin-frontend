export const mediaKeys = {
  all: ['media'] as const,
  lists: () => [...mediaKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...mediaKeys.lists(), filters] as const,
};
