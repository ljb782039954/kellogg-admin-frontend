// src/site-package/kellogg/types/pages.ts

import type { CmsCustomPage, CmsPageBlock } from '@/cms/types';
import type { BlockType } from './blocks';

export type PageBlock<TContent = unknown> =
  CmsPageBlock<BlockType, TContent>;

export type CustomPage =
  CmsCustomPage<PageBlock>;