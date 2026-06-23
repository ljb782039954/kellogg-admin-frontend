import type { PropertyEditorProps } from '@/features/page-builder';
// 图文组件属性编辑器

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
import ImageInput from '@/ui/media/ImageInput';
import type { ImageTextProps } from '@/package/ui/blocks/blocks/ImageText';



export function ImageTextPropsEditor({ value, onChange }: PropertyEditorProps<ImageTextProps>) {
  return (
    <div className="space-y-6">
      {/* 图片设置 */}
      <div className="space-y-3 pb-4 border-b">
        <h4 className="font-medium text-sm text-gray-700">图片设置</h4>
        <ImageInput
          label="图片"
          value={value.image || ''}
          onChange={(val) => onChange({ ...value, image: val })}
          aspectRatio="video"
        />
        <div className="space-y-2">
          <Label>图片位置</Label>
          <Select
            value={value.imagePosition || 'left'}
            onValueChange={(val: "left" | "right") => onChange({ ...value, imagePosition: val })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">左侧</SelectItem>
              <SelectItem value="right">右侧</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 文本内容 */}
      <div className="space-y-3 pb-4 border-b">
        <h4 className="font-medium text-sm text-gray-700">文本内容</h4>
        <BilingualInput
          label="标题"
          value={value.title || { zh: '', en: '' }}
          onChange={(val) => onChange({ ...value, title: val })}
        />
        <p className="text-sm font-bold text-gray-400 uppercase">参数内容 (值)</p>

        <BilingualRichInput
          label="内容"
          value={value.content || { zh: '', en: '' }}
          onChange={(val) => onChange({ ...value, content: val })}
        />
      </div>

      {/* 按钮设置 */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm text-gray-700">按钮设置（可选）</h4>
        <BilingualInput
          label="按钮文字"
          value={value.buttonText || { zh: '', en: '' }}
          onChange={(val) => onChange({ ...value, buttonText: val })}
        />
        <div className="space-y-2">
          <Label>按钮链接</Label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg text-sm"
            placeholder="输入链接地址，如 /products"
            value={value.buttonLink || ''}
            onChange={(e) => onChange({ ...value, buttonLink: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
