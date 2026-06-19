import type { PageSeo } from './pageBuilder.types';

export function createDefaultSeo(): PageSeo {
  return {
    title: { zh: '', en: '' },
    description: { zh: '', en: '' },
    keywords: { zh: '', en: '' },
    targetCountry: '',
  };
}
