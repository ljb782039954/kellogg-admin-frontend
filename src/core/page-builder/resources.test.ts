import { describe, expect, it } from 'vitest';
import { combinePageBuilderResources } from './resources';

describe('combinePageBuilderResources', () => {
  it('combines project resource data and loading state', () => {
    const result = combinePageBuilderResources(
      [
        { data: ['category'], isLoading: false, error: null },
        { data: ['product'], isLoading: true, error: null },
      ] as const,
      ([categories, products]) => ({
        categories: categories.data,
        products: products.data,
      }),
    );

    expect(result).toEqual({
      resources: {
        categories: ['category'],
        products: ['product'],
      },
      isLoading: true,
      error: null,
    });
  });

  it('returns the first resource error message', () => {
    const result = combinePageBuilderResources(
      [
        { data: [], isLoading: false, error: null },
        { data: [], isLoading: false, error: new Error('products failed') },
        { data: [], isLoading: false, error: 'pages failed' },
      ] as const,
      () => ({}),
    );

    expect(result.error).toBe('products failed');
  });
});
