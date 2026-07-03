import { Save, Loader2, FileText, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useContent } from '@/core-adminApp/context/ContentContext';
import { DEFAULT_INQUIRY_CONFIG, useInquiryEditor } from '@/core-adminApp/items/inquiry';
import BilingualInput from '../../components/BilingualInput';
import BilingualInputAera from '../../components/BilingualInputAera';
import { toast } from 'sonner';

export default function InquiryEditor() {
  const { findPage, updatePage } = useContent();
  const {
    config,
    isLoading,
    isSaving,
    handleSave,
    setConfig,
  } = useInquiryEditor({
    findPage,
    notify: {
      success: message => toast.success(message),
      error: message => toast.error(message),
    },
    updatePage,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
            询盘页面编辑
          </h1>
          <p className="text-gray-500 mt-1 text-sm">配置询盘页面的标题和引导文字。</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-medium shadow-lg disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          保存配置
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-gray-50 bg-gray-50/50">
          <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <FileText className="w-4 h-4" /> 页面头部文本
          </h3>
        </div>
        <div className="p-8 space-y-8">
          <BilingualInput
            label="主标题"
            value={config.title}
            onChange={(val) => setConfig({ ...config, title: val })}
          />
          
          <BilingualInputAera
            label="描述性文字"
            value={config.description}
            onChange={(val) => setConfig({ ...config, description: val })}
            placeholder={{ 
              zh: DEFAULT_INQUIRY_CONFIG.description.zh,
              en: DEFAULT_INQUIRY_CONFIG.description.en,
            }}
          />
        </div>
      </motion.div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex gap-4">
        <Info className="w-6 h-6 text-blue-500 fill-blue-50/50 flex-shrink-0" />
        <div className="text-sm text-blue-700 space-y-1">
          <p className="font-bold">提示</p>
          <p>这些文字将显示在询盘页面的左侧。右侧的表单项和公司信息（地址、电话等）是固定的。</p>
        </div>
      </div>
    </div>
  );
}
