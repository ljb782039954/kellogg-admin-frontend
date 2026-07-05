// 图文组件属性编辑器

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import BilingualInput from '@/core-adminApp/ui/Input/BilingualInput';
import BilingualRichInput from '@/core-adminApp/ui/Input/RichInput/BilingualRichInput';
import ImageInput from '@/core-adminApp/ui/Input/ImageInput';
import type { ImageTextContent } from '@site/ui-display/block-adapters';

export interface ImageTextPropsEditorProps {
  props: ImageTextContent;
  onUpdate: (props: ImageTextContent) => void;
}

export function ImageTextPropsEditor({ props, onUpdate }: ImageTextPropsEditorProps) {
  return (
    <div className="space-y-6">
      {/* 图片设置 */}
      <div className="space-y-3 pb-4 border-b">
        <h4 className="font-medium text-sm text-gray-700">图片设置</h4>
        <ImageInput
          label="图片"
          value={props.image || ''}
          onChange={(val) => onUpdate({ ...props, image: val })}
          aspectRatio="video"
        />
        <div className="space-y-2">
          <Label>图片位置</Label>
          <Select
            value={props.imagePosition || 'left'}
            onValueChange={(val: "left" | "right") => onUpdate({ ...props, imagePosition: val })}
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
          value={props.title || { zh: '', en: '' }}
          onChange={(val) => onUpdate({ ...props, title: val })}
        />
        <p className="text-sm font-bold text-gray-400 uppercase">参数内容 (值)</p>

        <BilingualRichInput
          label="内容"
          value={props.content || { zh: '', en: '' }}
          onChange={(val) => onUpdate({ ...props, content: val })}
        />
      </div>

      {/* 按钮设置 */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm text-gray-700">按钮设置（可选）</h4>
        <BilingualInput
          label="按钮文字"
          value={props.buttonText || { zh: '', en: '' }}
          onChange={(val) => onUpdate({ ...props, buttonText: val })}
        />
        <div className="space-y-2">
          <Label>按钮链接</Label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg text-sm"
            placeholder="输入链接地址，如 /products"
            value={props.buttonLink || ''}
            onChange={(e) => onUpdate({ ...props, buttonLink: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
