import type { ProjectIdentity } from '@/core/contracts';
import siteSettings from './siteSettings.json';

export const identity: ProjectIdentity = {
  key: 'kellogg',
  name: siteSettings.brand.name,
  logo: siteSettings.brand.logo,
  languages: ['zh', 'en'],
  defaultLanguage: 'zh',
};
