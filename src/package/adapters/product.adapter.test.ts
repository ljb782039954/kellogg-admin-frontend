import { describe, expect, it } from 'vitest';
import { productAdapter } from './product.adapter';
import type { Product } from '@/package/types';

const product: Product = {
  id: 12,
  name: { zh: '连衣裙', en: 'Dress' },
  price: 99,
  originalPrice: 129,
  bulkPrices: [{ minQty: 10, maxQty: null, price: 80 }],
  image: '/cover.jpg',
  images: ['/cover.jpg'],
  rating: 5,
  sales: 20,
  tag: { zh: '新品', en: 'New' },
  category: 'dresses',
  releaseDate: '2026-06-22',
  description: { zh: '描述', en: 'Description' },
  isFeatured: true,
  fabric: { zh: '棉', en: 'Cotton' },
  notes: { zh: '备注', en: 'Notes' },
  isActive: true,
  sizes: [{ name: 'M' }],
  colors: [{ name: { zh: '黑', en: 'Black' } }],
  videos: [],
  customFields: [
    {
      name: { zh: '产地', en: 'Origin' },
      value: { zh: '中国', en: 'China' },
    },
  ],
};

describe('productAdapter', () => {
  it('API DTO 与领域模型同形', () => {
    expect(productAdapter.fromDto(product)).toBe(product);
  });

  it('将领域字段映射为 API 输入字段', () => {
    expect(productAdapter.toInput(product)).toMatchObject({
      name_zh: '连衣裙',
      name_en: 'Dress',
      original_price: 129,
      category_id: 'dresses',
      is_featured: true,
      is_active: true,
      colors: [{ name_zh: '黑', name_en: 'Black', image: undefined }],
      custom_fields: [
        {
          name_zh: '产地',
          name_en: 'Origin',
          value_zh: '中国',
          value_en: 'China',
        },
      ],
    });
  });

  it('请求体保持输入引用', () => {
    const input = productAdapter.toInput(product);
    expect(productAdapter.toRequest(input)).toBe(input);
  });
});
