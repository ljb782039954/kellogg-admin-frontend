import { type PageBlock } from '../../types';
import { componentsByCategory } from '../../metadata/componentRegistry';
import type { BlockType } from '../../ui-display/types';
import { BlockFormEditor } from '../../../../core-adminApp/ui/Management/blockForm/BlockFormEditor';
import { blockEditorSchemas } from '../propsEditors/blockEditorSchemas';

const editableBlockTypes = new Set<BlockType>(
  Object.values(componentsByCategory).flat(),
);

function isEditableBlockType(type: BlockType) {
  return editableBlockTypes.has(type);
}

export function PropsEditorSwitch({
  block,
  onUpdate,
}: {
  block: PageBlock;
  onUpdate: (content: unknown) => void;
}) {
  const content = block.content as Record<string, unknown>;
  const schema = blockEditorSchemas[block.type];

  if (!isEditableBlockType(block.type) || !schema) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-sm text-gray-500">
        当前积木块不在添加弹窗的可编辑列表中，暂不提供属性编辑器。
      </div>
    );
  }

  return (
    <BlockFormEditor
      content={content}
      schema={schema}
      onUpdate={onUpdate}
    />
  );
}
