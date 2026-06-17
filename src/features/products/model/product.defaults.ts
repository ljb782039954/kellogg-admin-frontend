import type { ProductFormValues } from './product.schema';

export function createDefaultProduct(
  overrides?: Partial<ProductFormValues>,
): ProductFormValues {
  return {
    id: 0,
    name: { zh: '新产品', en: 'New Product' },
    price: 0,
    bulkPrices: [],
    image: '',
    images: [],
    rating: 5,
    sales: 0,
    isFeatured: false,
    isActive: true,
    sizes: [],
    colors: [],
    videos: [],
    customFields: [],
    ...overrides,
  };
}
