import type { Blog } from '@/core/types';

export type BlogStatusFilter = 'all' | 'draft' | 'published' | 'archived';

export function filterBlogsBySearch(blogs: Blog[], searchTerm: string): Blog[] {
  const query = searchTerm.trim().toLowerCase();

  if (!query) return blogs;

  return blogs.filter(blog => (
    blog.title_zh.toLowerCase().includes(query)
    || blog.title_en.toLowerCase().includes(query)
    || (blog.category || '').toLowerCase().includes(query)
  ));
}

export function getNextBlogPublishStatus(status: Blog['status']): 'draft' | 'published' {
  return status === 'published' ? 'draft' : 'published';
}
