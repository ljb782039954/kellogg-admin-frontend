import { describe, expect, it } from 'vitest';
import { createDefaultProduct } from './product.defaults';
import { productSchema } from './product.schema';

describe('product schema', () => {
  it('accepts the product defaults', () => {
    expect(productSchema.parse(createDefaultProduct())).toEqual(createDefaultProduct());
  });

  it('accepts bulk prices, colors, sizes, and custom fields', () => {
    const result = productSchema.safeParse(createDefaultProduct({
      bulkPrices: [{ minQty: 10, maxQty: 20, price: 80 }],
      sizes: [{ name: 'M', image: '/m.jpg' }],
      colors: [{ name: { zh: '红', en: 'Red' }, image: '/red.jpg' }],
      customFields: [{
        name: { zh: '材质', en: 'Material' },
        value: { zh: '棉', en: 'Cotton' },
      }],
    }));

    expect(result.success).toBe(true);
  });

  it.each([
    { price: -1 },
    { rating: 6 },
    { rating: -1 },
    { sales: -1 },
  ])('rejects invalid numeric values: %o', (patch) => {
    expect(productSchema.safeParse(createDefaultProduct(patch)).success).toBe(false);
  });

  it('applies defaults for omitted collection fields', () => {
    const parsed = productSchema.parse({
      id: 1,
      name: { zh: '产品', en: 'Product' },
      price: 10,
    });

    expect(parsed).toMatchObject({
      bulkPrices: [],
      images: [],
      sizes: [],
      colors: [],
      videos: [],
      customFields: [],
      rating: 5,
      sales: 0,
      isFeatured: false,
      isActive: true,
    });
  });
});
