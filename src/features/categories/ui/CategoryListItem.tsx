import { useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, GripVertical } from 'lucide-react';
import type { Category } from '@/types';
import { BilingualTextControl } from '@/shared/forms/controls/BilingualTextControl';
import ImageInput from '@/admin/components/ImageInput';

interface CategoryListItemProps {
  category: Category;
  onUpdateName: (id: string, name: { zh: string; en: string }) => void;
  onUpdateImage: (id: string, image: string) => void;
  onRemove: (id: string) => void;
}

export function CategoryListItem({
  category,
  onUpdateName,
  onUpdateImage,
  onRemove,
}: CategoryListItemProps) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [saving, setSaving] = useState(false);

  const debouncedUpdate = useCallback(
    (fn: () => void) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setSaving(true);
        Promise.resolve(fn()).finally(() => setSaving(false));
      }, 600);
    },
    [],
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl group"
    >
      <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
      <div className="flex-1 space-y-4">
        <BilingualTextControl
          label=""
          value={category.name}
          onChange={(name) => debouncedUpdate(() => onUpdateName(category.id, name))}
          placeholder={{ zh: '分类名称', en: 'Category Name' }}
        />

        <div className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg bg-white">
          <div className="flex-shrink-0 w-24">
            <p className="text-xs font-bold text-gray-500 uppercase mb-2">分类主图</p>
            <ImageInput
              value={category.image || ''}
              onChange={(image) => onUpdateImage(category.id, image)}
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
        {saving && <span className="ml-1 text-blue-400 animate-pulse">...</span>}
      </div>
      <button
        type="button"
        onClick={() => onRemove(category.id)}
        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
