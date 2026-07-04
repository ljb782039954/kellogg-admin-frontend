export type BlogStatus = "draft" | "published" | "archived";


// ============================================
// Blog types (frontend)
// ============================================

export interface BlogSummary {
  id: number;
  slug: string;
  title_zh: string;
  title_en: string;
  summary_zh: string | null;
  summary_en: string | null;
  cover_image: string | null;
  category: string | null;
  tags: string[];
  author: string;
  status: BlogStatus;
  publish_date: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface Blog extends BlogSummary {
  content_zh: string;
  content_en: string;
  seo_title_zh: string | null;
  seo_title_en: string | null;
  seo_desc_zh: string | null;
  seo_desc_en: string | null;
}


export interface BlogInput {
  slug: string;
  title_zh: string;
  title_en: string;
  summary_zh?: string;
  summary_en?: string;
  content_zh?: string;
  content_en?: string;
  cover_image?: string;
  category?: string;
  tags?: string[];
  author?: string;
  status?: BlogStatus ;
  seo_title_zh?: string;
  seo_title_en?: string;
  seo_desc_zh?: string;
  seo_desc_en?: string;
  publish_date?: string;
}


export interface BlogCategory {
  id: number;
  name_zh: string;
  name_en: string;
  slug: string;
  sort_order: number;
  created_at: string;
  article_count?: number;
}

