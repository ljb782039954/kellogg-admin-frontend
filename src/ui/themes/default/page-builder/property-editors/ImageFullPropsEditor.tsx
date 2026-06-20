// 单张大图属性编辑器
import { Label } from '@/ui/primitives/label';
import { Switch } from '@/ui/primitives/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/primitives/select';
import BilingualInput from '@/ui/forms/BilingualInput';
import ImageInput from '@/ui/media/ImageInput';
import type { ImageFullProps } from '@/components/blocks/ImageFull';

export interface ImageFullPropsEditorProps {
  props: ImageFullProps;
  onUpdate: (props: ImageFullProps) => void;
}


export function ImageFullPropsEditor({ props, onUpdate }: ImageFullPropsEditorProps) {
  const handleChange = (key: string, value: unknown) => {
    onUpdate({ ...props, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* 图片 */}
      <div className="space-y-2">
        <Label>单张大图片</Label>
        <ImageInput
          value={props.image || ''}
          onChange={(value) => handleChange('image', value)}
        />
      </div>
      {/* 输入图片alt参数 */}
      <div className="space-y-2">
        <Label>图片alt</Label>
        <BilingualInput
          value={props.alt || { zh: '', en: '' }}
          onChange={(value) => handleChange('alt', value)}
          placeholder={{ zh: '请输入中文alt', en: 'Enter English alt' }}
        />
      </div>

      {/* 描述文字 */}
      <div className="space-y-2">
        <Label>描述文字 (显示在遮罩上)</Label>
        <BilingualInput
          value={props.description || { zh: '', en: '' }}
          onChange={(value) => handleChange('description', value)}
          placeholder={{ zh: '请输入描述文字', en: 'Enter description text' }}
        />
      </div>

      {/* 宽度 */}
      <div className="space-y-2">
        <Label>组件宽度</Label>
        <Select
          value={props.width || 'full'}
          onValueChange={(value) =>
            handleChange('width', value)
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">小 (Small - 600px)</SelectItem>
            <SelectItem value="medium">中 (Medium - 800px)</SelectItem>
            <SelectItem value="large">大 (Large - 1000px)</SelectItem>
            <SelectItem value="full">全宽 (Full Width)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 高度 */}
      <div className="space-y-2">
        <Label>单张大图高度</Label>
        <Select
          value={props.height || 'medium'}
          onValueChange={(value) =>
            handleChange('height', value)
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">小 (Small - 200px)</SelectItem>
            <SelectItem value="medium">中 (Medium - 400px)</SelectItem>
            <SelectItem value="large">大 (Large - 600px)</SelectItem>
            <SelectItem value="full">全屏 (Full Screen)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 遮罩 */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>显示遮罩</Label>
          <p className="text-xs text-gray-500">
            在图片上添加半透明遮罩，使文字更易读
          </p>
        </div>
        <Switch
          checked={props.overlay || false}
          onCheckedChange={(checked) => handleChange('overlay', checked)}
        />
      </div>
    </div>
  );
}
