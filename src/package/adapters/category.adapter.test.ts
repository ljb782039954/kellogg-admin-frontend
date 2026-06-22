import { describe, expect, it } from 'vitest';
import { categoryAdapter } from './category.adapter';
import type { Category } from '@/package/types';

const category: Category = {
  id: 'dresses',
  name: { zh: '连衣裙', en: 'Dresses' },
  image: '',
};

describe('categoryAdapter', () => {
  it('API DTO 与领域模型同形', () => {
    expect(categoryAdapter.fromDto(category)).toBe(category);
  });

  it('将 Translation 映射为 API 输入字段', () => {
    expect(categoryAdapter.toInput(category)).toEqual({
      id: 'dresses',
      name_zh: '连衣裙',
      name_en: 'Dresses',
      image: undefined,
    });
  });

  it('请求体保持输入引用', () => {
    const input = categoryAdapter.toInput(category);
    expect(categoryAdapter.toRequest(input)).toBe(input);
  });
});
