// 添加积木块组件弹窗
import { useState } from 'react';
import { nanoid } from 'nanoid';
import { Lock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { type BlockType, type PageBlock, type ComponentCategory } from '../types/blocks';
import {
  componentRegistry,
  componentsByCategory,
  categoryNames,
  canAddBlock,
} from '../metadata/componentRegistry';
import BlockThumbnail from './BlockThumbnail';

interface AddBlockDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (block: PageBlock) => void;
  existingBlocks: { type: BlockType }[];
}

export function AddBlockDialog({
  open,
  onClose,
  onAdd,
  existingBlocks,
}: AddBlockDialogProps) {
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory>('product');

  const handleAddBlock = (type: BlockType) => {
    const meta = componentRegistry[type];
    const newBlock: PageBlock = {
      id: `block_${nanoid(8)}`,
      type,
      isVisible: true,
      content: { ...meta.defaultProps },
    };
    onAdd(newBlock);
    onClose();
  };

  const categories = Object.keys(componentsByCategory) as ComponentCategory[];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>添加积木块组件</DialogTitle>
        </DialogHeader>

        {/* 分类标签 */}
        <div className="flex gap-2 border-b pb-3">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {categoryNames[cat].zh}
            </Button>
          ))}
        </div>

        {/* 积木块组件网格 */}
        <div className="grid grid-cols-3 gap-4 py-4 max-h-[480px] overflow-y-auto">
          {componentsByCategory[selectedCategory].map((type) => {
            const meta = componentRegistry[type];
            const canAdd = canAddBlock(type, existingBlocks);

            return (
              <button
                key={type}
                disabled={!canAdd}
                onClick={() => handleAddBlock(type)}
                className={cn(
                  'group flex flex-col rounded-xl border-2 text-left transition-all overflow-hidden',
                  canAdd
                    ? 'hover:border-primary hover:shadow-md cursor-pointer border-gray-200'
                    : 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200'
                )}
              >
                {/* 缩略图预览 */}
                <div className="relative">
                  <BlockThumbnail type={type} className="w-full h-24" />
                  {!canAdd && meta.singleton && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="bg-white rounded-full p-1.5">
                        <Lock className="w-4 h-4 text-gray-600" />
                      </div>
                    </div>
                  )}
                </div>

                {/* 组件信息 */}
                <div className="p-3 border-t bg-white">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm group-hover:text-primary transition-colors">
                      {meta.name.zh}
                    </span>
                    {meta.singleton && (
                      <Badge variant="outline" className="text-xs px-1.5 py-0">
                        唯一
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {meta.description.zh}
                  </p>
                  {!canAdd && meta.singleton && (
                    <p className="text-xs text-orange-500 mt-1 font-medium">
                      已添加至页面，不可重复添加
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
