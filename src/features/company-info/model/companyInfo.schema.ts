import { z } from 'zod';

const translationSchema = z.object({
  zh: z.string(),
  en: z.string(),
});

export const companyInfoSchema = z.object({
  name: translationSchema,
  logo: z.string(),
  description: translationSchema,
  contact: z.object({
    phone: z.string(),
    email: z.string(),
    address: translationSchema,
  }),
  socialMedia: z.object({
    wechat: z.string().optional(),
    weibo: z.string().optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    twitter: z.string().optional(),
    youtube: z.string().optional(),
    linkedin: z.string().optional(),
    tiktok: z.string().optional(),
    whatsapp: z.string().optional(),
  }),
});

export type CompanyInfoFormValues = z.infer<typeof companyInfoSchema>;
