import type { EntityDefinition } from '@/core/contracts';
import { pagesAdapter } from '@/package/adapters/pages.adapter';
import type { PageIndexEntry } from '@/package/types';

export const pagesEntity: EntityDefinition<
  PageIndexEntry[],
  PageIndexEntry[],
  PageIndexEntry[]
> = {
  key: 'pages',
  endpoint: '/api/config/pages_index',
  adapter: pagesAdapter,
  capabilities: { list: true, create: true, update: true, delete: true },
  screens: { list: 'pages', editor: 'page-builder' },
};
