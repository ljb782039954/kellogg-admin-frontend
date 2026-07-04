// src/cms/types/pages.ts

import type { Translation } from './common';

export interface CmsPageBlock<
    TBlockType extends string = string,
    TContent = unknown
> {
    id: string;
    type: TBlockType;
    content: TContent;
    isVisible: boolean;
}

export type PageType = 'fixed-block' | 'dynamic-block' | 'fixed-layout';

export interface CmsCustomPage<
    TBlock extends CmsPageBlock = CmsPageBlock
> {
    id: string;
    path: string;
    title: Translation;
    isFixed: boolean;
    type?: PageType;
    content?: unknown;
    blocks: TBlock[];
    seo?: {
        title: Translation;
        description: Translation;
        keywords?: Translation;
        targetCountry?: string;
    };
}