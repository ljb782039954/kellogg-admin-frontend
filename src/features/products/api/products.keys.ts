import { createEntityQueryKeys } from '@/core/entities';

export const productKeys = createEntityQueryKeys<
  'products',
  number,
  Record<string, unknown>
>('products');
