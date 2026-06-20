import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/ui/primitives/button';
import { Input } from '@/ui/primitives/input';
import { Label } from '@/ui/primitives/label';
import { Switch } from '@/ui/primitives/switch';
import BilingualInput from '@/ui/forms/BilingualInput';
import ImageInput from '@/ui/media/ImageInput';
import { LinkSelector } from '@/ui/navigation/LinkSelector';
import { ensureNavLink } from '@/lib/linkUtils';
import type { CarouselValues, CarouselProps } from '@/components/blocks/Carousel';
import type { PropertyEditorProps } from '@/features/page-builder';

export function CarouselPropsEditor({
  value,
  onChange,
  resources,
}: PropertyEditorProps<CarouselProps>) {
  const { pages } = resources;
  const [localData, setLocalData] = useState<CarouselValues[]>(value.items || []);

  const saveItems = (items: CarouselValues[]) => {
    setLocalData(items);
    onChange({ ...value, items });
  };

  const addItem = () => {
    saveItems([
      ...localData,
      {
        id: Math.max(0, ...localData.map(s => s.id)) + 1,
        image: '',
        title: { zh: '新幻灯片', en: 'New Slide' },
        subtitle: { zh: '副标题', en: 'Subtitle' },
        cta: { zh: '了解更多', en: 'Learn More' },
        link: ensureNavLink(''),
      },
    ]);
  };

  const updateItems = <K extends keyof CarouselValues>(
    index: number,
    field: K,
    itemValue: CarouselValues[K]
  ) => {
    const newItems = [...localData];
    newItems[index] = { ...newItems[index], [field]: itemValue };
    saveItems(newItems);
  };

  const removeItems = (index: number) => {
    saveItems(localData.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* 播放设置 */}
      <div className="space-y-4 pb-4 border-b">
        <h4 className="font-medium text-sm text-gray-700">播放设置 (Settings)</h4>
        <div className="flex items-center justify-between">
          <Label>自动播放</Label>
          <Switch
            checked={value.autoPlay !== false}
            onCheckedChange={(checked) => onChange({ ...value, autoPlay: checked })}
          />
        </div>
        <div className="space-y-2">
          <Label>切换间隔（毫秒）</Label>
          <Input
            type="number"
            min={1000}
            step={500}
            value={value.interval || 5000}
            onChange={(e) => onChange({ ...value, interval: parseInt(e.target.value) || 5000 })}
          />
        </div>
      </div>

      {/* 幻灯片列表 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm text-gray-700">幻灯片列表 (Slides)</h4>
          <Button variant="outline" size="sm" onClick={addItem}>
            <Plus className="w-4 h-4 mr-1" />
            添加 (Add)
          </Button>
        </div>

        {localData.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            <p className="text-sm">暂无幻灯片</p>
          </div>
        ) : (
          <div className="space-y-4">
            {localData.map((slide, index) => (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border rounded-lg overflow-hidden bg-white"
              >
                <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-medium text-gray-500">幻灯片 {index + 1}</span>
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
                <div className="p-3 space-y-4">
                  <ImageInput
                    label="背景图片"
                    value={slide.image}
                    onChange={(val) => updateItems(index, 'image', val)}
                    aspectRatio="video"
                  />
                  <div className="grid grid-cols-1 gap-3">
                    <BilingualInput
                      label="标题"
                      value={slide.title}
                      onChange={(val) => updateItems(index, 'title', val)}
                    />
                    <BilingualInput
                      label="副标题"
                      value={slide.subtitle || { zh: '', en: '' }}
                      onChange={(val) => updateItems(index, 'subtitle', val)}
                    />
                  </div>
                  <div className="pt-3 border-t">
                    <Label className="text-xs mb-2 block">跳转按钮 (Action Button)</Label>
                    <LinkSelector
                      value={ensureNavLink(slide.link, slide.cta)}
                      pages={pages}
                      onChange={(val) => {
                        const newItems = [...localData];
                        newItems[index] = {
                          ...newItems[index],
                          link: val,
                          cta: val.name, // 同步按钮文字
                        };
                        saveItems(newItems);
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
