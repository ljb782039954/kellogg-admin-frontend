import { Search, Loader2, Plus, RefreshCw, Trash2, CheckSquare, Square } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { MediaUsageFilter } from '@/core-adminApp/items/media/useMediaManager';

interface MediaHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalCount: number;
  usedCount: number;
  unusedCount: number;
  selectedCount: number;
  selectedUsedCount: number;
  isUploading: boolean;
  isLoading: boolean;
  isBulkDeleting: boolean;
  isSelectionMode: boolean;
  isSyncingReferences: boolean;
  usageFilter: MediaUsageFilter;
  setUsageFilter: (filter: MediaUsageFilter) => void;
  onUploadClick: () => void;
  onBulkDelete: () => void;
  onClearSelection: () => void;
  onRefresh: () => void;
  onSyncReferences: () => void;
  onToggleSelectionMode: () => void;
}

export function MediaHeader({
  searchQuery,
  setSearchQuery,
  totalCount,
  usedCount,
  unusedCount,
  selectedCount,
  selectedUsedCount,
  isUploading,
  isLoading,
  isBulkDeleting,
  isSelectionMode,
  isSyncingReferences,
  usageFilter,
  setUsageFilter,
  onUploadClick,
  onBulkDelete,
  onClearSelection,
  onRefresh,
  onSyncReferences,
  onToggleSelectionMode
}: MediaHeaderProps) {
  const filterOptions: Array<{ value: MediaUsageFilter; label: string; count: number }> = [
    { value: 'all', label: '全部', count: totalCount },
    { value: 'used', label: '已使用', count: usedCount },
    { value: 'unused', label: '未使用', count: unusedCount },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">图片管理</h2>
          <p className="text-sm text-gray-500">管理所有图片资源并追踪引用情况</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            onClick={onSyncReferences}
            disabled={isSyncingReferences || isLoading}
            className="gap-2 shadow-sm"
          >
            <RefreshCw className={cn("w-4 h-4", isSyncingReferences && "animate-spin")} />
            同步引用索引
          </Button>
          <Button
            variant={isSelectionMode ? "secondary" : "outline"}
            onClick={onToggleSelectionMode}
            className="gap-2 shadow-sm"
          >
            {isSelectionMode ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
            {isSelectionMode ? '退出多选' : '多选'}
          </Button>
          <Button onClick={onUploadClick} disabled={isUploading} className="gap-2 shadow-sm">
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            上传新图片
          </Button>
          <Button variant="outline" onClick={onRefresh} disabled={isLoading} size="icon" className="shadow-sm">
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
          </Button>
        </div>
      </div>

      <div className="bg-gray-50/50 p-4 border-b flex flex-col xl:flex-row xl:items-center gap-4 rounded-t-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="搜索文件名..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white border-gray-200"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {filterOptions.map(option => (
            <Button
              key={option.value}
              type="button"
              variant={usageFilter === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setUsageFilter(option.value)}
              className="h-8 gap-1.5"
            >
              {option.label}
              <span className={cn(
                "rounded-full px-1.5 text-[10px] leading-4",
                usageFilter === option.value ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
              )}>
                {option.count}
              </span>
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 font-medium xl:ml-auto">
          <span>共 {totalCount} 张图片</span>
          <span className="flex items-center gap-1.5">
            <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none h-5 px-1.5">
              {unusedCount}
            </Badge>
            张未被引用
          </span>
        </div>
      </div>

      {isSelectionMode && (
        <div className="bg-white border border-gray-100 rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
          <div className="text-sm text-gray-600">
            已选择 <span className="font-semibold text-gray-900">{selectedCount}</span> 张图片
            {selectedUsedCount > 0 && (
              <span className="ml-2 text-orange-600">其中 {selectedUsedCount} 张正在使用</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              disabled={selectedCount === 0 || isBulkDeleting}
            >
              清空选择
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={onBulkDelete}
              disabled={selectedCount === 0 || isBulkDeleting}
              className="gap-2"
            >
              {isBulkDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              批量删除
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
