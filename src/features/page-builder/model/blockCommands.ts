import type { BlockType, PageBlock } from '@/types';
import type {
  PageBuilderDraft,
  PageMetaChanges,
  PageSeo,
  CommandResult,
} from './pageBuilder.types';
import { getBlockCatalogItem } from './blockCatalog';

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

  const blocks = [...draft.blocks];
  if (position !== undefined && (position < 0 || position > blocks.length)) {
    return { ok: false, error: 'INVALID_TARGET_INDEX' };
  }

  const insertAt = position ?? blocks.length;
  blocks.splice(insertAt, 0, { ...block, content: structuredClone(block.content) });

  return { ok: true, value: { ...draft, blocks }, changed: true };
}

export function removeBlock(
  draft: PageBuilderDraft,
  blockId: string,
): CommandResult<PageBuilderDraft> {
  const idx = draft.blocks.findIndex((b) => b.id === blockId);
  if (idx === -1) return { ok: false, error: 'BLOCK_NOT_FOUND' };

  const blocks = draft.blocks.filter((b) => b.id !== blockId);
  return { ok: true, value: { ...draft, blocks }, changed: true };
}

export function moveBlock(
  draft: PageBuilderDraft,
  blockId: string,
  targetIndex: number,
): CommandResult<PageBuilderDraft> {
  const idx = draft.blocks.findIndex((b) => b.id === blockId);
  if (idx === -1) return { ok: false, error: 'BLOCK_NOT_FOUND' };

  if (targetIndex < 0 || targetIndex >= draft.blocks.length) {
    return { ok: false, error: 'INVALID_TARGET_INDEX' };
  }

  if (idx === targetIndex) {
    return { ok: true, value: draft, changed: false };
  }

  const blocks = [...draft.blocks];
  const [moved] = blocks.splice(idx, 1);
  blocks.splice(targetIndex, 0, moved);

  return { ok: true, value: { ...draft, blocks }, changed: true };
}

export function toggleBlockVisibility(
  draft: PageBuilderDraft,
  blockId: string,
): CommandResult<PageBuilderDraft> {
  const idx = draft.blocks.findIndex((b) => b.id === blockId);
  if (idx === -1) return { ok: false, error: 'BLOCK_NOT_FOUND' };

  const blocks = draft.blocks.map((b, i) =>
    i === idx ? { ...b, isVisible: !b.isVisible } : b,
  );

  return { ok: true, value: { ...draft, blocks }, changed: true };
}

export function updateBlockContent(
  draft: PageBuilderDraft,
  blockId: string,
  content: unknown,
): CommandResult<PageBuilderDraft> {
  const idx = draft.blocks.findIndex((b) => b.id === blockId);
  if (idx === -1) return { ok: false, error: 'BLOCK_NOT_FOUND' };

  const blocks = draft.blocks.map((b, i) =>
    i === idx ? { ...b, content: structuredClone(content) } : b,
  );

  return { ok: true, value: { ...draft, blocks }, changed: true };
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
