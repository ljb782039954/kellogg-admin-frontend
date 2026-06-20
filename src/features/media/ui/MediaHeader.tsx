import { Search, Loader2, Plus, RefreshCw } from 'lucide-react';
import { Input } from '@/ui/primitives/input';
import { Button } from '@/ui/primitives/button';
import { Badge } from '@/ui/primitives/badge';
import { cn } from '@/lib/utils';

interface MediaHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalCount: number;
  unusedCount: number;
  isUploading: boolean;
  isLoading: boolean;
  onUploadClick: () => void;
  onRefresh: () => void;
}

export function MediaHeader({
  searchQuery,
  onSearchChange,
  totalCount,
  unusedCount,
  isUploading,
  isLoading,
  onUploadClick,
  onRefresh,
}: MediaHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">图片管理</h2>
          <p className="text-sm text-gray-500">管理所有图片资源并追踪引用情况</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={onUploadClick} disabled={isUploading} className="gap-2 shadow-sm">
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            上传新图片
          </Button>
          <Button variant="outline" onClick={onRefresh} disabled={isLoading} size="icon" className="shadow-sm">
            <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} />
          </Button>
        </div>
      </div>
      <div className="bg-gray-50/50 p-4 border-b flex items-center gap-4 rounded-t-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="搜索文件名..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-white border-gray-200"
          />
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
          <span>共 {totalCount} 张图片</span>
          <span className="flex items-center gap-1.5">
            <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none h-5 px-1.5">
              {unusedCount}
            </Badge>
            张未被引用
          </span>
        </div>
      </div>
    </div>
  );
}
