import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useBlogEditor } from '../model/useBlogEditor';
import { BlogForm } from './BlogForm';

export function BlogEditor() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const numericId = id ? Number(id) : undefined;
  const {
    form,
    isEdit,
    isFetching,
    isSaving,
    categories,
    onTitleEnChange,
    autoGenerateSlug,
    save,
  } = useBlogEditor(numericId);

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-sm">加载文章中...</span>
      </div>
    );
  }

  return (
    <BlogForm
      form={form}
      isEdit={isEdit}
      isSaving={isSaving}
      categories={categories}
      onBack={() => navigate('/blog')}
      onSaveDraft={() => save('draft')}
      onPublish={() => save('published')}
      onTitleEnChange={onTitleEnChange}
      onAutoSlug={autoGenerateSlug}
    />
  );
}
