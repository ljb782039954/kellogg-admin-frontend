import type { Translation } from '@/shared/i18n/translation';

export interface SortOption {
  id: string;
  name: Translation;
}

export interface BulkPrice {
  minQty: number;
  maxQty: number | null;
  price: number;
}

export interface Product {
  id: number;
  name: Translation;
  price: number;
  originalPrice?: number;
  bulkPrices?: BulkPrice[];
  image: string;
  images: string[];
  rating: number;
  sales: number;
  tag?: Translation;
  category?: string;
  releaseDate?: string;
  description?: Translation;
  isFeatured: boolean;
  fabric?: Translation;
  notes?: Translation;
  isActive: boolean;
  sizes?: { name: string; image?: string }[];
  colors?: { name: Translation; image?: string }[];
  videos?: string[];
  customFields?: { name: Translation; value: Translation }[];
}

export interface ProductInput {
  name_zh: string;
  name_en: string;
  price: number;
  original_price?: number;
  bulk_prices?: BulkPrice[];
  category_id?: string;
  rating?: number;
  sales?: number;
  tag_zh?: string;
  tag_en?: string;
  description_zh?: string;
  description_en?: string;
  release_date?: string;
  is_featured?: boolean;
  image?: string;
  images?: string[];
  fabric_zh?: string;
  fabric_en?: string;
  notes_zh?: string;
  notes_en?: string;
  sizes?: { name: string; image?: string }[];
  colors?: { name_zh: string; name_en: string; image?: string }[];
  videos?: string[];
  custom_fields?: {
    name_zh: string;
    name_en: string;
    value_zh: string;
    value_en: string;
  }[];
  sort_order?: number;
  is_active?: boolean;
}

export interface ProductsQuery {
  page?: number;
  pageSize?: number;
  category?: string;
  featured?: boolean;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'sales';
  search?: string;
}

export interface PaginatedProducts {
  data: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
