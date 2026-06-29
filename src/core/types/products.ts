import type { Translation } from "./common";

// ============================================
// 商品与分类 (D1 关系型数据)
// ============================================

export interface Category {
  id: string;
  name: Translation;
  image?: string;
}

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

// 用于 api 接口

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
  custom_fields?: { name_zh: string; name_en: string; value_zh: string; value_en: string }[];
  sort_order?: number;
  is_active?: boolean;
}

export interface CategoryInput {
  id: string;
  name_zh: string;
  name_en: string;
  image?: string;
  sort_order?: number;
}
