import { nanoid } from 'nanoid';
import type { Translation } from '@/cms/types';
import type { CustomPage, PageBlock } from '@/site-package/kellogg/types/blocks';

export const PAGE_SETTINGS_BLOCK_ID = '__settings__';
export const SEO_SETTINGS_BLOCK_ID = '__seo__';

export const EMPTY_SEO = {
  title: { zh: '', en: '' },
  description: { zh: '', en: '' },
};

export interface PageFormValidationResult {
  title: string;
  description?: string;
  variant?: 'destructive';
}

export function clonePage<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function sanitizePagePathInput(value: string): string {
  return value.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
}

export function toPagePath(value: string): string {
  return `/${value.replace(/^\//, '')}`;
}

export function createPageTitle(title: Translation): Translation {
  const zh = title.zh.trim();
  const en = title.en.trim() || zh;
  return { zh, en };
}

export function validatePageForm(
  pages: CustomPage[],
  title: Translation,
  pathInput: string,
  excludePageId?: string
): PageFormValidationResult | null {
  if (!title.zh.trim() || !pathInput.trim()) {
    return {
      title: '请填写完整信息',
      description: '页面标题（中文）和 URL 路径不能为空',
      variant: 'destructive',
    };
  }

  const path = toPagePath(pathInput);
  const pathExists = pages.some((page) => page.id !== excludePageId && page.path === path);
  if (pathExists) {
    return {
      title: 'URL 路径已存在',
      description: '请使用其他 URL 路径',
      variant: 'destructive',
    };
  }

  return null;
}

export function createDynamicPage(
  title: Translation,
  pathInput: string,
  duplicateSourcePage?: CustomPage | null
): CustomPage {
  const pageTitle = createPageTitle(title);

  return {
    id: `page_${nanoid(8)}`,
    path: toPagePath(pathInput),
    title: pageTitle,
    isFixed: false,
    type: 'dynamic-block',
    blocks: duplicateSourcePage
      ? duplicateSourcePage.blocks.map((block) => ({
          ...clonePage(block),
          id: `block_${nanoid(8)}`,
        }))
      : [],
    seo: duplicateSourcePage
      ? clonePage(duplicateSourcePage.seo || EMPTY_SEO)
      : {
          title: pageTitle,
          description: { zh: '', en: '' },
        },
  };
}

export function filterPages(pages: CustomPage[], searchQuery: string): CustomPage[] {
  const query = searchQuery.toLowerCase();
  return pages.filter((page) => (
    page.title.zh.toLowerCase().includes(query) ||
    page.title.en.toLowerCase().includes(query) ||
    page.path.toLowerCase().includes(query)
  ));
}

export function groupPagesByBuilderType(pages: CustomPage[]) {
  return {
    fixedBlockPages: pages.filter((page) => (
      page.type === 'fixed-block' || (page.isFixed && page.type !== 'fixed-layout')
    )),
    dynamicBlockPages: pages.filter((page) => (
      page.type === 'dynamic-block' || (!page.isFixed && page.type !== 'fixed-layout' && page.type !== 'fixed-block')
    )),
    fixedLayoutPages: pages.filter((page) => page.type === 'fixed-layout'),
  };
}

export function createDuplicateForm(page: CustomPage) {
  return {
    title: { zh: `${page.title.zh} (副本)`, en: `${page.title.en} (Copy)` },
    path: `${page.path.replace(/^\//, '')}-copy`,
  };
}

export function ensurePageSeo(page: CustomPage): CustomPage {
  return {
    ...page,
    seo: page.seo || EMPTY_SEO,
  };
}

export function reorderBlocksById(
  blocks: PageBlock[],
  activeId: string,
  overId?: string | null
): PageBlock[] {
  if (!overId || activeId === overId) return blocks;

  const oldIndex = blocks.findIndex((block) => block.id === activeId);
  const newIndex = blocks.findIndex((block) => block.id === overId);
  if (oldIndex < 0 || newIndex < 0) return blocks;

  const nextBlocks = [...blocks];
  const [movedBlock] = nextBlocks.splice(oldIndex, 1);
  nextBlocks.splice(newIndex, 0, movedBlock);
  return nextBlocks;
}

export function moveBlockByOffset(blocks: PageBlock[], blockId: string, offset: -1 | 1): PageBlock[] {
  const index = blocks.findIndex((block) => block.id === blockId);
  const targetIndex = index + offset;
  if (index < 0 || targetIndex < 0 || targetIndex >= blocks.length) return blocks;

  const nextBlocks = [...blocks];
  const [movedBlock] = nextBlocks.splice(index, 1);
  nextBlocks.splice(targetIndex, 0, movedBlock);
  return nextBlocks;
}

export function updateBlockContent(blocks: PageBlock[], blockId: string, content: unknown): PageBlock[] {
  return blocks.map((block) => (
    block.id === blockId ? { ...block, content } : block
  ));
}

export function toggleBlockVisibility(blocks: PageBlock[], blockId: string): PageBlock[] {
  return blocks.map((block) => (
    block.id === blockId ? { ...block, isVisible: !block.isVisible } : block
  ));
}

export function createDefaultBlocks(): PageBlock[] {
  return [];
}
