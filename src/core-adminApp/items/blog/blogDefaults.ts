import type { BlogInput } from '@/cms/types';

export function createEmptyBlogInput(): BlogInput {
  return {
    slug: '',
    title_zh: '',
    title_en: '',
    summary_zh: '',
    summary_en: '',
    content_zh: '',
    content_en: '',
    cover_image: '',
    category: '',
    tags: [],
    author: 'Admin',
    status: 'draft',
    seo_title_zh: '',
    seo_title_en: '',
    seo_desc_zh: '',
    seo_desc_en: '',
    publish_date: '',
  };
}
