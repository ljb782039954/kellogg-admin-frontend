import siteSettings from '@/config/siteSettings.json';

export const siteProfile = {
  description: siteSettings.brand.description,
  contact: siteSettings.contact,
} as const;
