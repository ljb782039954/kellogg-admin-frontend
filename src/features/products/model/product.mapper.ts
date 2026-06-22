import type { BulkPrice, Product, ProductInput } from '@/package/types';
import { productSchema, type ProductFormValues } from './product.schema';
import { createDefaultProduct } from './product.defaults';

export { productSchema };
export type { ProductFormValues };

export function toProductFormValues(
  input: Partial<Product> | null | undefined,
): ProductFormValues {
  return productSchema.parse({
    ...createDefaultProduct(),
    ...input,
    name: { zh: '', en: '', ...input?.name },
    tag: input?.tag ? { zh: '', en: '', ...input.tag } : undefined,
    description: input?.description ? { zh: '', en: '', ...input.description } : undefined,
    fabric: input?.fabric ? { zh: '', en: '', ...input.fabric } : undefined,
    notes: input?.notes ? { zh: '', en: '', ...input.notes } : undefined,
  });
}

function normalizeBulkPrices(prices: ProductFormValues['bulkPrices']): BulkPrice[] | undefined {
  if (prices.length === 0) return undefined;
  return prices.map((p) => ({
    minQty: p.minQty,
    maxQty: p.maxQty ?? null,
    price: p.price,
  }));
}

export function toCreateProductInput(form: ProductFormValues): ProductInput {
  return {
    name_zh: form.name.zh,
    name_en: form.name.en,
    price: form.price,
    original_price: form.originalPrice || undefined,
    bulk_prices: normalizeBulkPrices(form.bulkPrices),
    category_id: form.category || undefined,
    rating: form.rating || undefined,
    sales: form.sales || undefined,
    tag_zh: form.tag?.zh || undefined,
    tag_en: form.tag?.en || undefined,
    description_zh: form.description?.zh || undefined,
    description_en: form.description?.en || undefined,
    release_date: form.releaseDate || undefined,
    is_featured: form.isFeatured || undefined,
    image: form.image || undefined,
    images: form.images.length > 0 ? form.images : undefined,
    fabric_zh: form.fabric?.zh || undefined,
    fabric_en: form.fabric?.en || undefined,
    notes_zh: form.notes?.zh || undefined,
    notes_en: form.notes?.en || undefined,
    is_active: form.isActive,
    sizes: form.sizes.length > 0 ? form.sizes : undefined,
    colors: form.colors.length > 0
      ? form.colors.map((c) => ({
          name_zh: c.name.zh,
          name_en: c.name.en,
          image: c.image,
        }))
      : undefined,
    videos: form.videos.length > 0 ? form.videos : undefined,
    custom_fields: form.customFields.length > 0
      ? form.customFields.map((cf) => ({
          name_zh: cf.name.zh,
          name_en: cf.name.en,
          value_zh: cf.value.zh,
          value_en: cf.value.en,
        }))
      : undefined,
  };
}

export function toUpdateProductInput(form: ProductFormValues): Partial<ProductInput> {
  return toCreateProductInput(form);
}

export function fromProductResponse(
  product: Product | null | undefined,
): ProductFormValues {
  if (!product) return createDefaultProduct();

  return productSchema.parse({
    id: product.id,
    name: { zh: product.name?.zh ?? '', en: product.name?.en ?? '' },
    price: product.price,
    originalPrice: product.originalPrice,
    bulkPrices: product.bulkPrices ?? [],
    image: product.image ?? '',
    images: product.images ?? [],
    rating: product.rating ?? 5,
    sales: product.sales ?? 0,
    tag: product.tag ? { zh: product.tag.zh ?? '', en: product.tag.en ?? '' } : undefined,
    category: product.category,
    releaseDate: product.releaseDate,
    isFeatured: product.isFeatured ?? false,
    fabric: product.fabric ? { zh: product.fabric.zh ?? '', en: product.fabric.en ?? '' } : undefined,
    notes: product.notes ? { zh: product.notes.zh ?? '', en: product.notes.en ?? '' } : undefined,
    isActive: product.isActive ?? true,
    sizes: product.sizes ?? [],
    colors: (product.colors ?? []).map((c) => ({
      name: { zh: c.name?.zh ?? '', en: c.name?.en ?? '' },
      image: c.image,
    })),
    videos: product.videos ?? [],
    customFields: (product.customFields ?? []).map((cf) => ({
      name: { zh: cf.name?.zh ?? '', en: cf.name?.en ?? '' },
      value: { zh: cf.value?.zh ?? '', en: cf.value?.en ?? '' },
    })),
  });
}
