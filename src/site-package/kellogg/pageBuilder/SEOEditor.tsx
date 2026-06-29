// import React from 'react';
import { Label } from '@/components/ui/label';
import BilingualInput from '../components/BilingualInput';
import { Settings, Globe } from 'lucide-react';
import { type Translation } from '@/core/types';

interface SEOEditorProps {
  seo: {
    title: Translation;
    description: Translation;
    keywords?: Translation;
    targetCountry?: string;
  };
  onChange: (seo: any) => void;
}

export function SEOEditor({ seo, onChange }: SEOEditorProps) {
  const handleTitleChange = (title: Translation) => {
    onChange({ ...seo, title });
  };

  const handleDescriptionChange = (description: Translation) => {
    onChange({ ...seo, description });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-4 border-b">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Globe className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">SEO 页面设置</h3>
          <p className="text-sm text-gray-500">配置该页面在搜索引擎（如 Google）中显示的信息</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg flex gap-3">
        <div className="mt-0.5">
          <Settings className="w-4 h-4 text-amber-600" />
        </div>
        <p className="text-xs text-amber-800 leading-relaxed">
          温馨提示：SEO 信息不会直接显示在网页正文中。它决定了谷歌搜索结果里显示的标题和简介。好的 SEO 内容能显著提高点击率。
        </p>
      </div>

      <div className="space-y-4 pt-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">SEO 页面标题 (Meta Title)</Label>
            <span className="text-[10px] text-gray-400 font-mono">必填</span>
          </div>
          <BilingualInput
            value={seo.title || { zh: '', en: '' }}
            onChange={handleTitleChange}
            placeholder={{ zh: '输入在搜索引擎中显示的标题', en: 'Enter SEO Title' }}
          />
          <p className="text-[10px] text-gray-400">建议长度在 50-60 个字符以内</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">SEO 页面描述 (Meta Description)</Label>
            <span className="text-[10px] text-gray-400 font-mono">建议填写</span>
          </div>
          <BilingualInput
            value={seo.description || { zh: '', en: '' }}
            onChange={handleDescriptionChange}
            placeholder={{ zh: '输入页面简要描述，吸引用户点击', en: 'Enter SEO Description' }}
          />
          <p className="text-[10px] text-gray-400">详细描述页面内容，建议 150 个字符左右</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">核心关键词 (Keywords)</Label>
            </div>
            <BilingualInput
              value={seo.keywords || { zh: '', en: '' }}
              onChange={(keywords) => onChange({ ...seo, keywords })}
              placeholder={{ zh: '如: 重磅卫衣, 街头服饰', en: 'e.g. Heavyweight Hoodie, Streetwear' }}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">GEO 目标市场 (Target Country)</Label>
            </div>
            <input
              type="text"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={seo.targetCountry || ''}
              onChange={(e) => onChange({ ...seo, targetCountry: e.target.value })}
              placeholder="如: USA, UK, Europe, Australia"
            />
            <p className="text-[10px] text-gray-400 mt-1">用于填充 JSON-LD 的 areaServed，提高地区检索排名</p>
          </div>
        </div>
      </div>

      {/* 模拟搜索结果预览 */}
      <div className="mt-8 pt-6 border-t">
        <Label className="text-xs text-gray-400 uppercase tracking-wider">谷歌搜索预览 (模拟)</Label>
        <div className="mt-3 p-4 border rounded-xl bg-white shadow-sm max-w-md">
          <div className="text-[#1a0dab] text-xl font-medium truncate hover:underline cursor-pointer">
            {seo.title?.zh || '页面标题预览'}
          </div>
          <div className="text-[#006621] text-sm mt-1 mb-1 truncate">
            https://kelloggfashion.com/...
          </div>
          <div className="text-[#4d5156] text-sm line-clamp-2 leading-relaxed">
            {seo.description?.zh || '这里将显示您在下方输入的 SEO 页面描述内容，它是用户在谷歌搜索结果中看到的简介。'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SEOEditor;
