import type { PropertyEditorProps } from '@/features/page-builder';
// 合作伙伴组件属性编辑器

import { Label } from '@/ui/primitives/label';
import { Input } from '@/ui/primitives/input';
import { Button } from '@/ui/primitives/button';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/ui/primitives/select';
import { nanoid } from 'nanoid';
import { Plus, Trash2 } from 'lucide-react';
import BilingualInput from '@/ui/forms/BilingualInput';
import ImageInput from '@/ui/media/ImageInput';
import type { PartnerProps } from '@/package/ui/blocks/blocks/PartnerLogos';


export function PartnerLogosPropsEditor({ value, onChange }: PropertyEditorProps<PartnerProps>) {
  const items = value.items || [];

  const addItem = () => {
    onChange({
      ...value,
      items: [...items, { id: nanoid(8), logo: '', name: '', link: '' }],
    });
  };

  const updateItem = (id: string, field: string, val: string) => {
    const newItems = items.map(item => 
      item.id === id ? { ...item, [field]: val } : item
    );
    onChange({ ...value, items: newItems });
  };

  const removeItem = (id: string) => {
    const newItems = items.filter((item) => item.id !== id);
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

      {/* 显示设置 */}
      {/* <div className="space-y-3 pb-4 border-b">
        <h4 className="font-medium text-sm text-gray-700">显示设置</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>布局方式</Label>
            <Select
              value={value.layout || 'grid'}
              onValueChange={(val: 'row' | 'grid') => onChange({ ...value, layout: val })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="row">单行滚动</SelectItem>
                <SelectItem value="grid">网格展示</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div> */}

      {/* Logo 列表 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm text-gray-700">合作伙伴清单 (Partners)</h4>
          <Button size="sm" variant="outline" onClick={addItem}>
            <Plus className="w-4 h-4 mr-1" />
            添加 (Add)
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            <p className="text-sm">暂无合作伙伴</p>
            <p className="text-xs mt-1">点击上方按钮添加</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((partner, index) => (
              <div key={partner.id || index} className="p-4 bg-gray-50 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">合作伙伴 {index + 1}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => removeItem(partner.id!)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <ImageInput
                  label="Logo 图片"
                  value={partner.logo}
                  onChange={(val) => updateItem(partner.id!, 'logo', val)}
                  aspectRatio="video"
                  maxWidth={200}
                />
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>品牌名称</Label>
                    <Input
                      value={partner.name}
                      onChange={(e) => updateItem(partner.id!, 'name', e.target.value)}
                      placeholder="如 Brand Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>品牌主色 (Hex)</Label>
                    <Input
                      value={partner.color || ''}
                      onChange={(e) => updateItem(partner.id!, 'color', e.target.value)}
                      placeholder="如 #FF0000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>链接（可选）</Label>
                  <Input
                    value={partner.link || ''}
                    onChange={(e) => updateItem(partner.id!, 'link', e.target.value)}
                    placeholder="如 https://example.com"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
