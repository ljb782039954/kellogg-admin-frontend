import type { CustomPage } from '@/types';
import type { PageBuilderDraft } from './pageBuilder.types';
import { createDefaultSeo } from './pageBuilder.defaults';

export function toPageBuilderDraft(page: CustomPage): PageBuilderDraft {
  const cloned = structuredClone(page) as unknown as PageBuilderDraft;
  if (!cloned.seo) {
    cloned.seo = createDefaultSeo();
  }
  return cloned;
}

export function toSavablePage(draft: PageBuilderDraft): CustomPage {
  return structuredClone(draft) as unknown as CustomPage;
}
