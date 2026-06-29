import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import BilingualInput from '../../components/BilingualInput';
import ImageInput from '../../components/ImageInput';
import LinkSelector from '../../components/LinkSelector';
import { ensureNavLink } from '@/core/lib/linkUtils';
import type { CtaBannerProps } from '@/components/blocks/CtaBanner';

export interface CtaBannerPropsEditorProps {
  props: CtaBannerProps;
  onUpdate: (props: CtaBannerProps) => void;
}


export function CtaBannerPropsEditor({ props, onUpdate }: CtaBannerPropsEditorProps) {
  const primaryButton = ensureNavLink(props.values?.primaryButton, { zh: '立即行动', en: 'Take Action' });
  const secondaryButton = ensureNavLink(props.values?.secondaryButton, { zh: '了解更多', en: 'Learn More' });

  return (
    <div className="space-y-6">
      {/* 文本内容 */}
      <div className="space-y-3 pb-4 border-b">
        <h4 className="font-medium text-sm text-gray-700">文本内容</h4>
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

      {/* 主按钮 */}
      <div className="space-y-3 pb-4 border-b">
        <h4 className="font-medium text-sm text-gray-700">主按钮 (Primary Action)</h4>
        <LinkSelector
          value={primaryButton}
          onChange={(val) => onUpdate({ ...props, values: { ...props.values, primaryButton: val } })}
        />
      </div>

      {/* 次按钮 */}
      <div className="space-y-3 pb-4 border-b">
        <h4 className="font-medium text-sm text-gray-700">次按钮 (Secondary Action)</h4>
        <LinkSelector
          value={secondaryButton}
          onChange={(val) => onUpdate({ ...props, values: { ...props.values, secondaryButton: val } })}
        />
        <p className="text-xs text-gray-400">若不需要次按钮，请将链接设为空并通过删除按钮移除。</p>
      </div>

      {/* 样式设置 */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm text-gray-700">样式设置</h4>
        <ImageInput
          label="背景图片（可选）"
          value={props.values?.backgroundImage || ''}
          onChange={(val) => onUpdate({ ...props, values: { ...props.values, backgroundImage: val } })}
          aspectRatio="banner"
        />
        <div className="space-y-2">
          <Label>背景颜色（无图片时使用渐变）</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={props.values?.backgroundColor || ''}
              onChange={(e) => onUpdate({ ...props, values: { ...props.values, backgroundColor: e.target.value } })}
              className="w-12 h-10 p-1"
            />
            <Input
              type="text"
              value={props.values?.backgroundColor || ''}
              onChange={(e) => onUpdate({ ...props, values: { ...props.values, backgroundColor: e.target.value } })}
              className="flex-1"
              placeholder="留空使用默认渐变"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>对齐方式</Label>
          <Select
            value={props.values?.alignment || 'center'}
            onValueChange={(val: 'left' | 'center' | 'right') => onUpdate({ ...props, values: { ...props.values, alignment: val } })}
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
      </div>
    </div>
  );
}
