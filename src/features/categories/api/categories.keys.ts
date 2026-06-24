import { createEntityQueryKeys } from '@/core/entities';

const entityKeys = createEntityQueryKeys<'categories', string>('categories');

export const categoryKeys = {
  ...entityKeys,
  list: entityKeys.lists,
};
