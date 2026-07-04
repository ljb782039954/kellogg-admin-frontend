// 图片横幅属性编辑器
import { Label } from '@/components/ui/label';
import BilingualInput from '../../components/BilingualInput';
import ImageInput from '../../components/ImageInput';
import type { ImageBannerTagContent } from '@site/ui-display/block-adapters';

export interface ImageBannerTagPropsEditorProps {
  props: ImageBannerTagContent;
  onUpdate: (props: ImageBannerTagContent) => void;
}

export function ImageBannerTagPropsEditor({ props, onUpdate }: ImageBannerTagPropsEditorProps) {
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

      {/* tag */}
      <div className="space-y-2">
        <Label>标签</Label>
        <BilingualInput
          value={props.tag || { zh: '', en: '' }}
          onChange={(value) => handleChange('tag', value)}
          placeholder={{ zh: '请输入中文标签', en: 'Enter English tag' }}
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

    </div>
  );
}
