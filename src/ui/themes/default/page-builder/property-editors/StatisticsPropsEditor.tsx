import type { PropertyEditorProps } from '@/features/page-builder';
import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/ui/primitives/button';
import { Input } from '@/ui/primitives/input';
import { Label } from '@/ui/primitives/label';
import BilingualInput from '@/ui/forms/BilingualInput';
import type { Statistic, StatisticProps } from '@/components/blocks/Statistics';




export function StatisticsPropsEditor({ value, onChange }: PropertyEditorProps<StatisticProps>) {
  const [localData, setLocalData] = useState<Statistic[]>(value.items || []);

  const saveStats = (items: Statistic[]) => {
    setLocalData(items);
    onChange({ ...value, items });
  };

  const addItem = () => {
    saveStats([
      ...localData,
      {
        id: Math.max(0, ...localData.map(s => s.id)) + 1,
        value: '100+',
        label: { zh: '新统计', en: 'New Stat' },
      },
    ]);
  };

  const updateItem = (index: number, field: keyof Statistic, value: any) => {
    const newItems = [...localData];
    newItems[index] = { ...newItems[index], [field]: value };
    saveStats(newItems);
  };

  const removeItem = (index: number) => {
    saveStats(localData.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* 标题设置 */}
      <div className="space-y-3 pb-4 border-b">
        <h4 className="font-medium text-sm text-gray-700">标题设置 (Heading)</h4>
        <BilingualInput
          label="标题"
          value={value.title || { zh: '数据统计', en: 'Statistics' }}
          onChange={(val) => onChange({ ...value, title: val })}
        />
        <BilingualInput
          label="副标题"
          value={value.subtitle || { zh: '记录我们的成长时刻', en: 'Moments of our growth' }}
          onChange={(val) => onChange({ ...value, subtitle: val })}
        />
      </div>

      {/* 统计列表 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm text-gray-700">统计数据项 (Items)</h4>
          <Button variant="outline" size="sm" onClick={addItem}>
            <Plus className="w-4 h-4 mr-1" />
            添加 (Add)
          </Button>
        </div>

        {localData.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            <p className="text-sm">暂无统计数据</p>
          </div>
        ) : (
          <div className="space-y-3">
            {localData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border rounded-lg overflow-hidden bg-white"
              >
                <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-medium text-gray-500">数据 {index + 1}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(index)}
                    className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-3 space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs">数值 (如 100+、50K)</Label>
                    <Input
                      value={item.value}
                      onChange={(e) => updateItem(index, 'value', e.target.value)}
                      placeholder="100+"
                    />
                  </div>
                  <BilingualInput
                    label="标签 (Label)"
                    value={item.label}
                    onChange={(val) => updateItem(index, 'label', val)}
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
