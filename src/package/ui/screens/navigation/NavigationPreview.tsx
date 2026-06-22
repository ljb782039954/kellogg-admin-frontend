import { Globe, Share2, Menu } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/package/ui/primitives/card';
import { Badge } from '@/package/ui/primitives/badge';
import { identity } from '@/package/identity/config';
import { getPreviewUrl } from '@/lib/utils';
import type { HeaderContent } from '@/package/types';

interface NavigationPreviewProps {
  header: HeaderContent;
  language: 'zh' | 'en';
}

export function NavigationPreview({ header, language }: NavigationPreviewProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          预览效果
          <Badge variant="outline" className="ml-2">{language === 'zh' ? '中文' : 'English'}</Badge>
        </CardTitle>
        <CardDescription>在浏览器中的实际显示效果（简易预览，完整下拉效果请在前台查看）</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {identity.logo && (
                <img
                  src={getPreviewUrl(identity.logo)}
                  alt="Logo"
                  className="w-8 h-8 object-contain rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              <span className="text-xl font-bold text-gray-800">{identity.name[language]}</span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              {header.navItems.slice(0, 5).map((item, index) => (
                <div key={index} className="group relative">
                  <span
                    className={`text-sm font-medium transition-colors ${
                      item.pageDeleted
                        ? 'text-red-500 line-through'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {item.name[language]}
                    {item.children && item.children.length > 0 && (
                      <span className="ml-1 text-xs">▼</span>
                    )}
                  </span>
                </div>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <button className="p-2 rounded-full text-gray-600 hover:text-gray-900 border border-gray-200">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200">
                <Globe className="w-4 h-4" />
                {language === 'zh' ? '中文' : 'EN'}
              </button>
              <button className="md:hidden p-2 text-gray-600">
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
