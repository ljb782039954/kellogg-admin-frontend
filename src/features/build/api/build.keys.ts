export const buildKeys = {
  all: ['build'] as const,
  status: () => [...buildKeys.all, 'status'] as const,
};
