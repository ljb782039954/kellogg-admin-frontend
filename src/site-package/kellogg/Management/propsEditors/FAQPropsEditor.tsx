import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import BilingualInput from '../../components/BilingualInput';
import type { FAQItem, FAQProps } from '@/components/blocks/Faq';

export interface FAQPropsEditorPropsEditorProps {
  props: FAQProps;
  onUpdate: (props: FAQProps) => void;
}

export function FAQPropsEditor({ props, onUpdate }: FAQPropsEditorPropsEditorProps) {
  const [localItems, setLocalItems] = useState<FAQItem[]>(props.items || []);

  const saveItems = (items: FAQItem[]) => {
    setLocalItems(items);
    onUpdate({ ...props, items });
  };

  const addItem = () => {
    const newId = Math.max(...localItems.map((i) => i.id), 0) + 1;
    saveItems([
      ...localItems,
      {
        id: newId,
        question: { zh: '新问题', en: 'New Question' },
        answer: { zh: '在这里输入回答...', en: 'Enter answer here...' },
      },
    ]);
  };

  const updateItem = (id: number, field: 'question' | 'answer', value: { zh: string; en: string }) => {
    saveItems(
      localItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const removeItem = (id: number) => {
    saveItems(localItems.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* 标题设置 */}
      <div className="space-y-3 pb-4 border-b">
        <h4 className="font-medium text-sm text-gray-700">标题设置 (Heading)</h4>
        <BilingualInput
          label="标题"
          value={props.title || { zh: '常见问题', en: 'FAQ' }}
          onChange={(val) => onUpdate({ ...props, title: val })}
        />
        <BilingualInput
          label="副标题"
          value={props.subtitle || { zh: '在这里您可以找到常见问题的解答', en: 'Find answers to common questions here' }}
          onChange={(val) => onUpdate({ ...props, subtitle: val })}
        />
      </div>

      {/* FAQ 列表 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm text-gray-700">FAQ 列表 (List)</h4>
          <Button variant="outline" size="sm" onClick={addItem}>
            <Plus className="w-4 h-4 mr-1" />
            添加 (Add)
          </Button>
        </div>

        {localItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            <p className="text-sm">暂无 FAQ 项目</p>
          </div>
        ) : (
          <div className="space-y-3">
            {localItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border rounded-lg overflow-hidden bg-white"
              >
                <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-medium text-gray-500">问题 {index + 1}</span>
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
                  {/* 问题 */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">问题 (中)</Label>
                      <Input
                        value={item.question.zh}
                        onChange={(e) => updateItem(item.id, 'question', { ...item.question, zh: e.target.value })}
                        placeholder="问题中文"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">问题 (EN)</Label>
                      <Input
                        value={item.question.en}
                        onChange={(e) => updateItem(item.id, 'question', { ...item.question, en: e.target.value })}
                        placeholder="Question in English"
                      />
                    </div>
                  </div>
                  {/* 回答 */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">回答 (中)</Label>
                      <Textarea
                        value={item.answer.zh}
                        onChange={(e) => updateItem(item.id, 'answer', { ...item.answer, zh: e.target.value })}
                        placeholder="回答中文"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">回答 (EN)</Label>
                      <Textarea
                        value={item.answer.en}
                        onChange={(e) => updateItem(item.id, 'answer', { ...item.answer, en: e.target.value })}
                        placeholder="Answer in English"
                        rows={3}
                      />
                    </div>
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
