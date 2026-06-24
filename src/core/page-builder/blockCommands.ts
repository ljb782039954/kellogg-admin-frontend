import type { CoreBlock } from '@/core/contracts';

export type BlockCommandError =
  | 'BLOCK_NOT_FOUND'
  | 'INVALID_TARGET_INDEX';

export type BlockCommandResult<T> =
  | { ok: true; value: T; changed: boolean }
  | { ok: false; error: BlockCommandError };

export interface BlockDraft<Block extends CoreBlock = CoreBlock> {
  blocks: Block[];
}

export function addBlock<
  Block extends CoreBlock,
  Draft extends BlockDraft<Block>,
>(
  draft: Draft,
  block: Block,
  position?: number,
): BlockCommandResult<Draft> {
  const blocks = [...draft.blocks];
  if (position !== undefined && (position < 0 || position > blocks.length)) {
    return { ok: false, error: 'INVALID_TARGET_INDEX' };
  }

  const insertAt = position ?? blocks.length;
  blocks.splice(insertAt, 0, {
    ...block,
    content: structuredClone(block.content),
  });

  return {
    ok: true,
    value: { ...draft, blocks },
    changed: true,
  };
}

export function removeBlock<
  Block extends CoreBlock,
  Draft extends BlockDraft<Block>,
>(
  draft: Draft,
  blockId: string,
): BlockCommandResult<Draft> {
  const index = draft.blocks.findIndex((block) => block.id === blockId);
  if (index === -1) return { ok: false, error: 'BLOCK_NOT_FOUND' };

  return {
    ok: true,
    value: {
      ...draft,
      blocks: draft.blocks.filter((block) => block.id !== blockId),
    },
    changed: true,
  };
}

export function moveBlock<
  Block extends CoreBlock,
  Draft extends BlockDraft<Block>,
>(
  draft: Draft,
  blockId: string,
  targetIndex: number,
): BlockCommandResult<Draft> {
  const index = draft.blocks.findIndex((block) => block.id === blockId);
  if (index === -1) return { ok: false, error: 'BLOCK_NOT_FOUND' };
  if (targetIndex < 0 || targetIndex >= draft.blocks.length) {
    return { ok: false, error: 'INVALID_TARGET_INDEX' };
  }
  if (index === targetIndex) {
    return { ok: true, value: draft, changed: false };
  }

  const blocks = [...draft.blocks];
  const [moved] = blocks.splice(index, 1);
  blocks.splice(targetIndex, 0, moved);

  return {
    ok: true,
    value: { ...draft, blocks },
    changed: true,
  };
}

export function toggleBlockVisibility<
  Block extends CoreBlock,
  Draft extends BlockDraft<Block>,
>(
  draft: Draft,
  blockId: string,
): BlockCommandResult<Draft> {
  const index = draft.blocks.findIndex((block) => block.id === blockId);
  if (index === -1) return { ok: false, error: 'BLOCK_NOT_FOUND' };

  const blocks = draft.blocks.map((block, currentIndex) =>
    currentIndex === index
      ? { ...block, isVisible: !block.isVisible }
      : block,
  );

  return {
    ok: true,
    value: { ...draft, blocks },
    changed: true,
  };
}

export function updateBlockContent<
  Block extends CoreBlock,
  Draft extends BlockDraft<Block>,
>(
  draft: Draft,
  blockId: string,
  content: Block['content'],
): BlockCommandResult<Draft> {
  const index = draft.blocks.findIndex((block) => block.id === blockId);
  if (index === -1) return { ok: false, error: 'BLOCK_NOT_FOUND' };

  const blocks = draft.blocks.map((block, currentIndex) =>
    currentIndex === index
      ? { ...block, content: structuredClone(content) }
      : block,
  );

  return {
    ok: true,
    value: { ...draft, blocks },
    changed: true,
  };
}
