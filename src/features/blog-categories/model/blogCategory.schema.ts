import { z } from 'zod';

const translationSchema = z.object({
  zh: z.string().default(''),
  en: z.string().default(''),
});

export const blogCategorySchema = z.object({
  id: z.number().default(0),
  name: translationSchema,
  slug: z.string().default(''),
  sortOrder: z.number().default(0),
  articleCount: z.number().default(0),
});

export type BlogCategoryFormValues = z.infer<typeof blogCategorySchema>;
