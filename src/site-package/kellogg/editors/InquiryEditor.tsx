import { useState, useEffect } from 'react';
import { Save, Loader2, FileText, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '@/core/lib/api';
import { useContent } from '@/core/context/ContentContext';
import BilingualInput from '../components/BilingualInput';
import BilingualInputAera from '../components/BilingualInputAera';
import { toast } from 'sonner';

interface InquiryConfig {
  title: { zh: string; en: string };
  description: { zh: string; en: string };
}

const defaultConfig: InquiryConfig = {
  title: { zh: '联系我们要样品', en: 'Contact Us For Samples' },
  description: { 
    zh: '如果您有任何关于产品的咨询，请填写下方表格，我们的团队会尽快与您联系。', 
    en: 'If you have any inquiries about our products, please fill out the form below and our team will get back to you as soon as possible.' 
  }
};

export default function InquiryEditor() {
  const { findPage, updatePage } = useContent();
  const [config, setConfig] = useState<InquiryConfig>(defaultConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setIsLoading(true);
    try {
      const page = findPage('system-inquiry');
      if (page && page.content) {
        setConfig(page.content);
      } else {
        const pageData = await api.getPageById('system-inquiry');
        if (pageData && pageData.content) {
          setConfig(pageData.content);
        }
      }
    } catch (err) {
      console.error('Failed to load inquiry config from page:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updatePage('system-inquiry', { content: config });
      toast.success('询盘页面配置已保存');
    } catch (err) {
      toast.error('保存失败');
    } finally {
      setIsSaving(false);
    }
  };

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
              zh: '如果您有任何关于产品的咨询，请填写下方表格，我们的团队会尽快与您联系。', 
              en: 'If you have any inquiries about our products, please fill out the form below and our team will get back to you as soon as possible.' 
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
