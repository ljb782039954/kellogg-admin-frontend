import type { EntityAdapter } from '@/core/contracts';
import type { Product, ProductInput } from '@/package/types';

export const productAdapter: EntityAdapter<Product, Product, ProductInput> = {
  fromDto(dto) {
    return dto;
  },
  toInput(model) {
    return {
      name_zh: model.name.zh,
      name_en: model.name.en,
      price: model.price,
      original_price: model.originalPrice,
      bulk_prices: model.bulkPrices,
      category_id: model.category,
      rating: model.rating,
      sales: model.sales,
      tag_zh: model.tag?.zh,
      tag_en: model.tag?.en,
      description_zh: model.description?.zh,
      description_en: model.description?.en,
      release_date: model.releaseDate,
      is_featured: model.isFeatured,
      image: model.image || undefined,
      images: model.images.length > 0 ? model.images : undefined,
      fabric_zh: model.fabric?.zh,
      fabric_en: model.fabric?.en,
      notes_zh: model.notes?.zh,
      notes_en: model.notes?.en,
      sizes: model.sizes,
      colors: model.colors?.map((color) => ({
        name_zh: color.name.zh,
        name_en: color.name.en,
        image: color.image,
      })),
      videos: model.videos,
      custom_fields: model.customFields?.map((field) => ({
        name_zh: field.name.zh,
        name_en: field.name.en,
        value_zh: field.value.zh,
        value_en: field.value.en,
      })),
      is_active: model.isActive,
    };
  },
  toRequest(input) {
    return input;
  },
};
