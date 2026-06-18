import { useState } from 'react';
import { X, Youtube, Image as ImageIcon, Star, AlertCircle, Loader2 } from 'lucide-react';
import { Controller, type UseFormReturn } from 'react-hook-form';
import ImageInput from '@/admin/components/ImageInput';
import { parseYouTubeUrl } from '../model/reviewMedia';
import type { ReviewFormValues } from '../model/review.types';

const LABEL = 'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5';
const INPUT = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all placeholder-gray-300';
const TEXTAREA = `${INPUT} resize-none leading-relaxed`;

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
          <Star
            className={`w-6 h-6 transition-colors ${
              star <= (hovered ?? value) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
            }`}
          />
        </button>
      ))}
      <span className="ml-2 text-sm font-semibold text-gray-700">{value}.0</span>
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
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-800">
            {isEdit ? '编辑客户评价' : '新增客户评价'}
          </h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {mutationError && (
          <div className="mx-6 mt-4 bg-red-50 text-red-600 px-4 py-2 rounded-xl border border-red-100 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {mutationError.message || '保存失败'}
          </div>
        )}

        <form onSubmit={onSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={LABEL}>客户名称 *</label>
              <input
                {...register('clientName')}
                placeholder="如：Alex Goncalves"
                className={`${INPUT} ${formState.errors.clientName ? 'border-red-400' : ''}`}
                autoFocus
              />
              {formState.errors.clientName && (
                <p className="text-xs text-red-500">{formState.errors.clientName.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className={LABEL}>国家 / 身份</label>
              <input {...register('country')} placeholder="如：American" className={INPUT} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={LABEL}>评分星级</label>
              <Controller
                control={control}
                name="rating"
                render={({ field }) => <StarRatingInput value={field.value} onChange={field.onChange} />}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className={LABEL}>排序权重</label>
                <input type="number" {...register('sortOrder', { valueAsNumber: true })} className={INPUT} min={0} />
                <p className="text-[10px] text-gray-400 mt-1">数字越大越靠前</p>
              </div>
              <div className="space-y-1.5">
                <label className={LABEL}>状态</label>
                <select {...register('status')} className={INPUT}>
                  <option value="published">已发布</option>
                  <option value="draft">草稿</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={LABEL}>媒体类型</label>
            <div className="flex gap-3">
              {([['video', 'YouTube 视频', Youtube], ['image', '单张图片', ImageIcon]] as const).map(
                ([type, label, Icon]) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setValue('media', { type, url: '' })}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                      mediaType === type
                        ? type === 'video'
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ),
              )}
            </div>
          </div>

          {mediaType === 'video' ? (
            <div className="space-y-2">
              <label className={LABEL}>YouTube 视频链接 *</label>
              <input
                type="url"
                {...register('media.url')}
                placeholder="https://www.youtube.com/watch?v=... 或 https://youtu.be/..."
                className={`${INPUT} ${formState.errors.media?.url ? 'border-red-400' : ''}`}
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
                <div className="relative rounded-xl overflow-hidden border border-gray-200">
                  <img src={youtubeInfo.thumbnailUrl} alt="YouTube preview" className="w-full aspect-video object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-red-600/90 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-2.5 h-2.5 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className={LABEL}>封面图片 *</label>
              <ImageInput value={mediaUrl} onChange={(url) => setValue('media.url', url)} maxWidth={1000} aspectRatio="video" />
              {formState.errors.media?.url && (
                <p className="text-xs text-red-500 mt-1">{formState.errors.media.url.message}</p>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <label className={LABEL}>中文评价内容 *</label>
            <FormattingHint />
            <textarea
              {...register('content.zh')}
              rows={4}
              placeholder={`输入中文评价内容...\n可使用 <strong>加粗词语</strong> 或 <em>斜体</em> 来强调重点`}
              className={`${TEXTAREA} ${formState.errors.content?.zh ? 'border-red-400' : ''}`}
            />
            {formState.errors.content?.zh && <p className="text-xs text-red-500">{formState.errors.content.zh.message}</p>}
            <p className="text-xs text-gray-400">{watch('content.zh').length} 字</p>
          </div>

          <div className="space-y-1.5">
            <label className={LABEL}>English Review Content *</label>
            <FormattingHint />
            <textarea
              {...register('content.en')}
              rows={4}
              placeholder={`Enter English review...\nUse <strong>bold words</strong> or <em>italics</em> to emphasize key phrases`}
              className={`${TEXTAREA} ${formState.errors.content?.en ? 'border-red-400' : ''}`}
            />
            {formState.errors.content?.en && <p className="text-xs text-red-500">{formState.errors.content.en.message}</p>}
            <p className="text-xs text-gray-400">{watch('content.en').length} chars</p>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all">
              取消
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700 transition-all disabled:opacity-50"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSaving ? '保存中...' : isEdit ? '保存修改' : '创建评价'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
