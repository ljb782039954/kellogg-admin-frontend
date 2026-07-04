// 单个区块项组件（可拖拽 + 上下移动按钮）

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, EyeOff, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type PageBlock } from '../../types';
import { componentRegistry } from '../../metadata/componentRegistry';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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

  const meta = componentRegistry[block.type];

  // 如果组件类型不存在于注册表中，显示错误占位符
  if (!meta) {
    return (
      <div className="flex items-center justify-between p-4 bg-red-50 border-2 border-dashed border-red-200 rounded-xl text-red-500">
        <div className="flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          <span className="text-sm font-medium">未知组件类型: {block.type}</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 hover:bg-red-100"
        >
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
        !block.isVisible && 'opacity-60'
      )}
    >
      {/* 左侧：拖拽手柄 + 上下移动 */}
      <div className="flex flex-col items-center justify-center bg-gray-50 border-r px-1 py-2 gap-1">
        {/* 拖拽手柄 */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded transition-colors"
          title="拖拽排序"
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </button>

        {/* 上移按钮 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMoveUp();
          }}
          disabled={isFirst}
          className={cn(
            'p-0.5 rounded transition-colors',
            isFirst ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'
          )}
          title="上移"
        >
          <ChevronUp className="w-4 h-4" />
        </button>

        {/* 下移按钮 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMoveDown();
          }}
          disabled={isLast}
          className={cn(
            'p-0.5 rounded transition-colors',
            isLast ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'
          )}
          title="下移"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* 右侧：名称和操作。真实组件样式在编辑器顶部展示，列表只做结构管理。 */}
      <div className="flex-1 flex items-center px-3 py-3 min-w-0">
        <button
          onClick={onSelect}
          className="flex-1 text-left min-w-0"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className={cn(
              'font-medium text-sm block truncate transition-colors',
              isSelected ? 'text-primary' : 'hover:text-primary'
            )}>
              {meta.name.zh}
            </span>
            {!block.isVisible && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-gray-400">
                已隐藏
              </Badge>
            )}
          </div>
          <span className="text-xs text-gray-400 block truncate">
            {meta.description.zh}
          </span>
          <span className="text-[10px] text-gray-300 block truncate mt-0.5">
            {block.type}
          </span>
        </button>

        {/* 操作按钮 */}
        <div className="flex items-center gap-0.5 ml-2 flex-shrink-0">
          <TooltipProvider delayDuration={300}>
            {/* 显示/隐藏 */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle();
                  }}
                >
                  {block.isVisible ? (
                    <Eye className="w-4 h-4 text-gray-500" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {block.isVisible ? '点击隐藏组件' : '点击显示组件'}
              </TooltipContent>
            </Tooltip>

            {/* 删除 */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:text-red-500 hover:bg-red-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                  }}
                >
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
