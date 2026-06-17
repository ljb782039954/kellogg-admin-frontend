import { describe, expect, it } from 'vitest';
import type { Product } from '@/types';
import {
  fromProductResponse,
  toCreateProductInput,
  toProductFormValues,
} from './product.mapper';
import { createDefaultProduct } from './product.defaults';

describe('product mapper', () => {
  it('fills missing fields with defaults', () => {
    const form = toProductFormValues({
      name: { zh: '测试', en: 'Test' },
      price: 99,
    });

    expect(form.name).toEqual({ zh: '测试', en: 'Test' });
    expect(form.price).toBe(99);
    expect(form.isActive).toBe(true);
    expect(form.bulkPrices).toEqual([]);
    expect(form.customFields).toEqual([]);
  });

  it('converts form values to create input with snake_case keys', () => {
    const form = createDefaultProduct({
      name: { zh: '产品', en: 'Product' },
      price: 100,
      category: 'cat_1',
      isFeatured: true,
      isActive: true,
      colors: [{ name: { zh: '红色', en: 'Red' }, image: '' }],
    });

    const input = toCreateProductInput(form);

    expect(input.name_zh).toBe('产品');
    expect(input.name_en).toBe('Product');
    expect(input.price).toBe(100);
    expect(input.category_id).toBe('cat_1');
    expect(input.is_featured).toBe(true);
    expect(input.colors).toEqual([
      { name_zh: '红色', name_en: 'Red', image: '' },
    ]);
  });

  it('strips empty optional translation fields from input', () => {
    const form = createDefaultProduct({
      name: { zh: '产品', en: 'Product' },
      price: 50,
      tag: { zh: '', en: '' },
      description: { zh: '', en: '' },
    });

    const input = toCreateProductInput(form);

    expect(input.tag_zh).toBeUndefined();
    expect(input.description_zh).toBeUndefined();
  });

  it('converts a full Product API response to form values', () => {
    const apiProduct: Product = {
      id: 42,
      name: { zh: '经典款', en: 'Classic' },
      price: 199,
      originalPrice: 299,
      bulkPrices: [{ minQty: 10, maxQty: null, price: 150 }],
      image: '/img.jpg',
      images: ['/img.jpg', '/img2.jpg'],
      rating: 4.5,
      sales: 100,
      tag: { zh: '热卖', en: 'Hot' },
      category: 'cat_1',
      releaseDate: '2026-06-01',
      isFeatured: true,
      fabric: { zh: '棉', en: 'Cotton' },
      notes: { zh: '小心洗涤', en: 'Careful wash' },
      isActive: true,
      sizes: [{ name: 'L', image: '/size-l.jpg' }],
      colors: [{ name: { zh: '蓝色', en: 'Blue' }, image: '/blue.jpg' }],
      videos: ['https://youtube.com/v'],
      customFields: [
        { name: { zh: '工艺', en: 'Craft' }, value: { zh: '手工', en: 'Handmade' } },
      ],
    };

    const form = fromProductResponse(apiProduct);

    expect(form.id).toBe(42);
    expect(form.name).toEqual({ zh: '经典款', en: 'Classic' });
    expect(form.price).toBe(199);
    expect(form.originalPrice).toBe(299);
    expect(form.bulkPrices).toHaveLength(1);
    expect(form.image).toBe('/img.jpg');
    expect(form.images).toEqual(['/img.jpg', '/img2.jpg']);
    expect(form.rating).toBe(4.5);
    expect(form.sales).toBe(100);
    expect(form.tag).toEqual({ zh: '热卖', en: 'Hot' });
    expect(form.category).toBe('cat_1');
    expect(form.releaseDate).toBe('2026-06-01');
    expect(form.isFeatured).toBe(true);
    expect(form.fabric).toEqual({ zh: '棉', en: 'Cotton' });
    expect(form.notes).toEqual({ zh: '小心洗涤', en: 'Careful wash' });
    expect(form.isActive).toBe(true);
    expect(form.sizes).toEqual([{ name: 'L', image: '/size-l.jpg' }]);
    expect(form.colors).toEqual([{ name: { zh: '蓝色', en: 'Blue' }, image: '/blue.jpg' }]);
    expect(form.videos).toEqual(['https://youtube.com/v']);
    expect(form.customFields).toEqual([
      { name: { zh: '工艺', en: 'Craft' }, value: { zh: '手工', en: 'Handmade' } },
    ]);
  });

  it('handles null/undefined API response', () => {
    const form = fromProductResponse(null);
    expect(form.id).toBe(0);
    expect(form.name).toEqual({ zh: '新产品', en: 'New Product' });
    expect(form.isActive).toBe(true);
  });
});
