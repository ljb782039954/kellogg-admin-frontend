// 图片画廊组件属性编辑器

// import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import BilingualInput from '../../components/BilingualInput';
import ImageInput from '../../components/ImageInput';
import type { GalleryContent } from '@site/ui-display/block-adapters';

export interface GalleryPropsEditorProps {
  props: GalleryContent;
  onUpdate: (props: GalleryContent) => void;
}

export function GalleryPropsEditor({ props, onUpdate }: GalleryPropsEditorProps) {
  const items = props.items || [];

  const addItem = () => {
    onUpdate({
      ...props,
      items: [...items, { src: '', caption: { zh: '', en: '' } }],
    });
  };

  const updateItem = (index: number, field: string, value: unknown) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onUpdate({ ...props, items: newItems });
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onUpdate({ ...props, items: newItems });
  };

  return (
    <div className="space-y-6">
      {/* 标题设置 */}
      <div className="space-y-3 pb-4 border-b">
        <h4 className="font-medium text-sm text-gray-700">标题设置</h4>
        <BilingualInput
          label="标题"
          value={props.title || { zh: '', en: '' }}
          onChange={(val) => onUpdate({ ...props, title: val })}
        />
        <BilingualInput
          label="副标题"
          value={props.subtitle || { zh: '', en: '' }}
          onChange={(val) => onUpdate({ ...props, subtitle: val })}
        />
      </div>

      {/* 布局设置 */}
      {/* <div className="space-y-3 pb-4 border-b">
        <h4 className="font-medium text-sm text-gray-700">布局设置</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>布局方式</Label>
            <Select
              value={props.layout || 'grid'}
              onValueChange={(val) => onUpdate({ ...props, layout: val })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">网格布局</SelectItem>
                <SelectItem value="masonry">瀑布流</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>列数</Label>
            <Select
              value={String(props.columns || 3)}
              onValueChange={(val) => onUpdate({ ...props, columns: parseInt(val) })}
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
        </div>
      </div> */}

      {/* 图片列表 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm text-gray-700">图片列表 (Items)</h4>
          <Button size="sm" variant="outline" onClick={addItem}>
            <Plus className="w-4 h-4 mr-1" />
            添加 (Add)
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            <p className="text-sm">暂无图片</p>
            <p className="text-xs mt-1">点击上方按钮添加</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {items.map((item, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">图片 {index + 1}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-600 h-6 w-6 p-0"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
                <ImageInput
                  value={item.src}
                  onChange={(val) => updateItem(index, 'src', val)}
                  aspectRatio="square"
                />
                <BilingualInput
                  label="说明文字"
                  value={item.caption || { zh: '', en: '' }}
                  onChange={(val) => updateItem(index, 'caption', val)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
