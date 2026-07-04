import type { Translation } from "@/cms/types/common";
import type { BlockType } from "../ui-display/types";

// 组件分类
export type ComponentCategory = 'product' | 'marketing' | 'content' | 'media';

// 组件元数据
export interface ComponentMeta {
  type: BlockType;
  name: Translation;
  description: Translation;
  icon: string;  // lucide 图标名称
  category: ComponentCategory;
  hasGlobalData: boolean;  // 是否使用全局数据（如商品列表、评价列表等）
  singleton?: boolean;     // 是否只能添加一个
  defaultProps: any;
}
