import { createEntityQueryKeys } from '@/core/entities';

export const blogKeys = createEntityQueryKeys<
  'blogs',
  number,
  Record<string, unknown>
>('blogs');
