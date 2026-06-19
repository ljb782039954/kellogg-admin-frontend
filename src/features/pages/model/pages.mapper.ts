import type { Translation, CustomPage } from '@/types';

export interface PageIndexEntry {
  id: string;
  path: string;
  title: Translation;
  isFixed: boolean;
  type?: 'fixed-block' | 'dynamic-block' | 'fixed-layout';
  content?: unknown;
  blockCount: number;
}

export function sanitizePageIndex(pages: { id: string; path: string; title: Translation; isFixed: boolean; type?: string; blocks?: unknown[]; content?: unknown; blockCount?: number }[]): PageIndexEntry[] {
  return pages.map((p) => ({
    id: p.id,
    path: p.path,
    title: p.title,
    isFixed: p.isFixed,
    type: p.type as PageIndexEntry['type'],
    content: p.content,
    blockCount: p.blockCount ?? p.blocks?.length ?? 0,
  }));
}

export function createDefaultPage(
  path: string,
  title: { zh: string; en: string },
  id: string,
): CustomPage {
  return {
    id,
    path,
    title,
    isFixed: false,
    type: 'dynamic-block',
    blocks: [],
    seo: {
      title: { zh: title.zh, en: title.en },
      description: { zh: '', en: '' },
    },
  };
}
