import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import BilingualInput from '@/core-adminApp/ui/Input/BilingualInput';
import BilingualRichInput from '@/core-adminApp/ui/Input/RichInput/BilingualRichInput';
import type { BrandItem, BrandValuesContent } from '@site/ui-display/components/blocks';
// import { iconOptions } from '@/types';

export interface BrandValuesPropsEditorProps {
  props: BrandValuesContent;
  onUpdate: (props: BrandValuesContent) => void;
}

const iconOptions = [
  { value: 'Leaf', label: '🌿 环保 (Eco)' },
  { value: 'Heart', label: '❤️ 爱心 (Quality)' },
  { value: 'Star', label: '⭐ 星星 (Expert)' },
  { value: 'Shield', label: '🛡️ 盾牌 (Safe)' },
  { value: 'Award', label: '🏆 奖杯 (Award)' },
  { value: 'Users', label: '👥 用户 (Partner)' },
  { value: 'Globe', label: '🌍 地球 (Global)' },
  { value: 'Zap', label: '⚡ 闪电 (Fast)' },
];


export function BrandValuesPropsEditor({ props, onUpdate }: BrandValuesPropsEditorProps) {
  const [localItems, setLocalItems] = useState<BrandItem[]>(props.items || []);

  const saveItems = (items: BrandItem[]) => {
    setLocalItems(items);
    onUpdate({ ...props, items });
  };

  const addItems = () => {
    saveItems([
      ...localItems,
      {
        id: Math.max(0, ...localItems.map(v => v.id)) + 1,
        icon: 'Star',
        title: { zh: '新价值', en: 'New Value' },
        description: { zh: '描述内容', en: 'Description' },
      },
    ]);
  };

  const updateItems = (
    index: number,
    field: keyof BrandItem,
    value: BrandItem[keyof BrandItem],
  ) => {
    const newItems = [...localItems];
    newItems[index] = { ...newItems[index], [field]: value };
    saveItems(newItems);
  };

  const removeItems = (index: number) => {
    saveItems(localItems.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* 标题设置 */}
      <div className="space-y-3 pb-4 border-b">
        <h4 className="font-medium text-sm text-gray-700">标题设置 (Heading)</h4>
        <BilingualInput
          label="标题"
          value={props.title || { zh: '品牌价值', en: 'Brand Values' }}
          onChange={(val) => onUpdate({ ...props, title: val })}
        />
        <BilingualInput
          label="副标题"
          value={props.subtitle || { zh: '我们坚持的品质与承诺', en: 'Our commitment to quality and excellence' }}
          onChange={(val) => onUpdate({ ...props, subtitle: val })}
        />
      </div>

      {/* 价值列表 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm text-gray-700">品牌价值项 (Items)</h4>
          <Button variant="outline" size="sm" onClick={addItems}>
            <Plus className="w-4 h-4 mr-1" />
            添加 (Add)
          </Button>
        </div>

        {localItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            <p className="text-sm">暂无品牌价值项</p>
          </div>
        ) : (
          <div className="space-y-3">
            {localItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border rounded-lg overflow-hidden bg-white"
              >
                <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-medium text-gray-500">价值 {index + 1}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItems(index)}
                    className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-3 space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs">图标</Label>
                    <select
                      value={item.icon}
                      onChange={(e) => updateItems(index, 'icon', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                    >
                      {iconOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <BilingualInput
                    label="标题"
                    value={item.title}
                    onChange={(val) => updateItems(index, 'title', val)}
                  />
                  <BilingualRichInput
                    label="描述"
                    value={item.description}
                    onChange={(val) => updateItems(index, 'description', val)}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
