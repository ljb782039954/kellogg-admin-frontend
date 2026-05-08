import { useRef, useState } from 'react';
import { Upload, X, RefreshCw, Loader2 } from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import { getPreviewUrl } from '@/lib/utils';
import { resizeImage } from '@/lib/image';

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
  const { uploadImage } = useContent();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);


    try {
      let fileToUpload = file;
      
      // If it's an image and maxWidth is provided, resize it first
      if (maxWidth && file.type.startsWith('image/')) {
        console.log(`Resizing image to maxWidth: ${maxWidth}`);
        try {
          fileToUpload = await resizeImage(file, maxWidth);
          console.log(`Resized from ${file.size} to ${fileToUpload.size} bytes`);
        } catch (resizeErr) {
          console.warn('Image resize failed, uploading original:', resizeErr);
        }
      }

      console.log('Starting upload for file:', fileToUpload.name);
      // 尝试上传到 API
      const result = await uploadImage(fileToUpload);
      console.log('Upload success, URL:', result.url);
      onChange(result.url);
    } catch (err) {
      console.error('Upload failed:', err);
      // 如果 API 上传失败，回退到 base64（用于离线或本地测试）
      console.warn('API upload failed, falling back to base64:', err);
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log('Base64 conversion success');
        onChange(reader.result as string);
      };
      reader.onerror = () => {
        console.error('FileReader error');
        setError('图片读取失败');
      };
      reader.readAsDataURL(file);
    } finally {
      console.log('Setting isUploading to false');
      setIsUploading(false);
    }
  };

  const clearImage = () => {
    onChange('');
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 根据宽高比设置容器样式，且限制最大尺寸以防撑太大
  const aspectRatioClass = {
    square: 'aspect-square max-w-[140px]',
    video: 'aspect-video max-w-[220px]',
    banner: 'aspect-[3/1] max-w-[320px]',
    auto: 'min-h-[80px] h-24 max-w-[160px]',
  }[aspectRatio];

  // 本地开发时，如果图片 URL 是线上域名，替换为本地后端 URL 使得能顺利预览
  const previewUrl = getPreviewUrl(value);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}

      {/* 隐藏的实际文件输入框 */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptType}
        className="hidden"
        disabled={isUploading}
      />

      {/* 错误提示 */}
      {error && (
        <div className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded">
          {error}
        </div>
      )}

      {/* 图片显示/上传区域 */}
      {!value ? (
        // 无图片时：显示上传区域
        <button
          type="button"
          onClick={() => !isUploading && fileInputRef.current?.click()}
          disabled={isUploading}
          className={`w-full ${aspectRatioClass} border-2 border-dashed border-gray-200 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all flex flex-col items-center justify-center gap-2 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-sm font-medium">上传中...</span>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8" />
              <span className="text-sm font-medium">
                {acceptType.includes('video') ? '点击上传视频' : '点击上传图片'}
              </span>
              <span className="text-xs text-gray-400">
                {acceptType.includes('video') ? '支持 MP4, WebM 等视频格式' : '支持 JPG、PNG、GIF 等格式'}
              </span>
            </>
          )}
        </button>
      ) : (
        // 有图片时：直接显示图片预览
        <div className={`relative w-full ${aspectRatioClass} bg-gray-100 rounded-xl overflow-hidden border border-gray-200 group`}>
          {previewUrl && (previewUrl.match(/\.(mp4|webm|ogg)$/i) || acceptType.includes('video')) ? (
            <video
              src={previewUrl}
              controls
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

          {/* 上传中遮罩 */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}

          {/* 悬浮操作按钮 */}
          {!isUploading && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
              {/* 更换文件 */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                title={acceptType.includes('video') ? "更换视频" : "更换图片"}
              >
                <RefreshCw className="w-5 h-5 text-gray-700" />
              </button>

              {/* 删除文件 */}
              <button
                type="button"
                onClick={clearImage}
                className="p-3 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                title={acceptType.includes('video') ? "删除视频" : "删除图片"}
              >
                <X className="w-5 h-5 text-red-500" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
