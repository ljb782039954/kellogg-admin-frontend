import { describe, expect, it } from 'vitest';
import { blockCatalog } from '@/package/blocks';
import { pageBuilderDefinition } from './definition';

describe('pageBuilderDefinition', () => {
  it('为全部 Block 元数据建立稳定 definition', () => {
    expect(pageBuilderDefinition.blocks).toHaveLength(Object.keys(blockCatalog).length);
    for (const block of pageBuilderDefinition.blocks) {
      expect(block.previewId).toBe(`block:${block.type}:preview`);
      expect(block.editorId).toBe(`block:${block.type}:editor`);
    }
  });

  it('create 生成独立 Block 与默认内容', () => {
    const definition = pageBuilderDefinition.blocks.find(
      (block) => block.type === 'textSection',
    )!;
    const first = definition.create();
    const second = definition.create();

    expect(first.id).not.toBe(second.id);
    expect(first.content).not.toBe(second.content);
    expect(first.isVisible).toBe(true);
  });
});
