import type { Blog, BlogInput } from '@/package/types';
import { blogSchema, type BlogFormValues } from './blog.schema';
import { createDefaultBlog } from './blog.defaults';

export { blogSchema };
export type { BlogFormValues };

export function toBlogInput(form: BlogFormValues): BlogInput {
  return {
    slug: form.slug,
    title_zh: form.title.zh,
    title_en: form.title.en,
    summary_zh: form.summary.zh || undefined,
    summary_en: form.summary.en || undefined,
    content_zh: form.content.zh || undefined,
    content_en: form.content.en || undefined,
    cover_image: form.coverImage || undefined,
    category: form.category || undefined,
    tags: form.tags.length > 0 ? form.tags : undefined,
    author: form.author || undefined,
    status: form.status,
    seo_title_zh: form.seoTitle.zh || undefined,
    seo_title_en: form.seoTitle.en || undefined,
    seo_desc_zh: form.seoDesc.zh || undefined,
    seo_desc_en: form.seoDesc.en || undefined,
    publish_date: form.publishDate || undefined,
  };
}

export function fromBlogResponse(blog: Blog | null | undefined): BlogFormValues {
  if (!blog) return createDefaultBlog();

  return blogSchema.parse({
    id: blog.id,
    slug: blog.slug,
    title: { zh: blog.title_zh ?? '', en: blog.title_en ?? '' },
    summary: { zh: blog.summary_zh ?? '', en: blog.summary_en ?? '' },
    content: { zh: blog.content_zh ?? '', en: blog.content_en ?? '' },
    coverImage: blog.cover_image ?? '',
    category: blog.category ?? '',
    tags: blog.tags ?? [],
    author: blog.author ?? 'Admin',
    status: blog.status ?? 'draft',
    seoTitle: { zh: blog.seo_title_zh ?? '', en: blog.seo_title_en ?? '' },
    seoDesc: { zh: blog.seo_desc_zh ?? '', en: blog.seo_desc_en ?? '' },
    publishDate: blog.publish_date ?? '',
  });
}

export function toBlogFormValues(
  input: Partial<BlogFormValues> | null | undefined,
): BlogFormValues {
  return blogSchema.parse({
    ...createDefaultBlog(),
    ...input,
    title: { zh: '', en: '', ...input?.title },
    summary: { zh: '', en: '', ...input?.summary },
    content: { zh: '', en: '', ...input?.content },
    seoTitle: { zh: '', en: '', ...input?.seoTitle },
    seoDesc: { zh: '', en: '', ...input?.seoDesc },
  });
}
