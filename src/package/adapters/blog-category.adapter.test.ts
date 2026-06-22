import { describe, expect, it } from 'vitest';
import { blogCategoryAdapter } from './blog-category.adapter';
import type { BlogCategory } from '@/package/types';

const category: BlogCategory = {
  id: 3,
  name_zh: '行业资讯',
  name_en: 'Industry News',
  slug: 'industry-news',
  sort_order: 4,
  created_at: '2026-06-22T00:00:00Z',
  article_count: 2,
};

describe('blogCategoryAdapter', () => {
  it('API DTO 与领域模型同形', () => {
    expect(blogCategoryAdapter.fromDto(category)).toBe(category);
  });

  it('转换为可提交输入并排除服务端字段', () => {
    expect(blogCategoryAdapter.toInput(category)).toEqual({
      name_zh: '行业资讯',
      name_en: 'Industry News',
      slug: 'industry-news',
      sort_order: 4,
    });
  });

  it('请求体保持输入引用', () => {
    const input = blogCategoryAdapter.toInput(category);
    expect(blogCategoryAdapter.toRequest(input)).toBe(input);
  });
});
