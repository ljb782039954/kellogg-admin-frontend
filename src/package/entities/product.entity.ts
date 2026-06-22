import type { EntityDefinition } from '@/core/contracts';
import { productAdapter } from '@/package/adapters/product.adapter';
import type { Product, ProductInput, ProductsQuery } from '@/package/types';

export const productEntity: EntityDefinition<
  Product,
  Product,
  ProductInput,
  ProductsQuery
> = {
  key: 'products',
  endpoint: '/api/products',
  adapter: productAdapter,
  capabilities: { list: true, create: true, update: true, delete: true },
  defaultFilters: { page: 1, pageSize: 20 },
  screens: { list: 'products', editor: 'products' },
};
