import { describe, expect, it } from 'vitest';
import { blockCatalog, blockPreviewId } from '@/package/blocks';
import type { BlockType } from '@/package/types';
import { blockViews } from './legacyRegistry';

describe('legacy block view registry', () => {
  it('为全部 Block 注册临时 preview adapter', () => {
    for (const type of Object.keys(blockCatalog) as BlockType[]) {
      expect(blockViews[blockPreviewId(type)], type).toBeTypeOf('function');
    }
  });
});
