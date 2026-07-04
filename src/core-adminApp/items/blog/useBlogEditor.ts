import { useEffect, useState } from 'react';
import { createEmptyBlogInput } from './blogDefaults';
import { mapBlogToInput } from './blogMapper';
import { createBlogSavePayload } from './blogPayload';
import { generateBlogSlug } from './blogSlug';
import { validateBlogBeforeSave } from './blogValidation';
import { api } from '@/core-adminApp/lib/api';
import type { BlogInput } from '@/cms/types';

type BlogEditorLanguage = 'zh' | 'en';
type BlogSaveStatus = 'draft' | 'published';

const DEFAULT_FALLBACK_BLOG_CATEGORIES = [
  'Industry News',
  'Fabric Guide',
  'OEM Tips',
  'Trend Report',
  'Company News',
];

interface BlogEditorNotifier {
  success?: (message: string) => void;
  error?: (message: string) => void;
}

interface BlogEditorMessages {
  loadFailure: string;
  updatePublished: string;
  updateDraft: string;
  createPublished: string;
  createDraft: string;
  saveFailure: string;
}

export interface BlogEditorSavedEvent {
  operation: 'create' | 'update';
  status: BlogSaveStatus;
  blogId: number | null;
  payload: BlogInput;
}

export interface UseBlogEditorOptions {
  blogId?: string | number | null;
  fallbackCategories?: string[];
  messages?: Partial<BlogEditorMessages>;
  notify?: BlogEditorNotifier;
  onBack?: () => void;
  onLoadError?: () => void;
  onSaved?: (event: BlogEditorSavedEvent) => void;
}

const DEFAULT_MESSAGES: BlogEditorMessages = {
  loadFailure: '无法加载文章数据',
  updatePublished: '文章已发布更新',
  updateDraft: '草稿已保存',
  createPublished: '文章已发布',
  createDraft: '草稿已创建',
  saveFailure: '保存失败，请重试',
};

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function useBlogEditor(options: UseBlogEditorOptions = {}) {
  const {
    blogId: routeBlogId,
    fallbackCategories = DEFAULT_FALLBACK_BLOG_CATEGORIES,
    messages: customMessages,
    notify,
    onBack,
    onLoadError,
    onSaved,
  } = options;
  const messages = { ...DEFAULT_MESSAGES, ...customMessages };
  const isEdit = routeBlogId !== undefined && routeBlogId !== null && String(routeBlogId) !== '';

  const [isFetching, setIsFetching] = useState(isEdit);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<BlogEditorLanguage>('zh');
  const [seoExpanded, setSeoExpanded] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [form, setForm] = useState<BlogInput>(() => createEmptyBlogInput());
  const [blogId, setBlogId] = useState<number | null>(null);

  useEffect(() => {
    api.getBlogCategories()
      .then(cats => {
        setCategories(cats.map(cat => cat.name_en));
      })
      .catch(() => {
        setCategories(fallbackCategories);
      });
  }, [fallbackCategories]);

  useEffect(() => {
    if (!isEdit || routeBlogId === undefined || routeBlogId === null) return;

    let cancelled = false;

    (async () => {
      setIsFetching(true);
      try {
        const blog = await api.getBlog(routeBlogId);
        if (cancelled) return;

        setBlogId(blog.id);
        setForm(mapBlogToInput(blog));
      } catch {
        if (cancelled) return;

        notify?.error?.(messages.loadFailure);
        onLoadError?.();
      } finally {
        if (!cancelled) {
          setIsFetching(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isEdit, messages.loadFailure, notify, onLoadError, routeBlogId]);

  const setField = <K extends keyof BlogInput>(key: K, value: BlogInput[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleTitleEnChange = (value: string) => {
    setForm(prev => ({
      ...prev,
      title_en: value,
      slug: !isEdit && !prev.slug ? generateBlogSlug(value) : prev.slug,
    }));
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    const result = await api.uploadImage(file);
    return result.url;
  };

  const saveArticle = async (targetStatus: BlogSaveStatus) => {
    const validationError = validateBlogBeforeSave(form);
    if (validationError) {
      notify?.error?.(validationError);
      return;
    }

    setIsSaving(true);

    try {
      const payload = createBlogSavePayload(form, targetStatus);

      if (isEdit && blogId) {
        await api.updateBlog(blogId, payload);
        notify?.success?.(
          targetStatus === 'published' ? messages.updatePublished : messages.updateDraft
        );
        onSaved?.({ operation: 'update', status: targetStatus, blogId, payload });
      } else {
        await api.createBlog(payload);
        notify?.success?.(
          targetStatus === 'published' ? messages.createPublished : messages.createDraft
        );
        onSaved?.({ operation: 'create', status: targetStatus, blogId: null, payload });
      }
    } catch (error) {
      notify?.error?.(getErrorMessage(error, messages.saveFailure));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDraft = () => saveArticle('draft');
  const handlePublish = () => saveArticle('published');
  const goBack = () => onBack?.();
  const regenerateSlugFromEnglishTitle = () => setField('slug', generateBlogSlug(form.title_en));

  return {
    activeTab,
    blogId,
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
  };
}
