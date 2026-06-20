import type { PropertyEditorProps } from '@/features/page-builder';
// 图片横幅属性编辑器
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
import ImageInput from '@/ui/media/ImageInput';
import type { ImageBannerProps } from '@/components/blocks/ImageBanner';




export function ImageBannerPropsEditor({ value, onChange }: PropertyEditorProps<ImageBannerProps>) {
  const handleChange = (key: string, val: unknown) => {
    onChange({ ...value, [key]: val });
  };

  return (
    <div className="space-y-6">
      {/* 图片 */}
      <div className="space-y-2">
        <Label>横幅图片</Label>
        <ImageInput
          value={value.image || ''}
          onChange={(value) => handleChange('image', value)}
        />
      </div>

      {/* 标题（可选） */}
      <div className="space-y-2">
        <Label>标题（可选）</Label>
        <BilingualInput
          value={value.title || { zh: '', en: '' }}
          onChange={(value) => handleChange('title', value)}
          placeholder={{ zh: '请输入中文标题', en: 'Enter English title' }}
        />
      </div>

      {/* 副标题（可选） */}
      <div className="space-y-2">
        <Label>副标题（可选）</Label>
        <BilingualInput
          value={value.subtitle || { zh: '', en: '' }}
          onChange={(value) => handleChange('subtitle', value)}
          placeholder={{ zh: '请输入中文副标题', en: 'Enter English subtitle' }}
        />
      </div>

      {/* 链接 */}
      <div className="space-y-2">
        <Label>按钮文字</Label>
        <BilingualInput
          value={value.buttonText || { zh: '', en: '' }}
          onChange={(value) => handleChange('ctaText', value)}
          placeholder={{ zh: '请输入中文按钮文字', en: 'Enter English button text' }}
        />
        <Label>点击链接 (URL)</Label>
        <Input
          value={value.linkUrl || ''}
          onChange={(e) => handleChange('linkUrl', e.target.value)}
          placeholder="https://example.com/page"
        />
      </div>

      {/* 高度 */}
      <div className="space-y-2">
        <Label>横幅高度</Label>
        <Select
          value={value.height || 'medium'}
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
          checked={value.overlay || false}
          onCheckedChange={(checked) => handleChange('overlay', checked)}
        />
      </div>
    </div>
  );
}
