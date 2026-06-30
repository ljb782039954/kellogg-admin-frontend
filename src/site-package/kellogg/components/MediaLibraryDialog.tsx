import { 
  Search, 
  Image as ImageIcon, 
  FileText, 
  Calendar, 
  Maximize2, 
  Check,
  Loader2,
  RefreshCw,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatMediaFileSize, useMediaLibraryDialog } from '@/core/items/media';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import AdminImage from './AdminImage';

interface MediaLibraryDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export function MediaLibraryDialog({ open, onClose, onSelect }: MediaLibraryDialogProps) {
  const {
    filteredImages,
    images,
    isLoading,
    searchQuery,
    selectedImage,
    selectedKey,
    handleConfirm,
    setSearchQuery,
    setSelectedKey,
  } = useMediaLibraryDialog({ open, onClose, onSelect });

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" />
              媒体库 (R2 图库)
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="搜索文件名..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden min-h-0">
          {/* 左侧列表 */}
          <div className="flex-1 bg-gray-50/50 p-4 overflow-hidden flex flex-col min-h-0">
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-2">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p>加载资源中...</p>
              </div>
            ) : filteredImages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-2">
                <ImageIcon className="w-12 h-12 opacity-20" />
                <p>{searchQuery ? '没有找到匹配的图片' : '图库暂无图片'}</p>
              </div>
            ) : (
              <ScrollArea className="h-full">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pr-4">
                  {filteredImages.map((img) => (
                    <button
                      key={img.key}
                      onClick={() => setSelectedKey(img.key)}
                      className={cn(
                        "group relative aspect-square rounded-xl border-2 overflow-hidden transition-all bg-gray-100 shadow-sm",
                        selectedKey === img.key 
                          ? "border-primary ring-4 ring-primary/10" 
                          : "border-transparent hover:border-primary/30 hover:shadow-md"
                      )}
                    >
                      <AdminImage
                        src={img.thumbUrl || img.url}
                        fallbackSrc={img.url}
                        alt={img.name}
                        className="w-full h-full object-cover aspect-square"
                      />
                      
                      {/* 选中标识 */}
                      {selectedKey === img.key && (
                        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                          <div className="bg-primary text-white rounded-full p-1 shadow-lg">
                            <Check className="w-4 h-4" />
                          </div>
                        </div>
                      )}

                      {/* 文件名遮罩 */}
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-[10px] text-white truncate text-center">
                          {img.name}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          {/* 右侧详情面板 */}
          <div className="w-72 border-l p-6 bg-white overflow-y-auto hidden md:block">
            {selectedImage ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-gray-900">预览</h3>
                  <div className="aspect-square rounded-lg border bg-gray-50 flex items-center justify-center overflow-hidden">
                    <AdminImage 
                      src={selectedImage.url} 
                      alt="Preview" 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <FileText className="w-3 h-3" />
                      文件名
                    </div>
                    <p className="text-sm font-medium break-all">{selectedImage.name}</p>
                  </div>

                  {selectedImage.dimensions && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Maximize2 className="w-3 h-3" />
                        原始尺寸
                      </div>
                      <p className="text-sm font-medium">{selectedImage.dimensions}</p>
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <RefreshCw className="w-3 h-3" />
                      文件大小
                    </div>
                    <p className="text-sm font-medium">{formatMediaFileSize(selectedImage.size)}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      上传时间
                    </div>
                    <p className="text-sm font-medium">
                      {format(new Date(selectedImage.uploaded), 'yyyy-MM-dd HH:mm')}
                    </p>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full text-xs h-8"
                  onClick={() => window.open(selectedImage.url, '_blank')}
                >
                  查看原图
                </Button>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 opacity-40" />
                </div>
                <p className="text-xs">选择一张图片<br/>查看详细信息</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="p-4 border-t bg-white">
          <div className="flex items-center justify-between w-full">
            <p className="text-xs text-gray-400">
              共 {images.length} 个资源
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={onClose}>
                取消
              </Button>
              <Button disabled={!selectedKey} onClick={handleConfirm}>
                确认选择
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
