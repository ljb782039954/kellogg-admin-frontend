import { describe, expect, it } from 'vitest';
import type { PageBuilderDraft } from './pageBuilder.types';
import { createDefaultSeo } from './pageBuilder.defaults';
import {
  createBlock,
  addBlock,
  removeBlock,
  moveBlock,
  toggleBlockVisibility,
  updateBlockContent,
  updatePageMeta,
  updateSeo,
} from './blockCommands';

const baseDraft: PageBuilderDraft = {
  id: 'page_1',
  path: '/test',
  title: { zh: '测试', en: 'Test' },
  isFixed: false,
  type: 'dynamic-block',
  blocks: [
    { id: 'b1', type: 'carousel', content: { autoPlay: true }, isVisible: true },
    { id: 'b2', type: 'textSection', content: { text: 'Hello' }, isVisible: true },
    { id: 'b3', type: 'gallery', content: {}, isVisible: false },
  ],
  seo: createDefaultSeo(),
};

describe('createBlock', () => {
  it('injects generated ID from the id generator', () => {
    const result = createBlock('textSection', () => 'gen_id_123');
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.id).toBe('gen_id_123');
  });

  it('returns unknown type error', () => {
    const result = createBlock('unknownType' as never, () => 'id');
    expect(result.ok).toBe(false);
    if (result.ok === false) expect(result.error).toBe('UNKNOWN_BLOCK_TYPE');
  });

  it('creates a visible block with default content from catalog', () => {
    const block = createBlock('textSection', () => 'ts_1');
    expect(block.ok).toBe(true);
    if (block.ok) {
      expect(block.value.type).toBe('textSection');
      expect(block.value.isVisible).toBe(true);
      expect(block.value.content).toEqual({
        title: { zh: '标题', en: 'Title' },
        content: { zh: '在这里输入内容...', en: 'Enter content here...' },
        alignment: 'center',
        paddingY: 'medium',
      });
    }
  });
});

describe('addBlock', () => {
  it('adds block to the end by default', () => {
    const block = createBlock('textSection', () => 'b4');
    expect(block.ok).toBe(true);
    if (!block.ok) return;
    const result = addBlock(baseDraft, block.value);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.blocks).toHaveLength(4);
      expect(result.value.blocks[3].id).toBe('b4');
      expect(result.changed).toBe(true);
    }
  });

  it('adds block at specified position', () => {
    const block = createBlock('textSection', () => 'b4');
    expect(block.ok).toBe(true);
    if (!block.ok) return;
    const result = addBlock(baseDraft, block.value, 1);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.blocks[1].id).toBe('b4');
      expect(result.value.blocks).toHaveLength(4);
    }
  });

  it('rejects duplicate singleton', () => {
    const singletonBlock = { id: 'b4', type: 'carousel' as const, content: { autoPlay: true }, isVisible: true };
    const result = addBlock(baseDraft, singletonBlock);
    expect(result.ok).toBe(false);
    if (result.ok === false) expect(result.error).toBe('DUPLICATE_SINGLETON');
  });

  it('does not mutate the input draft', () => {
    const originalLength = baseDraft.blocks.length;
    const block = createBlock('textSection', () => 'b4');
    expect(block.ok).toBe(true);
    if (!block.ok) return;
    addBlock(baseDraft, block.value);
    expect(baseDraft.blocks.length).toBe(originalLength);
  });
});

describe('removeBlock', () => {
  it('removes an existing block', () => {
    const result = removeBlock(baseDraft, 'b1');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.blocks.map((b) => b.id)).toEqual(['b2', 'b3']);
      expect(result.changed).toBe(true);
    }
  });

  it('returns not found for nonexistent block', () => {
    const result = removeBlock(baseDraft, 'nonexistent');
    expect(result.ok).toBe(false);
    if (result.ok === false) expect(result.error).toBe('BLOCK_NOT_FOUND');
  });

  it('does not mutate the input draft', () => {
    removeBlock(baseDraft, 'b1');
    expect(baseDraft.blocks).toHaveLength(3);
  });
});

describe('moveBlock', () => {
  it('moves block to first position', () => {
    const result = moveBlock(baseDraft, 'b3', 0);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.blocks[0].id).toBe('b3');
      expect(result.changed).toBe(true);
    }
  });

  it('moves block to last position', () => {
    const result = moveBlock(baseDraft, 'b1', 2);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.blocks[2].id).toBe('b1');
    }
  });

  it('returns no-change when target index is same as current', () => {
    const result = moveBlock(baseDraft, 'b1', 0);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.changed).toBe(false);
  });

  it('rejects out-of-bounds target index', () => {
    const result = moveBlock(baseDraft, 'b1', 10);
    expect(result.ok).toBe(false);
    if (result.ok === false) expect(result.error).toBe('INVALID_TARGET_INDEX');

    const negResult = moveBlock(baseDraft, 'b1', -1);
    expect(negResult.ok).toBe(false);
    if (negResult.ok === false) expect(negResult.error).toBe('INVALID_TARGET_INDEX');
  });

  it('does not mutate the input draft', () => {
    moveBlock(baseDraft, 'b3', 0);
    expect(baseDraft.blocks[0].id).toBe('b1');
  });
});

describe('toggleBlockVisibility', () => {
  it('toggles visible to hidden', () => {
    const result = toggleBlockVisibility(baseDraft, 'b1');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.blocks[0].isVisible).toBe(false);
      expect(result.changed).toBe(true);
    }
  });

  it('toggles hidden to visible', () => {
    const result = toggleBlockVisibility(baseDraft, 'b3');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.blocks[2].isVisible).toBe(true);
    }
  });

  it('returns not found for nonexistent block', () => {
    const result = toggleBlockVisibility(baseDraft, 'nonexistent');
    expect(result.ok).toBe(false);
    if (result.ok === false) expect(result.error).toBe('BLOCK_NOT_FOUND');
  });
});

describe('updateBlockContent', () => {
  it('replaces only the target block content', () => {
    const newContent = { text: 'Updated!' };
    const result = updateBlockContent(baseDraft, 'b2', newContent);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.blocks[1].content).toEqual({ text: 'Updated!' });
      expect(result.value.blocks[0].content).toEqual(baseDraft.blocks[0].content);
    }
  });

  it('returns not found for nonexistent block', () => {
    const result = updateBlockContent(baseDraft, 'nonexistent', {});
    expect(result.ok).toBe(false);
    if (result.ok === false) expect(result.error).toBe('BLOCK_NOT_FOUND');
  });

  it('does not mutate the input draft', () => {
    updateBlockContent(baseDraft, 'b2', { text: 'Mutated' });
    expect((baseDraft.blocks[1].content as Record<string, unknown>).text).toBe('Hello');
  });
});

describe('updatePageMeta', () => {
  it('updates page title', () => {
    const result = updatePageMeta(baseDraft, { title: { zh: '新标题', en: 'New Title' } });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.title.zh).toBe('新标题');
      expect(result.changed).toBe(true);
    }
  });

  it('does not mutate the input draft', () => {
    updatePageMeta(baseDraft, { path: '/updated' });
    expect(baseDraft.path).toBe('/test');
  });
});

describe('updateSeo', () => {
  it('replaces SEO data', () => {
    const newSeo = { title: { zh: '新SEO', en: 'New SEO' }, description: { zh: '', en: '' }, keywords: { zh: '', en: '' }, targetCountry: '' };
    const result = updateSeo(baseDraft, newSeo);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.seo.title.zh).toBe('新SEO');
    }
  });

  it('does not mutate the input draft', () => {
    const newSeo = { title: { zh: '新SEO', en: 'New SEO' }, description: { zh: '', en: '' }, keywords: { zh: '', en: '' }, targetCountry: '' };
    updateSeo(baseDraft, newSeo);
    expect(baseDraft.seo.title.zh).toBe('');
  });
});
