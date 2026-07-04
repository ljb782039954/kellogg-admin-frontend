import type { Category, CategoryInput, Product, ProductInput } from '@/cms/types';

export function normalizeProductImages(product: Product): Product {
  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  return {
    ...product,
    images,
    image: images[0] || '',
  };
}

export function mapProductToInput(product: Product): ProductInput {
  return {
    name_zh: product.name.zh,
    name_en: product.name.en,
    price: product.price,
    original_price: product.originalPrice,
    bulk_prices: product.bulkPrices,
    category_id: product.category,
    rating: product.rating,
    sales: product.sales,
    tag_zh: product.tag?.zh,
    tag_en: product.tag?.en,
    description_zh: product.description?.zh,
    description_en: product.description?.en,
    release_date: product.releaseDate,
    is_featured: product.isFeatured,
    image: product.image,
    images: product.images,
    fabric_zh: product.fabric?.zh,
    fabric_en: product.fabric?.en,
    notes_zh: product.notes?.zh,
    notes_en: product.notes?.en,
    is_active: product.isActive,
    sizes: product.sizes,
    colors: product.colors?.map(color => ({
      name_zh: color.name.zh,
      name_en: color.name.en,
      image: color.image,
    })),
    videos: product.videos,
    custom_fields: product.customFields?.map(field => ({
      name_zh: field.name.zh,
      name_en: field.name.en,
      value_zh: field.value.zh,
      value_en: field.value.en,
    })),
  };
}

export function hasProductChanges(localProduct: Product, remoteProduct: Product): boolean {
  return (
    JSON.stringify(localProduct.name) !== JSON.stringify(remoteProduct.name)
    || localProduct.price !== remoteProduct.price
    || localProduct.originalPrice !== remoteProduct.originalPrice
    || JSON.stringify(localProduct.bulkPrices) !== JSON.stringify(remoteProduct.bulkPrices)
    || localProduct.category !== remoteProduct.category
    || localProduct.rating !== remoteProduct.rating
    || localProduct.sales !== remoteProduct.sales
    || JSON.stringify(localProduct.tag) !== JSON.stringify(remoteProduct.tag)
    || JSON.stringify(localProduct.description) !== JSON.stringify(remoteProduct.description)
    || localProduct.releaseDate !== remoteProduct.releaseDate
    || localProduct.isFeatured !== remoteProduct.isFeatured
    || localProduct.image !== remoteProduct.image
    || JSON.stringify(localProduct.images) !== JSON.stringify(remoteProduct.images)
    || JSON.stringify(localProduct.fabric) !== JSON.stringify(remoteProduct.fabric)
    || JSON.stringify(localProduct.notes) !== JSON.stringify(remoteProduct.notes)
    || localProduct.isActive !== remoteProduct.isActive
    || JSON.stringify(localProduct.sizes) !== JSON.stringify(remoteProduct.sizes)
    || JSON.stringify(localProduct.colors) !== JSON.stringify(remoteProduct.colors)
    || JSON.stringify(localProduct.videos) !== JSON.stringify(remoteProduct.videos)
    || JSON.stringify(localProduct.customFields) !== JSON.stringify(remoteProduct.customFields)
  );
}

export function createDraftProduct(products: Product[], categories: Category[]): Product {
  const newId = Math.max(...products.map(product => product.id), 0) + 1;

  return {
    id: newId,
    name: { zh: '新产品', en: 'New Product' },
    price: 0,
    bulkPrices: [],
    image: '',
    images: [],
    rating: 5,
    sales: 0,
    category: categories.length > 0 ? categories[0].id : '',
    releaseDate: new Date().toISOString().split('T')[0],
    tag: { zh: '', en: '' },
    isFeatured: false,
    isActive: true,
    customFields: [],
  };
}

export function updateProductField<K extends keyof Product>(
  product: Product,
  field: K,
  value: Product[K]
): Product {
  const updated = { ...product, [field]: value };

  if (field === 'images' && Array.isArray(value)) {
    updated.image = value.length > 0 ? value[0] as string : '';
  }

  return updated;
}

export function mapCategoryToInput(category: Category): CategoryInput {
  return {
    id: category.id,
    name_zh: category.name.zh,
    name_en: category.name.en,
    image: category.image,
  };
}

export function hasCategoryChanges(localCategory: Category, remoteCategory: Category): boolean {
  return (
    localCategory.name.zh !== remoteCategory.name.zh
    || localCategory.name.en !== remoteCategory.name.en
    || localCategory.image !== remoteCategory.image
  );
}

export function createDraftCategory(): Category {
  return {
    id: `cat_${Date.now()}`,
    name: { zh: '新分类', en: 'New Category' },
    image: '',
  };
}
