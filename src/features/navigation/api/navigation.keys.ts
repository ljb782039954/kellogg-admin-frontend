export const navigationKeys = {
  all: ['navigation'] as const,
  header: () => [...navigationKeys.all, 'header'] as const,
  pages: () => [...navigationKeys.all, 'pages'] as const,
};
