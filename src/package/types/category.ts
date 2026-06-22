import type { Translation } from '@/shared/i18n/translation';

export interface Category {
  id: string;
  name: Translation;
  image?: string;
}

export interface CategoryInput {
  id: string;
  name_zh: string;
  name_en: string;
  image?: string;
  sort_order?: number;
}
