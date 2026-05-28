import { useState, useRef } from 'react';
import { 
  Bold, Italic, Underline, Strikethrough, Code, 
  List, Link, Sparkles, Maximize2, Eye, Edit2 
} from 'lucide-react';
import { handleFormatHelper, getPreviewHtml } from './utils';

interface RichInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
  label?: string;
  showMaximize?: boolean;
  onMaximize?: () => void;
}

export default function RichInput({
  value,
  onChange,
  placeholder = '',
  rows = 4,
  label,
  showMaximize = false,
  onMaximize,
}: RichInputProps) {
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFormat = (action: string) => {
    // 强制切回编辑模式
    if (isPreview) setIsPreview(false);

    if (!textareaRef.current) {
      setTimeout(() => handleFormat(action), 50);
      return;
    }

    const textarea = textareaRef.current;
    const { newValue, newStart, newEnd } = handleFormatHelper(textarea, value, action);
    
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newStart, newEnd);
    }, 0);
  };

  const renderToolbar = () => (
    <div className="flex flex-wrap items-center justify-between p-1.5 bg-gray-50 border-b border-gray-100 rounded-t-lg">
      <div className="flex flex-wrap items-center gap-0.5">
        <button
          type="button"
          disabled={isPreview}
          onClick={() => handleFormat('bold')}
          className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          title="加粗"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          disabled={isPreview}
          onClick={() => handleFormat('italic')}
          className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          title="斜体"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          disabled={isPreview}
          onClick={() => handleFormat('underline')}
          className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          title="下划线"
        >
          <Underline className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          disabled={isPreview}
          onClick={() => handleFormat('strike')}
          className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          title="删除线"
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </button>
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <button
          type="button"
          disabled={isPreview}
          onClick={() => handleFormat('code')}
          className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          title="代码"
        >
          <Code className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          disabled={isPreview}
          onClick={() => handleFormat('list')}
          className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          title="列表"
        >
          <List className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          disabled={isPreview}
          onClick={() => handleFormat('link')}
          className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          title="链接"
        >
          <Link className="w-3.5 h-3.5" />
        </button>
        {/* <button
          type="button"
          disabled={isPreview}
          onClick={() => handleFormat('textColor')}
          className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          title="高亮色文字"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
        </button> */}
      </div>

      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className={`p-1.5 rounded transition-all flex items-center gap-1 text-xs font-medium ${
            isPreview 
              ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100' 
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
          }`}
          title={isPreview ? '编辑文本' : '实时预览'}
        >
          {isPreview ? (
            <>
              <Edit2 className="w-3 h-3" />
              <span>编辑</span>
            </>
          ) : (
            <>
              <Eye className="w-3 h-3" />
              <span>预览</span>
            </>
          )}
        </button>
        {showMaximize && onMaximize && (
          <button
            type="button"
            onClick={onMaximize}
            className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
            title="🔍 放大编辑 (Full Screen Edit)"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden w-full">
      {label && (
        <div className="flex items-center justify-between px-3 py-1 bg-gray-100/50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase">
          <span>{label}</span>
        </div>
      )}
      {renderToolbar()}
      {isPreview ? (
        <div 
          className="p-3 bg-gray-50/50 overflow-y-auto text-sm content-rich-text break-words"
          style={{ minHeight: `${rows * 28}px`, maxHeight: '300px' }}
          dangerouslySetInnerHTML={getPreviewHtml(value)}
        />
      ) : (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full p-3 text-sm border-none focus:outline-none resize-y text-gray-800"
        />
      )}
    </div>
  );
}
