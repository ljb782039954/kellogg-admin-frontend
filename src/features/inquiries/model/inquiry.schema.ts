import { z } from 'zod';

const translationSchema = z.object({
  zh: z.string(),
  en: z.string(),
});

export const inquirySettingsSchema = z.object({
  title: translationSchema,
  description: translationSchema,
});

export type InquirySettingsFormValues = z.infer<typeof inquirySettingsSchema>;
