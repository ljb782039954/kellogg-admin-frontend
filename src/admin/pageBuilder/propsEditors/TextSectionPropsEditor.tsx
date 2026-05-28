// 文本区块属性编辑器
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import BilingualInput from '../../components/BilingualInput';
import BilingualRichInput from '../../components/BilingualRichInput';
import type { TextSectionProps } from '@/components/blocks/TextSection';

export interface TextSectionPropsEditorProps {
  props: TextSectionProps;
  onUpdate: (props: TextSectionProps) => void;
}

export function TextSectionPropsEditor({ props, onUpdate }: TextSectionPropsEditorProps) {
  const handleChange = (key: string, value: unknown) => {
    onUpdate({ ...props, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="space-y-2">
        <Label>标题</Label>
        <BilingualInput
          value={props.title || { zh: '', en: '' }}
          onChange={(value) => handleChange('title', value)}
          placeholder={{ zh: '请输入中文标题', en: 'Enter English title' }}
        />
      </div>

      {/* 内容 */}
      <BilingualRichInput
        label="内容"
        value={props.content || { zh: '', en: '' }}
        onChange={(val) => handleChange('content', val)}
        placeholder={{ zh: '请输入中文内容', en: 'Enter English content' }}
      />

      {/* 对齐方式 */}
      <div className="space-y-2">
        <Label>对齐方式</Label>
        <Select
          value={props.alignment || 'center'}
          onValueChange={(value) =>
            handleChange('alignment', value)
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">左对齐</SelectItem>
            <SelectItem value="center">居中</SelectItem>
            <SelectItem value="right">右对齐</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 上下间距 */}
      <div className="space-y-2">
        <Label>上下间距</Label>
        <Select
          value={props.paddingY || 'medium'}
          onValueChange={(value) =>
            handleChange('paddingY', value)
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">小 (Small)</SelectItem>
            <SelectItem value="medium">中 (Medium)</SelectItem>
            <SelectItem value="large">大 (Large)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 背景色 */}
      <div className="space-y-2">
        <Label>背景颜色</Label>
        <div className="flex gap-2">
          <input
            type="color"
            value={props.backgroundColor || '#ffffff'}
            onChange={(e) => handleChange('backgroundColor', e.target.value)}
            className="w-10 h-10 rounded border cursor-pointer"
          />
          <input
            type="text"
            value={props.backgroundColor || ''}
            onChange={(e) => handleChange('backgroundColor', e.target.value)}
            placeholder="#ffffff"
            className="flex-1 px-3 py-2 border rounded-md text-sm"
          />
        </div>
      </div>
    </div>
  );
}
