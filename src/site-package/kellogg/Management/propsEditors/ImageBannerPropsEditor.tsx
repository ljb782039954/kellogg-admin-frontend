// 图片横幅属性编辑器
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import BilingualInput from '../../components/BilingualInput';
import ImageInput from '../../components/ImageInput';
import type { ImageBannerContent } from '@site/ui-display/block-adapters';

export interface ImageBannerPropsEditorProps {
  props: ImageBannerContent;
  onUpdate: (props: ImageBannerContent) => void;
}


export function ImageBannerPropsEditor({ props, onUpdate }: ImageBannerPropsEditorProps) {
  const handleChange = (key: string, value: unknown) => {
    onUpdate({ ...props, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* 图片 */}
      <div className="space-y-2">
        <Label>横幅图片</Label>
        <ImageInput
          value={props.image || ''}
          onChange={(value) => handleChange('image', value)}
        />
      </div>

      {/* 标题（可选） */}
      <div className="space-y-2">
        <Label>标题（可选）</Label>
        <BilingualInput
          value={props.title || { zh: '', en: '' }}
          onChange={(value) => handleChange('title', value)}
          placeholder={{ zh: '请输入中文标题', en: 'Enter English title' }}
        />
      </div>

      {/* 副标题（可选） */}
      <div className="space-y-2">
        <Label>副标题（可选）</Label>
        <BilingualInput
          value={props.subtitle || { zh: '', en: '' }}
          onChange={(value) => handleChange('subtitle', value)}
          placeholder={{ zh: '请输入中文副标题', en: 'Enter English subtitle' }}
        />
      </div>

      {/* 链接 */}
      <div className="space-y-2">
        <Label>按钮文字</Label>
        <BilingualInput
          value={props.buttonText || { zh: '', en: '' }}
          onChange={(value) => handleChange('ctaText', value)}
          placeholder={{ zh: '请输入中文按钮文字', en: 'Enter English button text' }}
        />
        <Label>点击链接 (URL)</Label>
        <Input
          value={props.linkUrl || ''}
          onChange={(e) => handleChange('linkUrl', e.target.value)}
          placeholder="https://example.com/page"
        />
      </div>

      {/* 高度 */}
      <div className="space-y-2">
        <Label>横幅高度</Label>
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
