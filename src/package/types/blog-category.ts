export interface BlogCategory {
  id: number;
  name_zh: string;
  name_en: string;
  slug: string;
  sort_order: number;
  created_at: string;
  article_count?: number;
}

export interface BlogCategoryInput {
  name_zh: string;
  name_en: string;
  slug?: string;
  sort_order?: number;
}
