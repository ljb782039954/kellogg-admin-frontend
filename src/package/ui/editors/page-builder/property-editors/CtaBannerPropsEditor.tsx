import { Label } from '@/package/ui/primitives/label';
import { Input } from '@/package/ui/primitives/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/package/ui/primitives/select';
import BilingualInput from '@/package/ui/forms/BilingualInput';
import ImageInput from '@/package/ui/media/ImageInput';
import { LinkSelector } from '@/package/ui/forms/LinkSelector';
import { ensureNavLink } from '../linkUtils';
import type { CtaBannerProps } from '@/package/ui/blocks/blocks/CtaBanner';
import type { PropertyEditorProps } from '@/features/page-builder';

export function CtaBannerPropsEditor({
  value,
  onChange,
  resources,
}: PropertyEditorProps<CtaBannerProps>) {
  const { pages } = resources;
  const primaryButton = ensureNavLink(value.values?.primaryButton, { zh: '立即行动', en: 'Take Action' });
  const secondaryButton = ensureNavLink(value.values?.secondaryButton, { zh: '了解更多', en: 'Learn More' });

  return (
    <div className="space-y-6">
      {/* 文本内容 */}
      <div className="space-y-3 pb-4 border-b">
        <h4 className="font-medium text-sm text-gray-700">文本内容</h4>
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

      {/* 主按钮 */}
      <div className="space-y-3 pb-4 border-b">
        <h4 className="font-medium text-sm text-gray-700">主按钮 (Primary Action)</h4>
        <LinkSelector
          value={primaryButton}
          pages={pages}
          onChange={(val) => onChange({ ...value, values: { ...value.values, primaryButton: val } })}
        />
      </div>

      {/* 次按钮 */}
      <div className="space-y-3 pb-4 border-b">
        <h4 className="font-medium text-sm text-gray-700">次按钮 (Secondary Action)</h4>
        <LinkSelector
          value={secondaryButton}
          pages={pages}
          onChange={(val) => onChange({ ...value, values: { ...value.values, secondaryButton: val } })}
        />
        <p className="text-xs text-gray-400">若不需要次按钮，请将链接设为空并通过删除按钮移除。</p>
      </div>

      {/* 样式设置 */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm text-gray-700">样式设置</h4>
        <ImageInput
          label="背景图片（可选）"
          value={value.values?.backgroundImage || ''}
          onChange={(val) => onChange({ ...value, values: { ...value.values, backgroundImage: val } })}
          aspectRatio="banner"
        />
        <div className="space-y-2">
          <Label>背景颜色（无图片时使用渐变）</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={value.values?.backgroundColor || ''}
              onChange={(e) => onChange({ ...value, values: { ...value.values, backgroundColor: e.target.value } })}
              className="w-12 h-10 p-1"
            />
            <Input
              type="text"
              value={value.values?.backgroundColor || ''}
              onChange={(e) => onChange({ ...value, values: { ...value.values, backgroundColor: e.target.value } })}
              className="flex-1"
              placeholder="留空使用默认渐变"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>对齐方式</Label>
          <Select
            value={value.values?.alignment || 'center'}
            onValueChange={(val: 'left' | 'center' | 'right') => onChange({ ...value, values: { ...value.values, alignment: val } })}
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
