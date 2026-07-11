// 组件注册表 - 定义所有可用的页面组件
import {
  type BlockType,
  type BlockMeta,
  type BlockCategory,
} from '../types';
import {
  blockCategories,
  blockRegistry,
} from '../ui-display/data/blocks';

export const componentRegistry = Object.fromEntries(
  blockRegistry.map((block) => [block.type, block]),
) as Record<BlockType, BlockMeta>;

export const componentsByCategory = blockRegistry.reduce(
  (acc, block) => {
    if (
      block.type === 'inquiry' || 
      block.type === 'productCard' || 
      // block.type === 'blogSidebar' || 
      block.type === 'blogGrid' || 
      block.type === 'brochureDownload' 

    ) {
      return acc;
    }

    acc[block.category].push(block.type);
    return acc;
  },
  Object.fromEntries(
    blockCategories.map((category) => [category.id, []]),
  ) as Record<BlockCategory, BlockType[]>,
);

// 获取组件元数据
export function getBlockMeta(type: BlockType): BlockMeta {
  return componentRegistry[type];
}

// 获取所有组件类型
export function getAllBlockTypes(): BlockType[] {
  return Object.keys(componentRegistry) as BlockType[];
}

// 检查组件是否可以添加（考虑 singleton 限制）
export function canAddBlock(type: BlockType, existingBlocks: { type: BlockType }[]): boolean {
  const meta = componentRegistry[type];
  if (!meta.singleton) return true;
  return !existingBlocks.some(b => b.type === type);
}
