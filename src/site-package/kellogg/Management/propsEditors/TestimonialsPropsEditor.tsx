// 客户评价组件属性编辑器（轻量版）
import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import BilingualInput from '../../components/BilingualInput';
import BilingualInputAera from '../../components/BilingualInputAera';
import ImageInput from '../../components/ImageInput';
import type { Testimonial, TestimonialProps } from '@site/components-web/blocks/Testimonials';

export interface TestimonialsPropsEditorProps {
  props: TestimonialProps;
  onUpdate: (props: TestimonialProps) => void;
}


export function TestimonialsPropsEditor({ props, onUpdate }: TestimonialsPropsEditorProps) {
  const [localData, setLocalData] = useState<Testimonial[]>(props.items || []);

  const saveItems = (items: Testimonial[]) => {
    setLocalData(items);
    onUpdate({ ...props, items });
  };

  const addItem = () => {
    const newId = Math.max(0, ...localData.map((i) => i.id)) + 1;
    saveItems([
      ...localData,
      {
        id: newId,
        name: { zh: '客户名称', en: 'Customer Name' },
        role: { zh: '职位', en: 'Role' },
        content: { zh: '评价内容', en: 'Review content' },
        avatar: '',
      },
    ]);
  };

  const updateItem = <K extends keyof Testimonial>(id: number, field: K, value: Testimonial[K]) => {
    saveItems(
      localData.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const removeItem = (id: number) => {
    saveItems(localData.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* 标题设置 */}
      <div className="space-y-3 pb-4 border-b">
        <h4 className="font-medium text-sm text-gray-700">标题设置 (Heading)</h4>
        <BilingualInput
          label="标题"
          value={props.title || { zh: '客户好评', en: 'Testimonials' }}
          onChange={(val) => onUpdate({ ...props, title: val })}
        />
        <BilingualInput
          label="副标题"
          value={props.subtitle || { zh: '听听我们的客户怎么说', en: 'What our customers say' }}
          onChange={(val) => onUpdate({ ...props, subtitle: val })}
        />
      </div>

      {/* 显示设置 */}
      <div className="space-y-4 pb-4 border-b">
        <h4 className="font-medium text-sm text-gray-700">显示设置 (Settings)</h4>
        <div className="space-y-2">
          <Label>显示数量</Label>
          <Input
            type="number"
            min={1}
            max={20}
            value={props.maxItems || 6}
            onChange={(e) => onUpdate({ ...props, maxItems: parseInt(e.target.value) || 6 })}
          />
        </div>
      </div>

      {/* 评价列表 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm text-gray-700">客户评价列表 (Items)</h4>
          <Button variant="outline" size="sm" onClick={addItem}>
            <Plus className="w-4 h-4 mr-1" />
            添加 (Add)
          </Button>
        </div>

        {localData.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            <p className="text-sm">暂无客户评价</p>
          </div>
        ) : (
          <div className="space-y-3">
            {localData.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border rounded-lg overflow-hidden bg-white"
              >
                <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-medium text-gray-500">评价 {index + 1}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-3 space-y-3">
                  <div className="flex gap-3">
                    <div className="w-20 flex-shrink-0">
                      <ImageInput
                        label="头像"
                        value={item.avatar}
                        onChange={(val) => updateItem(item.id, 'avatar', val)}
                        aspectRatio="square"
                        maxWidth={100}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <BilingualInput
                        label="姓名"
                        value={item.name}
                        onChange={(val) => updateItem(item.id, 'name', val)}
                      />
                      <BilingualInput
                        label="职位/身份"
                        value={item.role}
                        onChange={(val) => updateItem(item.id, 'role', val)}
                      />
                    </div>
                  </div>
                  <BilingualInputAera
                    label="评价内容"
                    value={item.content}
                    onChange={(val) => updateItem(item.id, 'content', val)}
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
