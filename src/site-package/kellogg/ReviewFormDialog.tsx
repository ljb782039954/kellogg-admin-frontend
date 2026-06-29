import { useState, useEffect } from 'react';
import { X, Youtube, Image as ImageIcon, Star, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '@/core/lib/api';
import { toast } from 'sonner';
import type { CustomerReview, ReviewInput } from '@/core/types';
import ImageInput from './components/ImageInput';

// ---- YouTube ID extractor ----
function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  // Handle youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pat of patterns) {
    const m = url.match(pat);
    if (m) return m[1];
  }
  return null;
}

const LABEL = 'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5';
const INPUT = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all placeholder-gray-300';
const TEXTAREA = `${INPUT} resize-none leading-relaxed`;

// ---- Formatting Hint Bar ----
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

// ---- Star Rating Selector ----
function StarRatingInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onChange(star)}
          className="p-0.5 focus:outline-none transition-transform hover:scale-110"
          title={`${star} 星`}
        >
          <Star
            className={`w-6 h-6 transition-colors ${
              star <= (hovered ?? value)
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        </button>
      ))}
      <span className="ml-2 text-sm font-semibold text-gray-700">{value}.0</span>
    </div>
  );
}

interface Props {
  review?: CustomerReview | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function ReviewFormDialog({ review, onClose, onSaved }: Props) {
  const isEdit = !!review;

  const [form, setForm] = useState<ReviewInput>({
    client_name: review?.client_name ?? '',
    country: review?.country ?? '',
    rating: review?.rating ?? 5,
    media_type: review?.media_type ?? 'video',
    media_url: review?.media_url ?? '',
    review_text_zh: review?.review_text_zh ?? '',
    review_text_en: review?.review_text_en ?? '',
    sort_order: review?.sort_order ?? 0,
    status: review?.status ?? 'published',
  });

  const [isSaving, setIsSaving] = useState(false);

  // Live YouTube preview
  const youtubeId = form.media_type === 'video' ? extractYoutubeId(form.media_url) : null;
  const youtubeThumbnail = youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
    : null;

  const setField = <K extends keyof ReviewInput>(key: K, value: ReviewInput[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!form.client_name.trim()) {
      toast.error('请填写客户名称');
      return;
    }
    if (!form.media_url.trim()) {
      toast.error('请填写媒体链接或上传图片');
      return;
    }
    if (form.media_type === 'video' && !youtubeId) {
      toast.error('YouTube 链接无效，请检查格式');
      return;
    }
    if (!form.review_text_zh.trim() || !form.review_text_en.trim()) {
      toast.error('请填写中英文评价内容');
      return;
    }

    setIsSaving(true);
    try {
      if (isEdit && review) {
        await api.updateReview(review.id, form);
        toast.success('评价已更新');
      } else {
        await api.createReview(form);
        toast.success('评价已创建');
      }
      onSaved();
      onClose();
    } catch (err: any) {
      toast.error(err?.message || '保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-800">
            {isEdit ? '编辑客户评价' : '新增客户评价'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          {/* Row 1: client_name + country */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>客户名称 *</label>
              <input
                type="text"
                value={form.client_name}
                onChange={e => setField('client_name', e.target.value)}
                placeholder="如：Alex Goncalves"
                className={INPUT}
                autoFocus
              />
            </div>
            <div>
              <label className={LABEL}>国家 / 身份</label>
              <input
                type="text"
                value={form.country ?? ''}
                onChange={e => setField('country', e.target.value)}
                placeholder="如：American"
                className={INPUT}
              />
            </div>
          </div>

          {/* Row 2: rating + sort_order + status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>评分星级</label>
              <StarRatingInput value={form.rating ?? 5} onChange={v => setField('rating', v)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>排序权重</label>
                <input
                  type="number"
                  value={form.sort_order ?? 0}
                  onChange={e => setField('sort_order', parseInt(e.target.value) || 0)}
                  className={INPUT}
                  min={0}
                />
                <p className="text-[10px] text-gray-400 mt-1">数字越大越靠前</p>
              </div>
              <div>
                <label className={LABEL}>状态</label>
                <select
                  value={form.status ?? 'published'}
                  onChange={e => setField('status', e.target.value as 'published' | 'draft')}
                  className={INPUT}
                >
                  <option value="published">已发布</option>
                  <option value="draft">草稿</option>
                </select>
              </div>
            </div>
          </div>

          {/* Media Type */}
          <div>
            <label className={LABEL}>媒体类型</label>
            <div className="flex gap-3">
              {([['video', 'YouTube 视频', Youtube], ['image', '单张图片', ImageIcon]] as const).map(
                ([type, label, Icon]) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setField('media_type', type)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                      form.media_type === type
                        ? type === 'video'
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Media Input */}
          {form.media_type === 'video' ? (
            <div className="space-y-2">
              <label className={LABEL}>YouTube 视频链接 *</label>
              <input
                type="url"
                value={form.media_url}
                onChange={e => setField('media_url', e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... 或 https://youtu.be/..."
                className={INPUT}
              />
              {/* Validation feedback */}
              {form.media_url && (
                youtubeId ? (
                  <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    视频 ID 已识别：<code className="bg-green-50 px-1.5 py-0.5 rounded">{youtubeId}</code>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-red-500">
                    <AlertCircle className="w-3.5 h-3.5" />
                    链接无法识别，请确认为有效 YouTube 链接
                  </div>
                )
              )}
              {/* YouTube Thumbnail Preview */}
              {youtubeThumbnail && (
                <div className="relative rounded-xl overflow-hidden border border-gray-200">
                  <img
                    src={youtubeThumbnail}
                    alt="YouTube preview"
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-red-600/90 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className={LABEL}>封面图片 *</label>
              <ImageInput
                value={form.media_url}
                onChange={url => setField('media_url', url)}
                maxWidth={1000}
                aspectRatio="video"
              />
            </div>
          )}

          {/* Review Text ZH */}
          <div className="space-y-1.5">
            <label className={LABEL}>中文评价内容 *</label>
            <FormattingHint />
            <textarea
              value={form.review_text_zh}
              onChange={e => setField('review_text_zh', e.target.value)}
              rows={4}
              placeholder={`输入中文评价内容...\n可使用 <strong>加粗词语</strong> 或 <em>斜体</em> 来强调重点`}
              className={TEXTAREA}
            />
            <p className="text-xs text-gray-400">{form.review_text_zh.length} 字</p>
          </div>

          {/* Review Text EN */}
          <div className="space-y-1.5">
            <label className={LABEL}>English Review Content *</label>
            <FormattingHint />
            <textarea
              value={form.review_text_en}
              onChange={e => setField('review_text_en', e.target.value)}
              rows={4}
              placeholder={`Enter English review...\nUse <strong>bold words</strong> or <em>italics</em> to emphasize key phrases`}
              className={TEXTAREA}
            />
            <p className="text-xs text-gray-400">{form.review_text_en.length} chars</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0 bg-gray-50/50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700 transition-all disabled:opacity-50"
          >
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSaving ? '保存中...' : isEdit ? '保存修改' : '创建评价'}
          </button>
        </div>
      </div>
    </div>
  );
}
