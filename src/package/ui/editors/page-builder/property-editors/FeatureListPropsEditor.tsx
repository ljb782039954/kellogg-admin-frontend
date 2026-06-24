import type { PropertyEditorProps } from '@/features/page-builder';
// 特性列表组件属性编辑器

import { Label } from '@/package/ui/primitives/label';
import { Button } from '@/package/ui/primitives/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/package/ui/primitives/select';
import { Plus, Trash2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import BilingualInput from '@/package/ui/forms/BilingualInput';
import BilingualRichInput from '@/package/ui/forms/rich-text/BilingualRichInput';
// import { commonFeatureIcons } from '@/types/editor';
import type { FeatureListProps } from '@/package/ui/blocks/blocks/FeatureList';

const commonFeatureIcons = [
  'Truck', 'RotateCcw', 'Shield', 'Headphones', 'CreditCard', 'Gift',
  'Star', 'Heart', 'Check', 'Award', 'Zap', 'Clock',
  'ThumbsUp', 'Lock', 'Globe', 'Users', 'Package', 'Sparkles',
];




export function FeatureListPropsEditor({ value, onChange }: PropertyEditorProps<FeatureListProps>) {
  const items = value.items || [];

  const addItems = () => {
    onChange({
      ...value,
      items: [...items, { icon: 'Star', title: { zh: '', en: '' }, description: { zh: '', en: '' } }],
    });
  };

  const updateItems = (index: number, field: string, val: unknown) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: val };
    onChange({ ...value, items: newItems });
  };

  const removeItems = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange({ ...value, items: newItems });
  };

  return (
    <div className="space-y-6">
      {/* 标题设置 */}
      <div className="space-y-3 pb-4 border-b">
        <h4 className="font-medium text-sm text-gray-700">标题设置</h4>
        <BilingualInput
          label="标题"
          value={value.title || { zh: '', en: '' }}
          onChange={(val) => onChange({ ...value, title: val })}
        />
        <BilingualInput
          label="副标题"
          value={value.subtitle || { zh: '', en: '' }}
          onChange={(val) => onChange({ ...value, subtitle: val })}
        />
      </div>

      {/* 布局设置 */}
      {/* <div className="space-y-3 pb-4 border-b">
        <h4 className="font-medium text-sm text-gray-700">布局设置</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>布局方式</Label>
            <Select
              value={value.layout || 'grid'}
              onValueChange={(val) => onChange({ ...value, layout: val })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">网格布局</SelectItem>
                <SelectItem value="list">列表布局</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {value.layout !== 'list' && (
            <div className="space-y-2">
              <Label>列数</Label>
              <Select
                value={String(value.columns || 3)}
                onValueChange={(val) => onChange({ ...value, columns: parseInt(val) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 列</SelectItem>
                  <SelectItem value="3">3 列</SelectItem>
                  <SelectItem value="4">4 列</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div> */}

      {/* 特性列表 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm text-gray-700">特性项目</h4>
          <Button size="sm" variant="outline" onClick={addItems}>
            <Plus className="w-4 h-4 mr-1" />
            添加
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            <p className="text-sm">暂无特性项目</p>
            <p className="text-xs mt-1">点击上方按钮添加</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((feature, index) => {
              const SelectedIcon =
                (LucideIcons as unknown as Record<string, LucideIcon>)[
                  feature.icon
                ] || LucideIcons.Star;
              return (
                <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <SelectedIcon className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium">特性 {index + 1}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => removeItems(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>图标</Label>
                    <Select
                      value={feature.icon}
                      onValueChange={(val) => updateItems(index, 'icon', val)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {commonFeatureIcons.map((iconName) => {
                          const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[iconName];
                          return (
                            <SelectItem key={iconName} value={iconName}>
                              <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4" />
                                <span>{iconName}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <BilingualInput
                    label="标题"
                    value={feature.title}
                    onChange={(val) => updateItems(index, 'title', val)}
                  />
                  <BilingualRichInput
                    label="描述"
                    value={feature.description}
                    onChange={(val) => updateItems(index, 'description', val)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
