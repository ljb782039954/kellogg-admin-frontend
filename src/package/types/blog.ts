export interface Blog {
  id: number;
  slug: string;
  title_zh: string;
  title_en: string;
  summary_zh: string | null;
  summary_en: string | null;
  content_zh: string;
  content_en: string;
  cover_image: string | null;
  category: string | null;
  tags: string[];
  author: string;
  status: 'draft' | 'published' | 'archived';
  seo_title_zh: string | null;
  seo_title_en: string | null;
  seo_desc_zh: string | null;
  seo_desc_en: string | null;
  publish_date: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
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
  status?: 'draft' | 'published' | 'archived';
  seo_title_zh?: string;
  seo_title_en?: string;
  seo_desc_zh?: string;
  seo_desc_en?: string;
  publish_date?: string;
}

export interface BlogsQuery {
  page?: number;
  pageSize?: number;
  status?: string;
  category?: string;
  search?: string;
  sort?: string;
}

export interface PaginatedBlogs {
  data: Blog[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export type BlogStatusFilter = 'all' | 'draft' | 'published' | 'archived';
