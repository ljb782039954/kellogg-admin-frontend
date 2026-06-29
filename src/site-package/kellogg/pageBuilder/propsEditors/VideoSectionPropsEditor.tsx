import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import BilingualInput from '../../components/BilingualInput';
import ImageInput from '../../components/ImageInput';
import type { VideoSectionProps } from '@/components/blocks/VideoSection';

export interface VideoSectionPropsEditorProps {
  props: VideoSectionProps;
  onUpdate: (props: VideoSectionProps) => void;
}


export function VideoSectionPropsEditor({ props, onUpdate }: VideoSectionPropsEditorProps) {
  const handleChange = (key: string, value: unknown) => {
    onUpdate({ ...props, [key]: value });
  };

  const handleValueChange = (key: string, value: unknown) => {
    onUpdate({ 
      ...props, 
      values: { ...props.values, [key]: value } 
    });
  };

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="space-y-2">
        <Label>视频标题 (Title)</Label>
        <BilingualInput
          value={props.title || { zh: '', en: '' }}
          onChange={(value) => handleChange('title', value)}
          placeholder={{ zh: '请输入中文标题', en: 'Enter English title' }}
        />
      </div>

      {/* 副标题 */}
      <div className="space-y-2">
        <Label>副标题 (Subtitle)</Label>
        <BilingualInput
          value={props.subtitle || { zh: '', en: '' }}
          onChange={(value) => handleChange('subtitle', value)}
          placeholder={{ zh: '请输入中文副标题', en: 'Enter English subtitle' }}
        />
      </div>

      {/* 视频地址 */}
      <div className="space-y-2">
        <Label>视频地址 (Video URL)</Label>
        <div className="space-y-3">
          <Input
            value={props.videoUrl || props.values?.videoUrl || ''}
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
          value={props.values?.posterImage || ''}
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
            checked={props.values?.autoPlay || false}
            onCheckedChange={(checked) => handleValueChange('autoPlay', checked)}
          />
        </div>

        {/* 循环播放 */}
        <div className="flex items-center justify-between gap-4 p-3 bg-gray-50 rounded-xl">
          <div className="space-y-0.5">
            <Label className="text-xs">循环播放</Label>
          </div>
          <Switch
            checked={props.values?.loop || false}
            onCheckedChange={(checked) => handleValueChange('loop', checked)}
          />
        </div>
      </div>
    </div>
  );
}
