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
import { type BlockType, type PageBlock, type BlockCategory } from '@site/types';
import {
  componentRegistry,
  componentsByCategory,
  canAddBlock,
} from '@site/metadata/componentRegistry';
import { categoryNames } from '@site/ui-display/data/blocks';
import { blockRegistry } from '@site/ui-display/data/blocks';
import BlockLivePreview from './BlockLivePreview';

interface AddBlockDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (block: PageBlock) => void;
  existingBlocks: { type: BlockType }[];
}

function getDialogPreviewContent(type: BlockType, fallbackContent: unknown) {
  return blockRegistry.find((block) => block.type === type)?.defaultProps ?? fallbackContent;
}

function createPageBlock(type: BlockType): PageBlock {
  const meta = componentRegistry[type];

  return {
    id: `block_${nanoid(8)}`,
    type,
    isVisible: true,
    content: { ...meta.defaultProps },
  } as PageBlock;
}

export function AddBlockDialog({
  open,
  onClose,
  onAdd,
  existingBlocks,
}: AddBlockDialogProps) {
  const [selectedCategory, setSelectedCategory] = useState<BlockCategory>('product');

  const handleAddBlock = (type: BlockType) => {
    onAdd(createPageBlock(type));
    onClose();
  };

  const categories = Object.keys(componentsByCategory) as BlockCategory[];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()} >
      <DialogContent className="flex h-[92vh] w-[min(1280px,96vw)] max-w-none flex-col gap-0 overflow-hidden">
        <DialogHeader className="shrink-0 pb-4">
          <DialogTitle>添加积木块组件</DialogTitle>
        </DialogHeader>

        {/* 分类标签 */}
        <div className="flex shrink-0 gap-2 overflow-x-auto border-b pb-3">
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

        {/* 积木块组件列表 */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-4 pr-2">
          <div className="grid grid-cols-1 gap-5">
            {componentsByCategory[selectedCategory].map((type) => {
              const meta = componentRegistry[type];
              const canAdd = canAddBlock(type, existingBlocks);
              const previewContent = getDialogPreviewContent(type, meta.defaultProps);

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
                  {/* 真实组件预览 */}
                  <div className="relative">
                    <BlockLivePreview
                      type={type}
                      content={previewContent}
                      variant="card"
                      className="rounded-none border-0"
                    />
                    {!canAdd && meta.singleton && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="bg-white rounded-full p-1.5">
                          <Lock className="w-4 h-4 text-gray-600" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 组件信息 */}
                  <div className="p-3  bg-white">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-base group-hover:font-bold transition-colors">
                        {meta.name.zh}
                      </span>
                      {meta.singleton && (
                        <Badge variant="default" className="text-xs px-1.5 py-0.1 bg-orange-500 text-white ">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
