import { useState } from 'react';
import { Lock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/package/ui/primitives/dialog';
import { Button } from '@/package/ui/primitives/button';
import { Badge } from '@/package/ui/primitives/badge';
import { cn } from '@/shared/utils';
import type { BlockType, ComponentCategory } from '@/types';
import {
  componentsByCategory,
  categoryNames,
} from '../../model/blockCatalog';
import type { AvailableBlock } from '../../model/pageBuilder.types';
import BlockThumbnail from './BlockThumbnail';

interface AddBlockDialogProps {
  open: boolean;
  items: AvailableBlock[];
  onOpenChange(open: boolean): void;
  onAdd(type: BlockType): void;
}

export function AddBlockDialog({
  open,
  onOpenChange,
  onAdd,
  items,
}: AddBlockDialogProps) {
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory>('product');

  const handleAddBlock = (type: BlockType) => {
    onAdd(type);
    onOpenChange(false);
  };

  const categories = Object.keys(componentsByCategory) as ComponentCategory[];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>添加积木块组件</DialogTitle>
        </DialogHeader>

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

        <div className="grid grid-cols-3 gap-4 py-4 max-h-[480px] overflow-y-auto">
          {items
            .filter((item) => item.category === selectedCategory)
            .map((item) => (
              <button
                key={item.type}
                disabled={!item.canAdd}
                onClick={() => handleAddBlock(item.type)}
                className={cn(
                  'group flex flex-col rounded-xl border-2 text-left transition-all overflow-hidden',
                  item.canAdd
                    ? 'hover:border-primary hover:shadow-md cursor-pointer border-gray-200'
                    : 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200',
                )}
              >
                <div className="relative">
                  <BlockThumbnail type={item.type} className="w-full h-24" />
                  {!item.canAdd && item.singleton && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="bg-white rounded-full p-1.5">
                        <Lock className="w-4 h-4 text-gray-600" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-3 border-t bg-white">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm group-hover:text-primary transition-colors">
                      {item.name.zh}
                    </span>
                    {item.singleton && (
                      <Badge variant="outline" className="text-xs px-1.5 py-0">
                        唯一
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {item.description.zh}
                  </p>
                  {!item.canAdd && item.singleton && (
                    <p className="text-xs text-orange-500 mt-1 font-medium">
                      已添加至页面，不可重复添加
                    </p>
                  )}
                </div>
              </button>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
