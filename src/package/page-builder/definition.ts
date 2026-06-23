import type { PageBuilderDefinition } from '@/core/contracts';
import { blockCatalog, blockEditorId, blockPreviewId } from '@/package/blocks';
import type { BlockType, PageBlock } from '@/package/types';

const blockTypes = Object.keys(blockCatalog) as BlockType[];

export const pageBuilderDefinition: PageBuilderDefinition<PageBlock> = {
  blocks: blockTypes.map((type) => {
    const item = blockCatalog[type];
    return {
      type,
      title: item.name,
      category: item.category,
      icon: item.icon,
      singleton: item.singleton,
      create: () => ({
        id: `block_${crypto.randomUUID()}`,
        type,
        content: item.createDefaultContent(),
        isVisible: true,
      }),
      previewId: blockPreviewId(type),
      editorId: blockEditorId(type),
    };
  }),
};
