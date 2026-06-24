import { describe, expect, it } from 'vitest';
import type { CoreBlock } from '@/core/contracts';
import {
  addBlock,
  moveBlock,
  removeBlock,
  toggleBlockVisibility,
  updateBlockContent,
} from './blockCommands';

type TestBlock = CoreBlock<'hero' | 'text', { value: string }>;

interface TestDraft {
  name: string;
  blocks: TestBlock[];
}

const draft: TestDraft = {
  name: 'fixture',
  blocks: [
    { id: 'a', type: 'hero', content: { value: 'A' }, isVisible: true },
    { id: 'b', type: 'text', content: { value: 'B' }, isVisible: false },
  ],
};

describe('core/page-builder block commands', () => {
  it('adds a cloned block without mutating the draft', () => {
    const block: TestBlock = {
      id: 'c',
      type: 'text',
      content: { value: 'C' },
      isVisible: true,
    };
    const result = addBlock(draft, block, 1);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.blocks.map((item) => item.id)).toEqual(['a', 'c', 'b']);
    expect(result.value.blocks[1].content).not.toBe(block.content);
    expect(draft.blocks.map((item) => item.id)).toEqual(['a', 'b']);
  });

  it('removes, moves, toggles and updates blocks by stable id', () => {
    const moved = moveBlock(draft, 'b', 0);
    expect(moved.ok && moved.value.blocks[0].id).toBe('b');

    const toggled = toggleBlockVisibility(draft, 'b');
    expect(toggled.ok && toggled.value.blocks[1].isVisible).toBe(true);

    const updated = updateBlockContent(draft, 'a', { value: 'Updated' });
    expect(updated.ok && updated.value.blocks[0].content.value).toBe('Updated');

    const removed = removeBlock(draft, 'a');
    expect(removed.ok && removed.value.blocks.map((item) => item.id)).toEqual(['b']);
  });

  it('returns stable errors for invalid commands', () => {
    expect(removeBlock(draft, 'missing')).toEqual({
      ok: false,
      error: 'BLOCK_NOT_FOUND',
    });
    expect(moveBlock(draft, 'a', 10)).toEqual({
      ok: false,
      error: 'INVALID_TARGET_INDEX',
    });
  });
});
