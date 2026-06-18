import { useRef } from 'react';
import { Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { uploadImage } from '@/shared/media/api/media.api';

const TOOLBAR_CONFIG = [
  { label: 'B', title: '加粗', before: '**', after: '**', italic: false },
  { label: 'I', title: '斜体', before: '*', after: '*', italic: true },
  { label: 'H2', title: '二级标题', before: '\n## ', after: '', italic: false },
  { label: 'H3', title: '三级标题', before: '\n### ', after: '', italic: false },
  { label: '""', title: '引用', before: '\n> ', after: '', italic: false },
  { label: '</>', title: '代码块', before: '\n```\n', after: '\n```', italic: false },
  { label: '—', title: '分割线', before: '\n---\n', after: '', italic: false },
];

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertAtCursor = (before: string, after = '') => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.substring(start, end);
    const newVal = value.substring(0, start) + before + selected + after + value.substring(end);
    onChange(newVal);
    window.setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  };

  const handleImageUpload = async (file: File) => {
    const loadingId = toast.loading('正在上传图片...');
    try {
      const result = await uploadImage(file);
      insertAtCursor(`\n![image](${result.url})\n`);
      toast.dismiss(loadingId);
      toast.success('图片上传成功');
    } catch {
      toast.dismiss(loadingId);
      toast.error('图片上传失败');
    }
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = Array.from(e.clipboardData.items);
    const imageItem = items.find((item) => item.type.startsWith('image/'));
    if (imageItem) {
      e.preventDefault();
      const file = imageItem.getAsFile();
      if (file) await handleImageUpload(file);
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex gap-1 p-2 bg-gray-50 border-b border-gray-200 flex-wrap">
        {TOOLBAR_CONFIG.map(({ label, title, before, after, italic }) => (
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
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
            }}
          />
        </label>
      </div>

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onPaste={handlePaste}
        placeholder={placeholder || '在此输入 Markdown 内容...（支持粘贴图片自动上传）'}
        className="w-full h-96 p-4 font-mono text-sm text-gray-700 resize-none focus:outline-none bg-white placeholder-gray-300"
        style={{ lineHeight: '1.75' }}
      />
    </div>
  );
}

export function MarkdownEditorSkeleton() {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex gap-1 p-2 bg-gray-50 border-b border-gray-200">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="w-8 h-6 rounded-md bg-gray-200 animate-pulse" />
        ))}
      </div>
      <div className="w-full h-96 p-4 flex items-center justify-center text-gray-300 gap-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        加载编辑器...
      </div>
    </div>
  );
}
