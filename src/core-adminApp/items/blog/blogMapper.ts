import type { Blog, BlogInput } from '@/cms/types';

export function mapBlogToInput(blog: Blog): BlogInput {
  return {
    slug: blog.slug,
    title_zh: blog.title_zh,
    title_en: blog.title_en,
    summary_zh: blog.summary_zh || '',
    summary_en: blog.summary_en || '',
    content_zh: blog.content_zh || '',
    content_en: blog.content_en || '',
    cover_image: blog.cover_image || '',
    category: blog.category || '',
    tags: blog.tags || [],
    author: blog.author || 'Admin',
    status: blog.status || 'draft',
    seo_title_zh: blog.seo_title_zh || '',
    seo_title_en: blog.seo_title_en || '',
    seo_desc_zh: blog.seo_desc_zh || '',
    seo_desc_en: blog.seo_desc_en || '',
    publish_date: blog.publish_date || '',
  };
}
