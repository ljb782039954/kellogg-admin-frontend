import { z } from 'zod';

const translationSchema = z.object({
  zh: z.string(),
  en: z.string(),
});

const navLinkSchema: z.ZodType = z.lazy(() =>
  z.object({
    id: z.string(),
    name: translationSchema,
    linkType: z.enum(['internal', 'external']),
    href: z.string(),
    pageDeleted: z.boolean().optional(),
    children: z.array(navLinkSchema).optional(),
  }),
);

export const headerSchema = z.object({
  logoText: translationSchema,
  navItems: z.array(navLinkSchema),
});

export type HeaderFormValues = z.infer<typeof headerSchema>;
