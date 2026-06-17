import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Trash2, GripVertical } from 'lucide-react';
import type { Category } from '@/types';
import BilingualInput from '@/admin/components/BilingualInput';
import ImageInput from '@/admin/components/ImageInput';

interface CategoryListItemProps {
  category: Category;
  index: number;
  onUpdate: (index: number, patch: Partial<Category>) => void;
  onRemove: (index: number) => void;
}

export function CategoryListItem({ category, index, onUpdate, onRemove }: CategoryListItemProps) {
  const updateName = useCallback(
    (name: { zh: string; en: string }) => {
      onUpdate(index, { name });
    },
    [index, onUpdate],
  );

  const updateImage = useCallback(
    (image: string) => {
      onUpdate(index, { image });
    },
    [index, onUpdate],
  );

  return (
    <motion.div
      key={category.id}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl group"
    >
      <GripVertical className="w-4 h-4 text-gray-300" />
      <div className="flex-1 space-y-4">
        <BilingualInput
          label=""
          value={category.name}
          onChange={updateName}
          placeholder={{ zh: '分类名称', en: 'Category Name' }}
        />

        <div className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg bg-white">
          <div className="flex-shrink-0 w-24">
            <p className="text-xs font-bold text-gray-500 uppercase mb-2">分类主图</p>
            <ImageInput
              value={category.image || ''}
              onChange={updateImage}
              aspectRatio="square"
              maxWidth={100}
            />
          </div>
          <div className="flex-1 text-sm text-gray-400 mt-6">
            在拥有导航画廊、大型精选分类展示区等场合作为展示海报。可选配。
          </div>
        </div>
      </div>
      <div className="text-xs font-mono text-gray-400 bg-white px-2 py-1 rounded border border-gray-100">
        ID: {category.id}
      </div>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
