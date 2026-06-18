import { useState } from 'react';
import { X, Youtube, Image as ImageIcon, AlertCircle, Loader2 } from 'lucide-react';
import { Controller, type UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import ImageInput from '@/admin/components/ImageInput';
import { parseYouTubeUrl } from '../model/reviewMedia';
import type { ReviewFormValues } from '../model/review.types';

function StarRatingInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onChange(star)}
          className="p-0.5 focus:outline-none transition-transform hover:scale-110"
        >
          <svg className={`w-6 h-6 transition-colors ${star <= (hovered ?? value) ? 'text-yellow-400' : 'text-gray-200'}`} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
      <span className="ml-2 text-sm font-semibold text-gray-700">{value}.0</span>
    </div>
  );
}

function FormattingHint() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 px-3 py-2 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-700">
      <span className="font-semibold text-amber-800">格式提示：</span>
      <span>加粗：<code className="bg-amber-100 px-1 rounded">&lt;strong&gt;文字&lt;/strong&gt;</code></span>
      <span>斜体：<code className="bg-amber-100 px-1 rounded">&lt;em&gt;文字&lt;/em&gt;</code></span>
      <span>换行：<code className="bg-amber-100 px-1 rounded">&lt;br&gt;</code></span>
      <span className="text-amber-600">前台将直接渲染 HTML 标签</span>
    </div>
  );
}

interface ReviewFormViewProps {
  form: UseFormReturn<ReviewFormValues>;
  isEdit: boolean;
  isSaving: boolean;
  mutationError: Error | null;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onClose: () => void;
}

export function ReviewFormView({ form, isEdit, isSaving, mutationError, onSubmit, onClose }: ReviewFormViewProps) {
  const { control, register, watch, setValue, formState } = form;
  const mediaType = watch('media.type');
  const mediaUrl = watch('media.url');
  const youtubeInfo = mediaType === 'video' ? parseYouTubeUrl(mediaUrl) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          <h2 className="text-lg font-bold text-gray-800">
            {isEdit ? '编辑客户评价' : '新增客户评价'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {mutationError && (
          <div className="mx-6 mt-4 bg-red-50 text-red-600 px-4 py-2 rounded-xl border border-red-100 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {mutationError.message || '保存失败'}
          </div>
        )}

        <form onSubmit={onSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>客户名称 *</Label>
              <Input {...register('clientName')} placeholder="如：Alex Goncalves" />
              {formState.errors.clientName && (
                <p className="text-xs text-red-500">{formState.errors.clientName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>国家 / 身份</Label>
              <Input {...register('country')} placeholder="如：American" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>评分星级</Label>
              <Controller
                control={control}
                name="rating"
                render={({ field }) => <StarRatingInput value={field.value} onChange={field.onChange} />}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>排序权重</Label>
                <Input type="number" {...register('sortOrder', { valueAsNumber: true })} min={0} />
                <p className="text-[10px] text-gray-400">数字越大越靠前</p>
              </div>
              <div className="space-y-2">
                <Label>状态</Label>
                <select {...register('status')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                  <option value="published">已发布</option>
                  <option value="draft">草稿</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>媒体类型</Label>
            <div className="flex gap-3">
              {([['video', 'YouTube 视频', Youtube], ['image', '单张图片', ImageIcon]] as const).map(
                ([type, label, Icon]) => (
                  <Button
                    key={type}
                    type="button"
                    variant={mediaType === type ? 'default' : 'outline'}
                    className={`flex-1 ${mediaType === type && type === 'video' ? '!bg-red-500 !border-red-500 hover:!bg-red-600' : ''}`}
                    onClick={() => setValue('media', { type, url: '' })}
                  >
                    <Icon className="w-4 h-4 mr-1" />
                    {label}
                  </Button>
                ),
              )}
            </div>
          </div>

          {mediaType === 'video' ? (
            <div className="space-y-2">
              <Label>YouTube 视频链接 *</Label>
              <Input
                type="url"
                {...register('media.url')}
                placeholder="https://www.youtube.com/watch?v=... 或 https://youtu.be/..."
              />
              {formState.errors.media?.url && (
                <p className="text-xs text-red-500">{formState.errors.media.url.message}</p>
              )}
              {mediaUrl && youtubeInfo ? (
                <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  视频 ID 已识别：<code className="bg-green-50 px-1.5 py-0.5 rounded">{youtubeInfo.id}</code>
                </div>
              ) : mediaUrl ? (
                <div className="flex items-center gap-1.5 text-xs text-red-500">
                  <AlertCircle className="w-3.5 h-3.5" />
                  链接无法识别，请确认为有效 YouTube 链接
                </div>
              ) : null}
              {youtubeInfo && (
                <div className="relative rounded-xl overflow-hidden border">
                  <img src={youtubeInfo.thumbnailUrl} alt="YouTube preview" className="w-full aspect-video object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-red-600/90 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Label>封面图片 *</Label>
              <ImageInput value={mediaUrl} onChange={(url) => setValue('media.url', url)} maxWidth={1000} aspectRatio="video" />
              {formState.errors.media?.url && (
                <p className="text-xs text-red-500 mt-1">{formState.errors.media.url.message}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label>中文评价内容 *</Label>
            <FormattingHint />
            <Textarea
              {...register('content.zh')}
              rows={4}
              placeholder={`输入中文评价内容...\n可使用 <strong>加粗词语</strong> 或 <em>斜体</em> 来强调重点`}
            />
            {formState.errors.content?.zh && <p className="text-xs text-red-500">{formState.errors.content.zh.message}</p>}
            <p className="text-xs text-gray-400">{watch('content.zh').length} 字</p>
          </div>

          <div className="space-y-2">
            <Label>English Review Content *</Label>
            <FormattingHint />
            <Textarea
              {...register('content.en')}
              rows={4}
              placeholder={`Enter English review...\nUse <strong>bold words</strong> or <em>italics</em> to emphasize key phrases`}
            />
            {formState.errors.content?.en && <p className="text-xs text-red-500">{formState.errors.content.en.message}</p>}
            <p className="text-xs text-gray-400">{watch('content.en').length} chars</p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>取消</Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="w-4 h-4 animate-spin mr-1" />}
              {isSaving ? '保存中...' : isEdit ? '保存修改' : '创建评价'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
