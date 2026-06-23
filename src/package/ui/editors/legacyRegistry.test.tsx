import { describe, expect, it } from 'vitest';
import { blockCatalog, blockEditorId } from '@/package/blocks';
import type { BlockType } from '@/package/types';
import { blockEditors } from './legacyRegistry';

describe('legacy block editor registry', () => {
  it('为全部 Block 注册临时 editor adapter', () => {
    for (const type of Object.keys(blockCatalog) as BlockType[]) {
      expect(blockEditors[blockEditorId(type)], type).toBeTypeOf('function');
    }
  });
});
