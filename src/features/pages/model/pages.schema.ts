import { z } from 'zod';

const translationSchema = z.object({
  zh: z.string(),
  en: z.string(),
});

export const pageBlockSchema = z.object({
  id: z.string(),
  type: z.string(),
  content: z.any().default({}),
  isVisible: z.boolean().default(true),
});

export const seoSchema = z.object({
  title: translationSchema,
  description: translationSchema,
  keywords: translationSchema.optional(),
  targetCountry: z.string().optional(),
});

export const customPageSchema = z.object({
  id: z.string(),
  path: z.string(),
  title: translationSchema,
  isFixed: z.boolean().default(false),
  type: z.enum(['fixed-block', 'dynamic-block', 'fixed-layout']).optional(),
  content: z.any().optional(),
  blocks: z.array(pageBlockSchema).default([]),
  seo: seoSchema.optional(),
});

export type PageFormValues = z.infer<typeof customPageSchema>;
