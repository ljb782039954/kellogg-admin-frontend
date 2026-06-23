import { createElement, type ComponentType } from 'react';
import type { BlockEditorProps } from '@/core/contracts';
import { blockCatalog, blockEditorId } from '@/package/blocks';
import type { BlockType } from '@/package/types';
import type {
  PropertyEditorProps,
  PropertyEditorResources,
} from '@/features/page-builder';
import { defaultPropertyEditorRegistry } from './page-builder';

export const legacyPropertyEditorRegistry = defaultPropertyEditorRegistry;

function createLegacyEditor(type: BlockType): ComponentType<BlockEditorProps> {
  function LegacyEditor({ content, resources, onChange }: BlockEditorProps) {
    const Editor = legacyPropertyEditorRegistry[type] as
      | ComponentType<PropertyEditorProps<unknown>>
      | undefined;

    if (!Editor) {
      return <div className="py-8 text-center text-gray-400">暂无 {type} 属性编辑器</div>;
    }

    return createElement(Editor, {
      value: content,
      resources: resources as PropertyEditorResources,
      onChange,
    });
  }

  return LegacyEditor;
}

export const blockEditors = Object.fromEntries(
  (Object.keys(blockCatalog) as BlockType[]).map((type) => [
    blockEditorId(type),
    createLegacyEditor(type),
  ]),
) as Record<string, ComponentType<BlockEditorProps>>;
