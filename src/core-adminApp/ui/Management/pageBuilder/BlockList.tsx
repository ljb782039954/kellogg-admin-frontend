// 可拖拽的积木块列表组件
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
// import { type CmsPageBlock } from '@site/types';
import { type CmsPageBlock } from '@/cms/types';
import { BlockItem } from './BlockItem';

interface BlockListProps {
  blocks: CmsPageBlock[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}

export function BlockList({
  blocks,
  selectedId,
  onSelect,
  onToggle,
  onRemove,
  onMoveUp,
  onMoveDown,
}: BlockListProps) {
  if (blocks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 border-2 border-dashed rounded-xl bg-gray-50/50">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-200 flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        </div>
        <p className="text-sm font-medium">暂无积木块</p>
        <p className="text-xs mt-1">点击下方按钮添加积木块组件</p>
      </div>
    );
  }

  return (
    <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
      <div className="space-y-3">
        {blocks.map((block, index) => (
          <BlockItem
            key={block.id}
            block={block}
            isSelected={selectedId === block.id}
            isFirst={index === 0}
            isLast={index === blocks.length - 1}
            onSelect={() => onSelect(block.id)}
            onToggle={() => onToggle(block.id)}
            onRemove={() => onRemove(block.id)}
            onMoveUp={() => onMoveUp(block.id)}
            onMoveDown={() => onMoveDown(block.id)}
          />
        ))}
      </div>
    </SortableContext>
  );
}
