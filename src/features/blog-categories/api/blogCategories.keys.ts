export const blogCategoryKeys = {
  all: ['blogCategories'] as const,
  lists: () => [...blogCategoryKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...blogCategoryKeys.lists(), filters] as const,
};
