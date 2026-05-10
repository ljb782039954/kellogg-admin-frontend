import { 
  Image as ImageIcon, 
  FileText, 
  Calendar, 
  Maximize2, 
  RefreshCw,
  Trash2,
  Download,
  Link as LinkIcon,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type R2Image } from '@/types';
import { type UsageInfo } from '@/hooks/useImageUsage';
import { format } from 'date-fns';

interface MediaDetailsProps {
  image: R2Image | undefined;
  usages: UsageInfo[];
  onDownload: () => void;
  onDelete: () => void;
}

export function MediaDetails({
  image,
  usages,
  onDownload,
  onDelete
}: MediaDetailsProps) {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!image) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-400 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center shadow-inner">
          <ImageIcon className="w-8 h-8 opacity-20" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">未选择图片</p>
          <p className="text-xs">点击左侧图片查看详情或进行管理操作</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h3 className="font-semibold text-sm text-gray-900">预览</h3>
        <div className="aspect-square rounded-xl border bg-white shadow-inner flex items-center justify-center overflow-hidden p-2">
          <img 
            src={image.url} 
            alt="Preview" 
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </div>

      {/* 引用情况 */}
      <div className="space-y-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">引用情况</h4>
          <LinkIcon className="w-3 h-3 text-gray-300" />
        </div>
        {usages.length > 0 ? (
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {usages.map((usage, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs">
                <Badge variant="outline" className="text-[9px] py-0 px-1 shrink-0 font-normal border-gray-200">
                  {usage.type}
                </Badge>
                <span className="text-gray-600 font-medium truncate" title={usage.name}>{usage.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-orange-600 bg-orange-50 p-2 rounded-lg border border-orange-100">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p className="text-[11px] font-medium leading-tight">
              当前图片未在任何页面或产品中使用，可以安全删除。
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium uppercase tracking-wider">
            <FileText className="w-3 h-3" />
            文件名
          </div>
          <p className="text-sm font-semibold break-all text-gray-700">{image.name}</p>
        </div>

        {image.dimensions && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium uppercase tracking-wider">
              <Maximize2 className="w-3 h-3" />
              原始尺寸
            </div>
            <p className="text-sm font-semibold text-gray-700">{image.dimensions}</p>
          </div>
        )}

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium uppercase tracking-wider">
            <RefreshCw className="w-3 h-3" />
            文件大小
          </div>
          <p className="text-sm font-semibold text-gray-700">{formatSize(image.size)}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium uppercase tracking-wider">
            <Calendar className="w-3 h-3" />
            上传时间
          </div>
          <p className="text-sm font-semibold text-gray-700">
            {format(new Date(image.uploaded), 'yyyy-MM-dd HH:mm:ss')}
          </p>
        </div>
      </div>

      <div className="pt-4 space-y-3">
        <Button 
          variant="outline" 
          className="w-full gap-2 shadow-sm"
          onClick={onDownload}
        >
          <Download className="w-4 h-4" />
          下载原图
        </Button>
        <Button 
          variant="destructive" 
          className="w-full gap-2 shadow-sm"
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4" />
          永久删除
        </Button>
      </div>
    </div>
  );
}
