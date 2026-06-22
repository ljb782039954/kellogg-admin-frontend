import type { EntityDefinition } from '@/core/contracts';
import { footerAdapter } from '@/package/adapters/footer.adapter';
import type { FooterContent } from '@/package/types';

export const footerEntity: EntityDefinition<
  FooterContent,
  FooterContent,
  FooterContent
> = {
  key: 'footer',
  endpoint: '/api/config',
  adapter: footerAdapter,
  capabilities: { update: true },
  screens: { editor: 'footer' },
};
