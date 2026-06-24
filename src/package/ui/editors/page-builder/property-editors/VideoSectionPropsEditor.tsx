import type { PropertyEditorProps } from '@/features/page-builder';
import { Label } from '@/package/ui/primitives/label';
import { Input } from '@/package/ui/primitives/input';
import { Switch } from '@/package/ui/primitives/switch';
import BilingualInput from '@/package/ui/forms/BilingualInput';
import ImageInput from '@/package/ui/media/ImageInput';
import type { VideoSectionProps } from '@/package/ui/blocks/blocks/VideoSection';




export function VideoSectionPropsEditor({ value, onChange }: PropertyEditorProps<VideoSectionProps>) {
  const handleChange = (key: string, val: unknown) => {
    onChange({ ...value, [key]: val });
  };

  const handleValueChange = (key: string, val: unknown) => {
    onChange({ 
      ...value, 
      values: { ...value.values, [key]: val } 
    });
  };

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="space-y-2">
        <Label>视频标题 (Title)</Label>
        <BilingualInput
          value={value.title || { zh: '', en: '' }}
          onChange={(value) => handleChange('title', value)}
          placeholder={{ zh: '请输入中文标题', en: 'Enter English title' }}
        />
      </div>

      {/* 副标题 */}
      <div className="space-y-2">
        <Label>副标题 (Subtitle)</Label>
        <BilingualInput
          value={value.subtitle || { zh: '', en: '' }}
          onChange={(value) => handleChange('subtitle', value)}
          placeholder={{ zh: '请输入中文副标题', en: 'Enter English subtitle' }}
        />
      </div>

      {/* 视频地址 */}
      <div className="space-y-2">
        <Label>视频地址 (Video URL)</Label>
        <div className="space-y-3">
          <Input
            value={value.videoUrl || value.values?.videoUrl || ''}
            onChange={(e) => handleChange('videoUrl', e.target.value)}
            placeholder="YouTube link, TikTok link, or MP4 URL"
          />
          <div className="text-xs text-gray-500">
            支持 YouTube、TikTok 链接或直接的视频文件地址 (.mp4, .webm)
          </div>
        </div>
      </div>

      {/* 封面图 */}
      <div className="space-y-2">
        <Label>封面图 (Poster Image)</Label>
        <ImageInput
          value={value.values?.posterImage || ''}
          onChange={(value) => handleValueChange('posterImage', value)}
        />
        <p className="text-xs text-gray-500">
          视频加载前显示的封面图片 (Optional)
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
        {/* 自动播放 */}
        <div className="flex items-center justify-between gap-4 p-3 bg-gray-50 rounded-xl">
          <div className="space-y-0.5">
            <Label className="text-xs">自动播放</Label>
          </div>
          <Switch
            checked={value.values?.autoPlay || false}
            onCheckedChange={(checked) => handleValueChange('autoPlay', checked)}
          />
        </div>

        {/* 循环播放 */}
        <div className="flex items-center justify-between gap-4 p-3 bg-gray-50 rounded-xl">
          <div className="space-y-0.5">
            <Label className="text-xs">循环播放</Label>
          </div>
          <Switch
            checked={value.values?.loop || false}
            onCheckedChange={(checked) => handleValueChange('loop', checked)}
          />
        </div>
      </div>
    </div>
  );
}
