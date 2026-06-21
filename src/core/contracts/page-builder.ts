import type { Translation } from '@/shared/i18n/translation';
import type { IconName } from './icon';

/** core 对 Block 的唯一认知；具体 Block 联合类型由 package 定义。 */
export interface CoreBlock<Type extends string = string, Content = unknown> {
  id: string;
  type: Type;
  content: Content;
  isVisible: boolean;
}

export interface BlockDefinition<
  Block extends CoreBlock = CoreBlock,
  _Resources = unknown,
> {
  type: Block['type'];
  title: Translation;
  category: string;
  icon: IconName;
  singleton?: boolean;
  create(): Block;
  /** 指向 ProjectUiDefinition.blockViews 的注册 id。 */
  previewId: string;
  /** 指向 ProjectUiDefinition.blockEditors 的注册 id。 */
  editorId: string;
}

export interface PageBuilderDefinition<
  Block extends CoreBlock = CoreBlock,
  _Resources = unknown,
> {
  blocks: BlockDefinition<Block, _Resources>[];
  // 资源加载器与页面 DTO Adapter 在 P3 扩充
}
