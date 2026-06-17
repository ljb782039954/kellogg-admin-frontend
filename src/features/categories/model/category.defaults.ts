import { nanoid } from 'nanoid';
import type { Category } from '@/types';

export function createDefaultCategory(): Category {
  return {
    id: `cat_${nanoid(8)}`,
    name: { zh: '新分类', en: 'New Category' },
    image: '',
  };
}
