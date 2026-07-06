// src/site-package/kellogg/types/pages.ts

import type { CmsCustomPage, CmsPageBlock } from '@/cms/types';
import type { BlockContentMap, BlockType } from '../ui-display/types/blocks';

export type PageBlock = {
  [K in BlockType]: CmsPageBlock<K, BlockContentMap[K]>
}[BlockType];

export type CustomPage =
  CmsCustomPage<PageBlock>;
