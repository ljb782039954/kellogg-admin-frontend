import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, EyeOff, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/shared/utils';
import { type PageBlock } from '@/types';
import { getBlockCatalogItem } from '@/features/page-builder/model/blockCatalog';
import { Button } from '@/package/ui/primitives/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/package/ui/primitives/tooltip';
import BlockThumbnail from '../block-picker/BlockThumbnail';

interface BlockItemProps {
  block: PageBlock;
  isSelected: boolean;
  isFirst: boolean;
  isLast: boolean;
  onSelect: () => void;
  onToggle: () => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function BlockItem({
  block,
  isSelected,
  isFirst,
  isLast,
  onSelect,
  onToggle,
  onRemove,
  onMoveUp,
  onMoveDown,
}: BlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const meta = getBlockCatalogItem(block.type);

  if (!meta) {
    return (
      <div className="flex items-center justify-between p-4 bg-red-50 border-2 border-dashed border-red-200 rounded-xl text-red-500">
        <div className="flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          <span className="text-sm font-medium">未知组件类型: {block.type}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={onRemove} className="text-red-500 hover:text-red-700 hover:bg-red-100">
          删除
        </Button>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-stretch gap-0 rounded-xl border-2 bg-white transition-all overflow-hidden',
        isSelected && 'ring-2 ring-primary border-primary shadow-md',
        isDragging && 'opacity-50 shadow-xl scale-105',
        !block.isVisible && 'opacity-60',
      )}
    >
      <div className="flex flex-col items-center justify-center bg-gray-50 border-r px-1 py-2 gap-1">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded transition-colors"
          title="拖拽排序"
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
          disabled={isFirst}
          className={cn(
            'p-0.5 rounded transition-colors',
            isFirst ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700',
          )}
          title="上移"
        >
          <ChevronUp className="w-4 h-4" />
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
          disabled={isLast}
          className={cn(
            'p-0.5 rounded transition-colors',
            isLast ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700',
          )}
          title="下移"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      <button onClick={onSelect} className="w-20 h-16 flex-shrink-0 hover:opacity-80 transition-opacity">
        <BlockThumbnail type={block.type} className="w-full h-full" />
      </button>

      <div className="flex-1 flex items-center px-3 min-w-0">
        <button onClick={onSelect} className="flex-1 text-left min-w-0">
          <span className={cn('font-medium text-sm block truncate transition-colors', isSelected ? 'text-primary' : 'hover:text-primary')}>
            {meta.name.zh}
          </span>
          <span className="text-xs text-gray-400 block truncate">{meta.description.zh}</span>
        </button>

        <div className="flex items-center gap-0.5 ml-2 flex-shrink-0">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); onToggle(); }}>
                  {block.isVisible ? <Eye className="w-4 h-4 text-gray-500" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{block.isVisible ? '点击隐藏组件' : '点击显示组件'}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-500 hover:bg-red-50" onClick={(e) => { e.stopPropagation(); onRemove(); }}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>删除组件</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
