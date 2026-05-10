import { useRef, useState } from 'react';
import { Upload, X, RefreshCw, Loader2, Library } from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import { getPreviewUrl } from '@/lib/utils';
import { resizeImage } from '@/lib/image';
import { MediaLibraryDialog } from './MediaLibraryDialog';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const { uploadImage } = useContent();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      let fileToUpload = file;
      let dimensions: { width: number; height: number } | undefined;

      // 尝试获取图片原始尺寸
      if (file.type.startsWith('image/')) {
        dimensions = await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve({ width: img.width, height: img.height });
          img.onerror = () => resolve(undefined);
          img.src = URL.createObjectURL(file);
        });
      }
      
      // If it's an image and maxWidth is provided, resize it first
      if (maxWidth && file.type.startsWith('image/')) {
        try {
          fileToUpload = await resizeImage(file, maxWidth);
        } catch (resizeErr) {
          console.warn('Image resize failed, uploading original:', resizeErr);
        }
      }

      // 上传图片并附带尺寸信息
      const result = await uploadImage(fileToUpload, dimensions);
      onChange(result.url);
    } catch (err) {
      console.error('Upload failed:', err);
      // 如果 API 上传失败，回退到 base64
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.onerror = () => {
        setError('图片读取失败');
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  const clearImage = () => {
    onChange('');
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const aspectRatioClass = {
    square: 'aspect-square max-w-[140px]',
    video: 'aspect-video max-w-[220px]',
    banner: 'aspect-[3/1] max-w-[320px]',
    auto: 'min-h-[80px] h-24 max-w-[160px]',
  }[aspectRatio];

  const previewUrl = getPreviewUrl(value);

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
        <div className="flex gap-2">
          {/* 上传按钮 */}
          <button
            type="button"
            onClick={() => !isUploading && fileInputRef.current?.click()}
            disabled={isUploading}
            className={`flex-1 ${aspectRatioClass} border-2 border-dashed border-gray-200 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all flex flex-col items-center justify-center gap-2 text-gray-500 disabled:opacity-50`}
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

          {/* 媒体库按钮 */}
          <button
            type="button"
            onClick={() => setShowLibrary(true)}
            disabled={isUploading}
            className={`w-20 ${aspectRatioClass} border-2 border-dashed border-gray-200 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all flex flex-col items-center justify-center gap-2 text-gray-500 disabled:opacity-50`}
          >
            <Library className="w-6 h-6" />
            <span className="text-xs font-medium">媒体库</span>
          </button>
        </div>
      ) : (
        <div className={`relative w-full ${aspectRatioClass} bg-gray-100 rounded-xl overflow-hidden border border-gray-200 group`}>
          {previewUrl && (previewUrl.match(/\.(mp4|webm|ogg)$/i) || acceptType.includes('video')) ? (
            <video
              src={previewUrl}
              className="w-full h-full object-contain bg-black"
            />
          ) : (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23999" stroke-width="2"%3E%3Crect x="3" y="3" width="18" height="18" rx="2" ry="2"/%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"/%3E%3Cpolyline points="21 15 16 10 5 21"/%3E%3C/svg%3E';
              }}
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
                onClick={() => setShowLibrary(true)}
                className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                title="从媒体库选择"
              >
                <Library className="w-4 h-4 text-gray-700" />
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

      {/* 媒体库弹窗 */}
      <MediaLibraryDialog 
        open={showLibrary} 
        onClose={() => setShowLibrary(false)} 
        onSelect={(url) => onChange(url)} 
      />
    </div>
  );
}
