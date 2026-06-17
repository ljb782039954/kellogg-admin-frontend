import { z } from 'zod';

const translationSchema = z.object({
  zh: z.string().default(''),
  en: z.string().default(''),
});

export const productSchema = z.object({
  id: z.number(),
  name: translationSchema,
  price: z.number().min(0),
  originalPrice: z.number().min(0).optional(),
  bulkPrices: z.array(z.object({
    minQty: z.number(),
    maxQty: z.number().nullable(),
    price: z.number(),
  })).default([]),
  image: z.string().default(''),
  images: z.array(z.string()).default([]),
  rating: z.number().min(0).max(5).default(5),
  sales: z.number().min(0).default(0),
  tag: translationSchema.optional(),
  category: z.string().optional(),
  releaseDate: z.string().optional(),
  description: translationSchema.optional(),
  isFeatured: z.boolean().default(false),
  fabric: translationSchema.optional(),
  notes: translationSchema.optional(),
  isActive: z.boolean().default(true),
  sizes: z.array(z.object({
    name: z.string(),
    image: z.string().optional(),
  })).default([]),
  colors: z.array(z.object({
    name: translationSchema,
    image: z.string().optional(),
  })).default([]),
  videos: z.array(z.string()).default([]),
  customFields: z.array(z.object({
    name: translationSchema,
    value: translationSchema,
  })).default([]),
});

export type ProductFormValues = z.infer<typeof productSchema>;
