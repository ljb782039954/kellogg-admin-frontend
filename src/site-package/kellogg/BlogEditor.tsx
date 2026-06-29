import { useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Send,
  Tag,
  Loader2,
  Globe,
  Hash,
  User,
  Calendar,
  ChevronDown,
  ChevronUp,
  Info,
  Link,
} from 'lucide-react';
import { toast } from 'sonner';
import { useBlogEditor } from '@/core/items/blog';
import ImageInput from './components/ImageInput';
import { MarkdownEditor, TagInput } from './components/blog';

const FIELD_LABEL = 'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5';
const INPUT_CLASS = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all placeholder-gray-300';
const SECTION_CLASS = 'bg-white rounded-xl border border-gray-200 p-4 space-y-3';

// ---- Main Component ----
export default function BlogEditor() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const goToBlogList = useCallback(() => navigate('/blog'), [navigate]);
  const notify = useMemo(() => ({
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
  }), []);
  const handleSaved = useCallback(({ operation }: { operation: 'create' | 'update' }) => {
    if (operation === 'create') {
      goToBlogList();
    }
  }, [goToBlogList]);

  const {
    activeTab,
    categories,
    form,
    isEdit,
    isFetching,
    isSaving,
    seoExpanded,
    goBack,
    handleImageUpload,
    handlePublish,
    handleSaveDraft,
    handleTitleEnChange,
    regenerateSlugFromEnglishTitle,
    setActiveTab,
    setField,
    setSeoExpanded,
  } = useBlogEditor({
    blogId: id,
    // fallbackCategories: KELLOGG_BLOG_FALLBACK_CATEGORIES,
    // messages: BLOG_EDITOR_MESSAGES,
    notify,
    onBack: goToBlogList,
    onLoadError: goToBlogList,
    onSaved: handleSaved,
  });

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-sm">加载文章中...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-none">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回文章列表
        </button>
        <div className="flex gap-2">
          <button
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all text-sm font-medium disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            保存草稿
          </button>
          <button
            onClick={handlePublish}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition-all text-sm font-medium disabled:opacity-50 shadow-sm"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {isSaving ? '保存中...' : form.status === 'published' ? '更新发布' : '立即发布'}
          </button>
        </div>
      </div>

      <div className="flex gap-5 items-start">
        {/* ---- Left: Main Editor ---- */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Titles */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <div>
              <label className={FIELD_LABEL}>中文标题 *</label>
              <input
                type="text"
                value={form.title_zh}
                onChange={e => setField('title_zh', e.target.value)}
                placeholder="输入文章中文标题..."
                className="w-full text-xl font-bold border-none bg-transparent focus:outline-none text-gray-800 placeholder-gray-300"
              />
            </div>
            <div className="border-t border-gray-100 pt-4">
              <label className={FIELD_LABEL}>English Title *</label>
              <input
                type="text"
                value={form.title_en}
                onChange={e => handleTitleEnChange(e.target.value)}
                placeholder="Enter English title..."
                className="w-full text-lg font-semibold border-none bg-transparent focus:outline-none text-gray-700 placeholder-gray-300"
              />
            </div>
          </div>

          {/* Summaries */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <div>
              <label className={FIELD_LABEL}>中文摘要 <span className="text-gray-300 font-normal">(限 160 字)</span></label>
              <textarea
                value={form.summary_zh}
                onChange={e => setField('summary_zh', e.target.value)}
                maxLength={160}
                rows={2}
                placeholder="输入文章摘要，将显示在列表卡片中..."
                className="w-full px-0 py-1 text-sm border-none bg-transparent resize-none focus:outline-none text-gray-700 placeholder-gray-300"
              />
              <p className="text-right text-xs text-gray-400">{(form.summary_zh || '').length}/160</p>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <label className={FIELD_LABEL}>English Summary <span className="text-gray-300 font-normal">(max 160 chars)</span></label>
              <textarea
                value={form.summary_en}
                onChange={e => setField('summary_en', e.target.value)}
                maxLength={160}
                rows={2}
                placeholder="Article summary shown in the blog list card..."
                className="w-full px-0 py-1 text-sm border-none bg-transparent resize-none focus:outline-none text-gray-600 placeholder-gray-300"
              />
              <p className="text-right text-xs text-gray-400">{(form.summary_en || '').length}/160</p>
            </div>
          </div>

          {/* Content Editor with Language Tabs */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Tab switcher */}
            <div className="flex border-b border-gray-200 bg-gray-50/50">
              {(['zh', 'en'] as const).map(lang => (
                <button
                  key={lang}
                  onClick={() => setActiveTab(lang)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all ${
                    activeTab === lang
                      ? 'bg-white text-gray-900 border-b-2 border-gray-900'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  {lang === 'zh' ? '🇨🇳 中文正文' : '🇺🇸 English Body'}
                </button>
              ))}
            </div>

            <div className="p-4">
              {activeTab === 'zh' ? (
                <MarkdownEditor
                  value={form.content_zh || ''}
                  onChange={v => setField('content_zh', v)}
                  placeholder="在此输入中文正文（支持 Markdown 格式，可粘贴图片自动上传）..."
                  onImageUpload={handleImageUpload}
                />
              ) : (
                <MarkdownEditor
                  value={form.content_en || ''}
                  onChange={v => setField('content_en', v)}
                  placeholder="Enter English body content here (Markdown supported, paste images to auto-upload)..."
                  onImageUpload={handleImageUpload}
                />
              )}
              <p className="mt-2 text-xs text-gray-400 flex items-center gap-1">
                <Info className="w-3 h-3" />
                支持 Markdown 格式 · 可直接粘贴图片自动上传插入
              </p>
            </div>
          </div>
        </div>

        {/* ---- Right: Sidebar ---- */}
        <div className="w-72 flex-shrink-0 space-y-3 sticky top-4">
          {/* Publish Settings */}
          <div className={SECTION_CLASS}>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">发布设置</h3>
            <div>
              <label className={FIELD_LABEL}>状态</label>
              <select
                value={form.status}
                onChange={e => setField('status', e.target.value as 'draft' | 'published' | 'archived')}
                className={INPUT_CLASS}
              >
                <option value="draft">草稿</option>
                <option value="published">已发布</option>
                <option value="archived">已下架</option>
              </select>
            </div>
            <div>
              <label className={FIELD_LABEL}><Calendar className="w-3 h-3 inline mr-1" />发布日期</label>
              <input
                type="date"
                value={form.publish_date || ''}
                onChange={e => setField('publish_date', e.target.value)}
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className={FIELD_LABEL}><User className="w-3 h-3 inline mr-1" />作者</label>
              <input
                type="text"
                value={form.author}
                onChange={e => setField('author', e.target.value)}
                className={INPUT_CLASS}
                placeholder="Admin"
              />
            </div>
          </div>

          {/* Category & Tags */}
          <div className={SECTION_CLASS}>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">分类与标签</h3>
            <div>
              <label className={FIELD_LABEL}>分类</label>
              <select
                value={form.category || ''}
                onChange={e => setField('category', e.target.value)}
                className={INPUT_CLASS}
              >
                <option value="">— 不设分类 —</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={FIELD_LABEL}><Tag className="w-3 h-3 inline mr-1" />标签</label>
              <TagInput tags={form.tags || []} onChange={tags => setField('tags', tags)} />
              <p className="text-xs text-gray-400 mt-1">回车或逗号添加，退格删除</p>
            </div>
          </div>

          {/* Cover Image - uses ImageInput with built-in media library */}
          <div className={SECTION_CLASS}>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">封面图</h3>
            <ImageInput
              value={form.cover_image || ''}
              onChange={(url) => setField('cover_image', url)}
              aspectRatio="video"
              maxWidth={1200}
            />
            <p className="text-[10px] text-gray-400">建议尺寸 1200×630px · 点击「媒体库」可从数据库选择</p>
          </div>

          {/* URL Slug */}
          <div className={SECTION_CLASS}>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <Link className="w-3 h-3" /> URL 路径 *
            </h3>
            <div>
              <label className={FIELD_LABEL}>Slug</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400 whitespace-nowrap">/blog/</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={e => setField('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="my-article-slug"
                  className={`${INPUT_CLASS} font-mono text-xs`}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">只能含小写字母、数字和连字符</p>
            </div>
            {!isEdit && form.title_en && (
              <button
                type="button"
                onClick={regenerateSlugFromEnglishTitle}
                className="text-xs text-blue-500 hover:text-blue-700 underline"
              >
                从英文标题自动生成
              </button>
            )}
          </div>

          {/* SEO (collapsible) */}
          <div className={SECTION_CLASS}>
            <button
              type="button"
              onClick={() => setSeoExpanded(v => !v)}
              className="flex items-center justify-between w-full"
            >
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                <Hash className="w-3 h-3 inline mr-1" />SEO 设置
              </h3>
              {seoExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>

            {seoExpanded && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className={FIELD_LABEL}>SEO 标题（中文）</label>
                  <input type="text" value={form.seo_title_zh || ''} onChange={e => setField('seo_title_zh', e.target.value)} className={INPUT_CLASS} placeholder="默认使用文章标题" />
                </div>
                <div>
                  <label className={FIELD_LABEL}>SEO Title (EN)</label>
                  <input type="text" value={form.seo_title_en || ''} onChange={e => setField('seo_title_en', e.target.value)} className={INPUT_CLASS} placeholder="Defaults to article title" />
                </div>
                <div>
                  <label className={FIELD_LABEL}>Meta 描述（中文）</label>
                  <textarea rows={2} value={form.seo_desc_zh || ''} onChange={e => setField('seo_desc_zh', e.target.value)} maxLength={160} className={`${INPUT_CLASS} resize-none`} placeholder="中文 SEO 描述..." />
                </div>
                <div>
                  <label className={FIELD_LABEL}>Meta Description (EN)</label>
                  <textarea rows={2} value={form.seo_desc_en || ''} onChange={e => setField('seo_desc_en', e.target.value)} maxLength={160} className={`${INPUT_CLASS} resize-none`} placeholder="English meta description..." />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
