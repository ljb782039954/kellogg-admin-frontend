import type { EntityDefinition } from '@/core/contracts';
import { navigationAdapter } from '@/package/adapters/navigation.adapter';
import type { HeaderContent } from '@/package/types';

export const navigationEntity: EntityDefinition<
  HeaderContent,
  HeaderContent,
  HeaderContent
> = {
  key: 'navigation',
  endpoint: '/api/config',
  adapter: navigationAdapter,
  capabilities: { update: true },
  screens: { editor: 'header' },
};
