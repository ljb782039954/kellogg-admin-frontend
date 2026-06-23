import type { PropertyEditorProps } from '@/features/page-builder';
// 文本区块属性编辑器
import { Label } from '@/ui/primitives/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/primitives/select';
import BilingualInput from '@/ui/forms/BilingualInput';
import BilingualRichInput from '@/ui/forms/rich-text/BilingualRichInput';
import type { TextSectionProps } from '@/package/ui/blocks/blocks/TextSection';



export function TextSectionPropsEditor({ value, onChange }: PropertyEditorProps<TextSectionProps>) {
  const handleChange = (key: string, val: unknown) => {
    onChange({ ...value, [key]: val });
  };

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="space-y-2">
        <Label>标题</Label>
        <BilingualInput
          value={value.title || { zh: '', en: '' }}
          onChange={(value) => handleChange('title', value)}
          placeholder={{ zh: '请输入中文标题', en: 'Enter English title' }}
        />
      </div>

      {/* 内容 */}
      <BilingualRichInput
        label="内容"
        value={value.content || { zh: '', en: '' }}
        onChange={(val) => handleChange('content', val)}
        placeholder={{ zh: '请输入中文内容', en: 'Enter English content' }}
      />

      {/* 对齐方式 */}
      <div className="space-y-2">
        <Label>对齐方式</Label>
        <Select
          value={value.alignment || 'center'}
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
          value={value.paddingY || 'medium'}
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
            value={value.backgroundColor || '#ffffff'}
            onChange={(e) => handleChange('backgroundColor', e.target.value)}
            className="w-10 h-10 rounded border cursor-pointer"
          />
          <input
            type="text"
            value={value.backgroundColor || ''}
            onChange={(e) => handleChange('backgroundColor', e.target.value)}
            placeholder="#ffffff"
            className="flex-1 px-3 py-2 border rounded-md text-sm"
          />
        </div>
      </div>
    </div>
  );
}
