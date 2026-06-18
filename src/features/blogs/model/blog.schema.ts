import { z } from 'zod';

const translationSchema = z.object({
  zh: z.string().default(''),
  en: z.string().default(''),
});

export const blogSchema = z.object({
  id: z.number().default(0),
  slug: z.string().default(''),
  title: translationSchema,
  summary: translationSchema,
  content: translationSchema,
  coverImage: z.string().default(''),
  category: z.string().default(''),
  tags: z.array(z.string()).default([]),
  author: z.string().default('Admin'),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  seoTitle: translationSchema,
  seoDesc: translationSchema,
  publishDate: z.string().default(''),
});

export type BlogFormValues = z.infer<typeof blogSchema>;
