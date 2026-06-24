import type { BlockType, PageBlock } from '@/types';
import type {
  PageBuilderDraft,
  PageMetaChanges,
  PageSeo,
  CommandResult,
} from './pageBuilder.types';
import { getBlockCatalogItem } from './blockCatalog';
import {
  addBlock as addCoreBlock,
} from '@/core/page-builder';

export {
  moveBlock,
  removeBlock,
  toggleBlockVisibility,
  updateBlockContent,
} from '@/core/page-builder';

type IdGenerator = () => string;

export function createBlock(
  type: BlockType,
  idGenerator: IdGenerator,
): CommandResult<PageBlock> {
  const item = getBlockCatalogItem(type);
  if (!item) return { ok: false, error: 'UNKNOWN_BLOCK_TYPE' };

  return {
    ok: true,
    value: {
      id: idGenerator(),
      type,
      content: item.createDefaultContent(),
      isVisible: true,
    },
    changed: true,
  };
}

function isSingletonConflict(
  draft: PageBuilderDraft,
  blockType: BlockType,
): boolean {
  const item = getBlockCatalogItem(blockType);
  if (!item?.singleton) return false;
  return draft.blocks.some((b) => b.type === blockType);
}

export function addBlock(
  draft: PageBuilderDraft,
  block: PageBlock,
  position?: number,
): CommandResult<PageBuilderDraft> {
  if (isSingletonConflict(draft, block.type)) {
    return { ok: false, error: 'DUPLICATE_SINGLETON' };
  }

  return addCoreBlock(draft, block, position);
}

export function updatePageMeta(
  draft: PageBuilderDraft,
  changes: PageMetaChanges,
): CommandResult<PageBuilderDraft> {
  return {
    ok: true,
    value: { ...draft, ...changes },
    changed: true,
  };
}

export function updateSeo(
  draft: PageBuilderDraft,
  seo: PageSeo,
): CommandResult<PageBuilderDraft> {
  return {
    ok: true,
    value: { ...draft, seo: structuredClone(seo) },
    changed: true,
  };
}
