import { z } from 'zod';

const translationSchema = z.object({
  zh: z.string(),
  en: z.string(),
});

const footerLinkSchema = z.object({
  id: z.string(),
  name: translationSchema,
  linkType: z.enum(['internal', 'external']),
  href: z.string(),
  pageDeleted: z.boolean().optional(),
});

const footerLinkGroupSchema = z.object({
  id: z.string(),
  title: translationSchema,
  links: z.array(footerLinkSchema),
});

export const footerSchema = z.object({
  linkGroups: z.array(footerLinkGroupSchema),
  newsletterPlaceholder: translationSchema,
  newsletterButton: translationSchema,
});

export type FooterFormValues = z.infer<typeof footerSchema>;
