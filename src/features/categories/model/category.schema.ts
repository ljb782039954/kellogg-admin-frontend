import { z } from 'zod';

const translationSchema = z.object({
  zh: z.string(),
  en: z.string(),
});

export const categorySchema = z.object({
  id: z.string().min(1),
  name: translationSchema,
  image: z.string(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
