import { Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { DEFAULT_MARKDOWN_TOOLBAR, useMarkdownEditor } from '@/core-adminApp/markdown';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onImageUpload?: (file: File) => Promise<string>;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder,
  onImageUpload,
}: MarkdownEditorProps) {
  const {
    handlePaste,
    insertAtCursor,
    textareaRef,
    uploadAndInsertImage,
  } = useMarkdownEditor({
    value,
    onChange,
    onImageUpload,
    notify: {
      loading: message => toast.loading(message),
      success: message => toast.success(message),
      error: message => toast.error(message),
      dismiss: id => toast.dismiss(id),
    },
  });

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex gap-1 p-2 bg-gray-50 border-b border-gray-200 flex-wrap">
        {DEFAULT_MARKDOWN_TOOLBAR.map(({ label, title, before, after, italic }) => (
          <button
            key={title}
            type="button"
            title={title}
            onClick={() => insertAtCursor(before, after)}
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
              onChange={async event => {
                const file = event.target.files?.[0];
                if (!file) return;

                await uploadAndInsertImage(file);
              }}
            />
          </label>
        )}
      </div>

      <textarea
        ref={textareaRef}
        value={value}
        onChange={event => onChange(event.target.value)}
        onPaste={handlePaste}
        placeholder={placeholder || '在此输入 Markdown 内容...（支持粘贴图片自动上传）'}
        className="w-full h-96 p-4 font-mono text-sm text-gray-700 resize-none focus:outline-none bg-white placeholder-gray-300"
        style={{ lineHeight: '1.75' }}
      />
    </div>
  );
}
