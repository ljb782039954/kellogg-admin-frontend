// 布局属性编辑器（用于全局数据组件的局部配置）
import { type PageBlock } from '@/types';
import { Label } from '@/ui/primitives/label';
import { Input } from '@/ui/primitives/input';
import { Switch } from '@/ui/primitives/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/primitives/select';
import BilingualInput from '@/ui/forms/BilingualInput';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/ui/primitives/collapsible';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface Props {
  block: PageBlock;
  onUpdate: (content: any) => void;
}

export function LayoutPropsEditor({ block, onUpdate }: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const content = block.content as Record<string, unknown>;

  // 根据组件类型决定显示哪些布局选项
  const layoutOptions = getLayoutOptions(block.type);

  if (layoutOptions.length === 0) return null;

  const handleChange = (key: string, value: unknown) => {
    onUpdate({ ...content, [key]: value });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border rounded-lg">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-gray-50">
        <span className="font-medium text-sm">显示设置 (Display)</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4 pt-0 space-y-4">
        {layoutOptions.includes('title') && (
          <div className="space-y-2">
            <Label>区块标题</Label>
            <BilingualInput
              value={(content.title as { zh: string; en: string }) || { zh: '', en: '' }}
              onChange={(value) => handleChange('title', value)}
              placeholder={{ zh: '请输入中文标题', en: 'Enter English title' }}
            />
          </div>
        )}

        {layoutOptions.includes('subtitle') && (
          <div className="space-y-2">
            <Label>副标题</Label>
            <BilingualInput
              value={(content.subtitle as { zh: string; en: string }) || { zh: '', en: '' }}
              onChange={(value) => handleChange('subtitle', value)}
              placeholder={{ zh: '请输入中文副标题', en: 'Enter English subtitle' }}
            />
          </div>
        )}

        {layoutOptions.includes('maxItems') && (
          <div className="space-y-2">
            <Label>显示数量</Label>
            <Input
              type="number"
              min={1}
              max={50}
              value={(content.maxItems as number) || 8}
              onChange={(e) => handleChange('maxItems', parseInt(e.target.value) || 8)}
            />
          </div>
        )}

        {layoutOptions.includes('layout') && (
          <div className="space-y-2">
            <Label>布局方式</Label>
            <Select
              value={(content.layout as string) || 'grid'}
              onValueChange={(value) => handleChange('layout', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">网格布局 (Grid)</SelectItem>
                <SelectItem value="slider">滑动布局 (Slider)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {layoutOptions.includes('autoPlay') && (
          <div className="flex items-center justify-between">
            <Label>自动播放</Label>
            <Switch
              checked={(content.autoPlay as boolean) ?? true}
              onCheckedChange={(checked) => handleChange('autoPlay', checked)}
            />
          </div>
        )}

        {layoutOptions.includes('interval') && (
          <div className="space-y-2">
            <Label>切换间隔（毫秒）</Label>
            <Input
              type="number"
              min={1000}
              max={10000}
              step={500}
              value={(content.interval as number) || 5000}
              onChange={(e) => handleChange('interval', parseInt(e.target.value) || 5000)}
            />
          </div>
        )}

        {layoutOptions.includes('showMoreLink') && (
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>显示"查看更多"</Label>
            </div>
            <Switch
              checked={(content.showMoreLink as boolean) ?? true}
              onCheckedChange={(checked) => handleChange('showMoreLink', checked)}
            />
          </div>
        )}

        {layoutOptions.includes('showButton') && (
          <div className="flex items-center justify-between">
            <Label>显示按钮</Label>
            <Switch
              checked={(content.showButton as boolean) ?? true}
              onCheckedChange={(checked) => handleChange('showButton', checked)}
            />
          </div>
        )}

        {layoutOptions.includes('buttonText') && (content.showButton as boolean) !== false && (
          <div className="space-y-2">
            <Label>按钮文字</Label>
            <BilingualInput
              value={(content.buttonText as { zh: string; en: string }) || { zh: '了解更多', en: 'Learn More' }}
              onChange={(value) => handleChange('buttonText', value)}
              placeholder={{ zh: '按钮文字', en: 'Button text' }}
            />
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

// 根据组件类型返回可配置的布局选项
function getLayoutOptions(type: string): string[] {
  switch (type) {
    case 'carousel':
      return ['autoPlay', 'interval'];
    case 'newArrivals':
    case 'featuredProducts':
      return ['title', 'subtitle', 'maxItems', 'layout'];
    case 'testimonials':
      return ['title', 'subtitle', 'maxItems'];
    case 'brandValues':
    case 'statistics':
      return ['title', 'subtitle'];
    case 'aboutPreview':
      return ['title', 'subtitle', 'showButton', 'buttonText'];
    case 'faqPreview':
      return ['title', 'subtitle', 'maxItems', 'showMoreLink'];
    case 'categories':
      return ['maxItems'];
    default:
      return [];
  }
}
