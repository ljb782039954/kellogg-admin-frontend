import type { Translation } from "@/cms/types/common";
import type { BlockContentMap, BlockType } from "./blocks";

export type BlockCategory = 'product' | 'marketing' | 'content' | 'media';

export interface BlockMeta<T extends BlockType = BlockType> {
  type: T;
  id: T;
  name: Translation;
  category: BlockCategory;
  categoryName: Translation;
  description: Translation;
  singleton: boolean,
  defaultProps: Partial<BlockContentMap[T]>;
}
