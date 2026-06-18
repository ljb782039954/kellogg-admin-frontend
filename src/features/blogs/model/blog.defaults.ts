import type { BlogFormValues } from './blog.schema';

export function createDefaultBlog(overrides?: Partial<BlogFormValues>): BlogFormValues {
  const today = new Date().toISOString().split('T')[0];
  return {
    id: 0,
    slug: '',
    title: { zh: '', en: '' },
    summary: { zh: '', en: '' },
    content: { zh: '', en: '' },
    coverImage: '',
    category: '',
    tags: [],
    author: 'Admin',
    status: 'draft',
    seoTitle: { zh: '', en: '' },
    seoDesc: { zh: '', en: '' },
    publishDate: today,
    ...overrides,
  };
}
