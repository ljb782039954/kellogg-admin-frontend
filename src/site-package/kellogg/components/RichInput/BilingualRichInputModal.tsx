import { useState } from 'react';
import { X, Save, Languages } from 'lucide-react';
import type { Translation } from '@/core/types';
import RichInput from './RichInput';
import { getPreviewHtml } from '@/core/rich-text';

interface BilingualRichInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: Translation;
  onChange: (value: Translation) => void;
  placeholder?: { zh?: string; en?: string };
}

export default function BilingualRichInputModal({
  isOpen,
  onClose,
  value,
  onChange,
  placeholder = {},
}: BilingualRichInputModalProps) {
  const [activeTab, setActiveTab] = useState<'zh' | 'en' | 'compare'>('zh');
  const [localZh, setLocalZh] = useState(value.zh || '');
  const [localEn, setLocalEn] = useState(value.en || '');

  if (!isOpen) return null;

  const handleSave = () => {
    onChange({ zh: localZh, en: localEn });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md transition-opacity animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-6xl h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* 头部标题与Tab */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0 bg-gray-50/50">
          <div className="flex items-center gap-4">
            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
              <Languages className="w-5 h-5 text-gray-600" />
              双语富文本放大编辑
            </h3>
            
            {/* Tabs */}
            <div className="flex bg-gray-200/60 p-0.5 rounded-lg text-sm ml-4">
              <button
                type="button"
                onClick={() => setActiveTab('zh')}
                className={`px-4 py-1.5 rounded-md font-medium transition-all ${
                  activeTab === 'zh' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                中文编辑 (ZH)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('en')}
                className={`px-4 py-1.5 rounded-md font-medium transition-all ${
                  activeTab === 'en' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                English Edit (EN)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('compare')}
                className={`px-4 py-1.5 rounded-md font-medium transition-all ${
                  activeTab === 'compare' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                双语对照
              </button>
            </div>
          </div>
          
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 主编辑区 */}
        <div className="flex-1 overflow-hidden p-6 bg-white">
          {activeTab === 'zh' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              {/* 左侧编辑 (这里不需要展示放大按钮) */}
              <div className="h-full overflow-hidden flex flex-col justify-between">
                <RichInput
                  label="中文编辑 (ZH)"
                  value={localZh}
                  onChange={setLocalZh}
                  placeholder={placeholder.zh || '请输入中文 Markdown 内容...'}
                  rows={16}
                />
              </div>
              {/* 右侧预览 */}
              <div className="flex flex-col h-full overflow-hidden">
                <div className="text-xs font-bold text-gray-400 uppercase mb-2">实时效果预览</div>
                <div 
                  className="flex-1 overflow-y-auto p-4 bg-gray-50 rounded-xl border border-gray-100 content-rich-text break-words"
                  dangerouslySetInnerHTML={getPreviewHtml(localZh)}
                />
              </div>
            </div>
          )}

          {activeTab === 'en' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              {/* 左侧编辑 */}
              <div className="h-full overflow-hidden flex flex-col justify-between">
                <RichInput
                  label="English Edit (EN)"
                  value={localEn}
                  onChange={setLocalEn}
                  placeholder={placeholder.en || 'Enter English Markdown content...'}
                  rows={16}
                />
              </div>
              {/* 右侧预览 */}
              <div className="flex flex-col h-full overflow-hidden">
                <div className="text-xs font-bold text-gray-400 uppercase mb-2">Real-time Preview</div>
                <div 
                  className="flex-1 overflow-y-auto p-4 bg-gray-50 rounded-xl border border-gray-100 content-rich-text break-words"
                  dangerouslySetInnerHTML={getPreviewHtml(localEn)}
                />
              </div>
            </div>
          )}

          {activeTab === 'compare' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              {/* 左侧中文 */}
              <div className="h-full overflow-hidden flex flex-col justify-between">
                <RichInput
                  label="中文编辑 (ZH)"
                  value={localZh}
                  onChange={setLocalZh}
                  placeholder={placeholder.zh || '请输入中文 Markdown 内容...'}
                  rows={16}
                />
              </div>
              {/* 右侧英文 */}
              <div className="h-full overflow-hidden flex flex-col justify-between">
                <RichInput
                  label="English Edit (EN)"
                  value={localEn}
                  onChange={setLocalEn}
                  placeholder={placeholder.en || 'Enter English Markdown content...'}
                  rows={16}
                />
              </div>
            </div>
          )}
        </div>

        {/* 底部操作栏 */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 flex-shrink-0 bg-gray-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 rounded-xl text-sm font-medium text-gray-600 transition-all"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-medium shadow-md shadow-gray-200 active:scale-[0.98]"
          >
            <Save className="w-4 h-4" />
            保存更改 (Apply)
          </button>
        </div>

      </div>
    </div>
  );
}
