import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import BilingualInput from '../../components/BilingualInput';
import { FileText, Info } from 'lucide-react';
import { type Translation } from '@/core/types';

interface PageSettingsEditorProps {
  title: Translation;
  path: string;
  isFixed: boolean;
  onUpdate: (updates: { title?: Translation; path?: string }) => void;
}

/**
 * 页面基础设置编辑器 - 用于修改页面标题和 URL 路径
 */
export function PageSettingsEditor({ title, path, isFixed, onUpdate }: PageSettingsEditorProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-4 border-b">
        <div className="p-2 bg-purple-50 rounded-lg">
          <FileText className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">页面基础设置</h3>
          <p className="text-sm text-gray-500">管理页面的显示名称和访问路径</p>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <div className="space-y-2">
          <Label className="text-sm font-medium">页面标题 (网站内部显示)</Label>
          <BilingualInput
            value={title}
            onChange={(newTitle) => onUpdate({ title: newTitle })}
            placeholder={{ zh: '请输入中文标题', en: 'Enter English title' }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="path" className="text-sm font-medium">URL 路径 (路由地址)</Label>
          <div className="flex items-center">
            <span className="text-gray-500 font-mono mr-1">/</span>
            <Input
              id="path"
              disabled={isFixed}
              value={path.replace(/^\//, '')}
              onChange={(e) => {
                const newPath = `/${e.target.value.replace(/[^a-z0-9-]/gi, '-').toLowerCase()}`;
                onUpdate({ path: newPath });
              }}
              placeholder="about-us"
            />
          </div>
          {isFixed ? (
            <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded mt-2 border border-amber-100">
              <Info className="w-3.5 h-3.5" />
              <span>这是一个系统固定页面，为了保证网站功能正常，其 URL 路径无法修改。</span>
            </div>
          ) : (
            <p className="text-xs text-gray-400">
              提示：只能使用小写字母、数字和连字符。修改路径后，旧的链接将无法访问。
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PageSettingsEditor;
