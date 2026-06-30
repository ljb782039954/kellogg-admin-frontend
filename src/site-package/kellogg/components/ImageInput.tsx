import { Upload, X, RefreshCw, Loader2 } from 'lucide-react';
import { getPreviewUrl } from '@/core/lib/utils';
import { useImageInputUpload } from '@/core/items/media';
import AdminImage from './AdminImage';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ImageInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  aspectRatio?: 'square' | 'video' | 'banner' | 'auto';
  className?: string;
  acceptType?: string;
  maxWidth?: number;
}

export default function ImageInput({
  label,
  value,
  onChange,
  aspectRatio = 'auto',
  className = '',
  acceptType = 'image/*',
  maxWidth,
}: ImageInputProps) {
  const {
    dupMatches,
    error,
    fileInputRef,
    isUploading,
    clearImage,
    handleFileChange,
    handleForceUpload,
    handleReuse,
    resetUploadState,
  } = useImageInputUpload({ maxWidth, onChange });

  const aspectRatioClass = {
    square: 'aspect-square max-w-[140px]',
    video: 'aspect-video max-w-[220px]',
    banner: 'aspect-[3/1] max-w-[320px]',
    auto: 'min-h-[80px] h-24 max-w-[160px]',
  }[aspectRatio];

  const previewUrl = getPreviewUrl(value, true);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptType}
        className="hidden"
        disabled={isUploading}
      />

      {error && (
        <div className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded">
          {error}
        </div>
      )}

      {!value ? (
        <button
          type="button"
          onClick={() => !isUploading && fileInputRef.current?.click()}
          disabled={isUploading}
          className={`w-full ${aspectRatioClass} border-2 border-dashed border-gray-200 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all flex flex-col items-center justify-center gap-2 text-gray-500 disabled:opacity-50`}
        >
          {isUploading ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : (
            <>
              <Upload className="w-6 h-6" />
              <span className="text-xs font-medium">本地上传</span>
            </>
          )}
        </button>
      ) : (
        <div className={`relative w-full ${aspectRatioClass} bg-gray-100 rounded-xl overflow-hidden border border-gray-200 group`}>
          {previewUrl && (previewUrl.match(/\.(mp4|webm|ogg)$/i) || acceptType.includes('video')) ? (
            <video
              src={previewUrl}
              className="w-full h-full object-contain bg-black"
            />
          ) : (
            <AdminImage
              src={value}
              thumbnail={true}
              fallbackSrc={value}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          )}

          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}

          {!isUploading && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                title="更换图片"
              >
                <RefreshCw className="w-4 h-4 text-gray-700" />
              </button>

              <button
                type="button"
                onClick={clearImage}
                className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                title="删除图片"
              >
                <X className="w-4 h-4 text-red-500" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* 图片查重提示弹窗 */}
      <Dialog open={dupMatches.length > 0} onOpenChange={(isOpen) => !isOpen && resetUploadState()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              检测到相似图片
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              系统检测到图库中已有与您当前上传内容高度相似（95% 以上）的图片，建议直接复用以节约存储空间并提升加载效率。
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-60 mt-3 border rounded-xl overflow-hidden">
            <div className="divide-y divide-gray-100 bg-gray-50/50">
              {dupMatches.map(({ image: simImg, similarity }) => (
                <div key={simImg.key} className="flex items-center gap-3 p-3 bg-white">
                  <div className="w-12 h-12 rounded-lg border bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                    <AdminImage 
                      src={simImg.thumbUrl || simImg.url} 
                      fallbackSrc={simImg.url}
                      alt={simImg.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-700 truncate" title={simImg.name}>
                      {simImg.name}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {simImg.dimensions || '未知尺寸'} • 相似度: <span className="font-bold text-orange-600">{(similarity * 100).toFixed(1)}%</span>
                    </p>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="text-xs font-medium text-primary hover:text-primary-hover hover:bg-primary/5 h-8 shrink-0"
                    onClick={() => handleReuse(simImg.url)}
                  >
                    复用此图
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>

          <DialogFooter className="mt-4 pt-3 border-t flex gap-2 sm:justify-end">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={resetUploadState}
              className="text-xs text-gray-500"
            >
              取消
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleForceUpload}
              className="text-xs"
            >
              坚持上传新图
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
