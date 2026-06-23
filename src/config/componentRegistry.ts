// 组件注册表 - 派生自 features/page-builder 的唯一 Block Catalog
import {
  type BlockType,
  type ComponentMeta,
  type ComponentCategory,
} from '../types';
import {
  blockCatalog,
  componentsByCategory as catalogComponentsByCategory,
  categoryNames as catalogCategoryNames,
} from '@/package/blocks';

export const componentRegistry: Record<BlockType, ComponentMeta> =
  Object.fromEntries(
    (Object.keys(blockCatalog) as BlockType[]).map((type) => {
      const item = blockCatalog[type];
      return [
        type,
        {
          type: item.type,
          name: item.name,
          description: item.description,
          icon: item.icon,
          category: item.category as ComponentCategory,
          hasGlobalData: item.hasGlobalData,
          singleton: item.singleton,
          get defaultProps() {
            return item.createDefaultContent();
          },
        } satisfies ComponentMeta,
      ];
    }),
  ) as Record<BlockType, ComponentMeta>;

export const componentsByCategory: Record<ComponentCategory, BlockType[]> =
  catalogComponentsByCategory;

export const categoryNames: Record<ComponentCategory, { zh: string; en: string }> =
  catalogCategoryNames;

export function getComponentMeta(type: BlockType): ComponentMeta {
  return componentRegistry[type];
}

export function getAllBlockTypes(): BlockType[] {
  return Object.keys(componentRegistry) as BlockType[];
}

export function canAddBlock(type: BlockType, existingBlocks: { type: BlockType }[]): boolean {
  const item = blockCatalog[type];
  if (!item?.singleton) return true;
  return !existingBlocks.some((b) => b.type === type);
}
