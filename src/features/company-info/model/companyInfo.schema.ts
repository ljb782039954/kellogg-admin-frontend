import { z } from 'zod';

const translationSchema = z.object({
  zh: z.string().default(''),
  en: z.string().default(''),
});

export const companyInfoSchema = z.object({
  name: translationSchema,
  logo: z.string().default(''),
  description: translationSchema,
  contact: z.object({
    phone: z.string().default(''),
    email: z.string().default(''),
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
  }).default({}),
});

export type CompanyInfoFormValues = z.infer<typeof companyInfoSchema>;
