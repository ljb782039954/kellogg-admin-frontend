import type { CustomPage } from '@/types';
import { customPageSchema, type PageFormValues } from './pages.schema';

interface PageIndexEntry extends CustomPage {
  blockCount: number;
}

export function sanitizePageIndex(pages: CustomPage[]): PageIndexEntry[] {
  return pages.map((p) => ({
    id: p.id,
    path: p.path,
    title: p.title,
    isFixed: p.isFixed,
    type: p.type,
    content: p.content,
    blocks: [],
    blockCount: (p as any).blockCount ?? p.blocks?.length ?? 0,
  }));
}

export function toPageFormValues(page: CustomPage | null | undefined): PageFormValues {
  return customPageSchema.parse({
    id: '',
    path: '/',
    title: { zh: '', en: '' },
    isFixed: false,
    blocks: [],
    ...page,
  });
}

export function createDefaultPage(
  path: string,
  title: { zh: string; en: string },
  id: string,
): PageFormValues {
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
