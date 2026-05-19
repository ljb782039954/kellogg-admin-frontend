import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Send,
  Tag,
  X,
  Loader2,
  Image as ImageIcon,
  Globe,
  Hash,
  User,
  Calendar,
  ChevronDown,
  ChevronUp,
  Info,
  Link,
} from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import type { BlogInput } from '@/types';
import ImageInput from '@/admin/components/ImageInput';

// ---- Minimal Markdown Editor (no external deps required) ----
// We use a simple textarea with a toolbar for now.
// If md-editor-rt is installed, swap this out.
function MarkdownEditor({
  value,
  onChange,
  placeholder,
  onImageUpload,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  onImageUpload?: (file: File) => Promise<string>;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertAtCursor = (before: string, after = '') => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.substring(start, end);
    const newVal = value.substring(0, start) + before + selected + after + value.substring(end);
    onChange(newVal);
    // Restore cursor
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  };

  const toolbarActions = [
    { label: 'B', title: '加粗', action: () => insertAtCursor('**', '**') },
    { label: 'I', title: '斜体', action: () => insertAtCursor('*', '*'), italic: true },
    { label: 'H2', title: '二级标题', action: () => insertAtCursor('\n## ', '') },
    { label: 'H3', title: '三级标题', action: () => insertAtCursor('\n### ', '') },
    { label: '""', title: '引用', action: () => insertAtCursor('\n> ', '') },
    { label: '</>', title: '代码块', action: () => insertAtCursor('\n```\n', '\n```') },
    { label: '—', title: '分割线', action: () => insertAtCursor('\n---\n', '') },
  ];

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (!onImageUpload) return;
    const items = Array.from(e.clipboardData.items);
    const imageItem = items.find(item => item.type.startsWith('image/'));
    if (imageItem) {
      e.preventDefault();
      const file = imageItem.getAsFile();
      if (!file) return;
      toast.loading('正在上传粘贴的图片...');
      try {
        const url = await onImageUpload(file);
        insertAtCursor(`\n![image](${url})\n`);
        toast.dismiss();
        toast.success('图片上传成功');
      } catch {
        toast.dismiss();
        toast.error('图片上传失败');
      }
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex gap-1 p-2 bg-gray-50 border-b border-gray-200 flex-wrap">
        {toolbarActions.map(({ label, title, action, italic }) => (
          <button
            key={title}
            type="button"
            title={title}
            onClick={action}
            className={`px-2.5 py-1 text-xs rounded-md bg-white border border-gray-200 text-gray-600 hover:border-gray-400 hover:bg-gray-100 transition-all font-mono ${italic ? 'italic' : 'font-bold'}`}
          >
            {label}
          </button>
        ))}
        {onImageUpload && (
          <label
            title="上传图片"
            className="px-2.5 py-1 text-xs rounded-md bg-white border border-gray-200 text-gray-600 hover:border-gray-400 hover:bg-gray-100 transition-all cursor-pointer flex items-center gap-1"
          >
            <ImageIcon className="w-3 h-3" />
            图片
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async e => {
                const file = e.target.files?.[0];
                if (!file || !onImageUpload) return;
                toast.loading('正在上传图片...');
                try {
                  const url = await onImageUpload(file);
                  insertAtCursor(`\n![image](${url})\n`);
                  toast.dismiss();
                  toast.success('图片上传成功');
                } catch {
                  toast.dismiss();
                  toast.error('图片上传失败');
                }
              }}
            />
          </label>
        )}
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        onPaste={handlePaste}
        placeholder={placeholder || '在此输入 Markdown 内容...（支持粘贴图片自动上传）'}
        className="w-full h-96 p-4 font-mono text-sm text-gray-700 resize-none focus:outline-none bg-white placeholder-gray-300"
        style={{ lineHeight: '1.75' }}
      />
    </div>
  );
}

// ---- Tag Input Component ----
function TagInput({ tags, onChange }: { tags: string[]; onChange: (tags: string[]) => void }) {
  const [inputVal, setInputVal] = useState('');

  const addTag = (val: string) => {
    const trimmed = val.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInputVal('');
  };

  const removeTag = (tag: string) => onChange(tags.filter(t => t !== tag));

  return (
    <div className="flex flex-wrap gap-1.5 p-2 border border-gray-200 rounded-xl bg-gray-50/50 min-h-[44px]">
      {tags.map(tag => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg"
        >
          {tag}
          <button type="button" onClick={() => removeTag(tag)} className="hover:text-blue-900">
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputVal}
        onChange={e => setInputVal(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(inputVal);
          }
          if (e.key === 'Backspace' && !inputVal && tags.length > 0) {
            removeTag(tags[tags.length - 1]);
          }
        }}
        onBlur={() => inputVal && addTag(inputVal)}
        placeholder={tags.length === 0 ? '输入标签，回车确认...' : ''}
        className="flex-1 min-w-[80px] bg-transparent text-sm text-gray-700 focus:outline-none placeholder-gray-400"
      />
    </div>
  );
}

// ---- Slug Generator ----
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 80);
}

const CATEGORY_OPTIONS = [
  '',
  'Industry News',
  'Fabric Guide',
  'OEM Tips',
  'Trend Report',
  'Company News',
];

const FIELD_LABEL = 'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5';
const INPUT_CLASS = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all placeholder-gray-300';
const SECTION_CLASS = 'bg-white rounded-xl border border-gray-200 p-4 space-y-3';

// ---- Main Component ----
export default function BlogEditor() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;

  const [isFetching, setIsFetching] = useState(isEdit);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'zh' | 'en'>('zh');
  const [seoExpanded, setSeoExpanded] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  const [form, setForm] = useState<BlogInput>({
    slug: '',
    title_zh: '',
    title_en: '',
    summary_zh: '',
    summary_en: '',
    content_zh: '',
    content_en: '',
    cover_image: '',
    category: '',
    tags: [],
    author: 'Admin',
    status: 'draft',
    seo_title_zh: '',
    seo_title_en: '',
    seo_desc_zh: '',
    seo_desc_en: '',
    publish_date: '',
  });

  const [blogId, setBlogId] = useState<number | null>(null);

  // Load blog categories dynamically
  useEffect(() => {
    api.getBlogCategories().then(cats => {
      setCategories(cats.map((c: any) => c.name_en));
    }).catch(() => {
      // Fallback to hardcoded if API fails
      setCategories(['Industry News', 'Fabric Guide', 'OEM Tips', 'Trend Report', 'Company News']);
    });
  }, []);

  // Load existing blog for edit mode
  useEffect(() => {
    if (!isEdit || !id) return;
    (async () => {
      setIsFetching(true);
      try {
        const blog = await api.getBlog(id);
        setBlogId(blog.id);
        setForm({
          slug: blog.slug,
          title_zh: blog.title_zh,
          title_en: blog.title_en,
          summary_zh: blog.summary_zh || '',
          summary_en: blog.summary_en || '',
          content_zh: blog.content_zh || '',
          content_en: blog.content_en || '',
          cover_image: blog.cover_image || '',
          category: blog.category || '',
          tags: blog.tags || [],
          author: blog.author || 'Admin',
          status: blog.status || 'draft',
          seo_title_zh: blog.seo_title_zh || '',
          seo_title_en: blog.seo_title_en || '',
          seo_desc_zh: blog.seo_desc_zh || '',
          seo_desc_en: blog.seo_desc_en || '',
          publish_date: blog.publish_date || '',
        });
      } catch {
        toast.error('无法加载文章数据');
        navigate('/blog');
      } finally {
        setIsFetching(false);
      }
    })();
  }, [id, isEdit, navigate]);

  const setField = <K extends keyof BlogInput>(key: K, value: BlogInput[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  // Auto-generate slug from English title (only on new article)
  const handleTitleEnChange = (val: string) => {
    setField('title_en', val);
    if (!isEdit && !form.slug) {
      setField('slug', generateSlug(val));
    }
  };

  // Image upload handler for markdown editor (reuses existing /api/upload)
  const handleImageUpload = async (file: File): Promise<string> => {
    const result = await api.uploadImage(file);
    return result.url;
  };

  // Save as draft
  const handleSaveDraft = () => saveArticle('draft');

  // Publish
  const handlePublish = () => saveArticle('published');

  const saveArticle = async (targetStatus: 'draft' | 'published') => {
    if (!form.slug || !form.title_zh || !form.title_en) {
      toast.error('请填写必要字段：Slug、中文标题、英文标题');
      return;
    }

    setIsSaving(true);
    const payload: BlogInput = {
      ...form,
      status: targetStatus,
      publish_date: form.publish_date || new Date().toISOString().split('T')[0],
    };

    try {
      if (isEdit && blogId) {
        await api.updateBlog(blogId, payload);
        toast.success(targetStatus === 'published' ? '文章已发布更新' : '草稿已保存');
      } else {
        await api.createBlog(payload);
        toast.success(targetStatus === 'published' ? '文章已发布' : '草稿已创建');
        navigate('/blog');
      }
    } catch (err: any) {
      toast.error(err?.message || '保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

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
          onClick={() => navigate('/blog')}
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
                onChange={e => setField('status', e.target.value as any)}
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
                onClick={() => setField('slug', generateSlug(form.title_en))}
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
