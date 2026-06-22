import { describe, expect, it } from 'vitest';
import { blogAdapter } from './blog.adapter';
import type { Blog } from '@/package/types';

const blog: Blog = {
  id: 8,
  slug: 'fabric-guide',
  title_zh: '面料指南',
  title_en: 'Fabric Guide',
  summary_zh: null,
  summary_en: 'Summary',
  content_zh: '',
  content_en: 'Content',
  cover_image: null,
  category: 'Fabric Guide',
  tags: ['fabric'],
  author: 'Admin',
  status: 'published',
  seo_title_zh: null,
  seo_title_en: 'Fabric SEO',
  seo_desc_zh: null,
  seo_desc_en: 'Description',
  publish_date: null,
  view_count: 42,
  created_at: '2026-06-22T00:00:00Z',
  updated_at: '2026-06-22T00:00:00Z',
};

describe('blogAdapter', () => {
  it('API DTO 与领域模型同形', () => {
    expect(blogAdapter.fromDto(blog)).toBe(blog);
  });

  it('转换为提交输入并归一化 nullable 字段', () => {
    expect(blogAdapter.toInput(blog)).toEqual({
      slug: 'fabric-guide',
      title_zh: '面料指南',
      title_en: 'Fabric Guide',
      summary_zh: undefined,
      summary_en: 'Summary',
      content_zh: undefined,
      content_en: 'Content',
      cover_image: undefined,
      category: 'Fabric Guide',
      tags: ['fabric'],
      author: 'Admin',
      status: 'published',
      seo_title_zh: undefined,
      seo_title_en: 'Fabric SEO',
      seo_desc_zh: undefined,
      seo_desc_en: 'Description',
      publish_date: undefined,
    });
  });

  it('请求体保持输入引用', () => {
    const input = blogAdapter.toInput(blog);
    expect(blogAdapter.toRequest(input)).toBe(input);
  });
});
