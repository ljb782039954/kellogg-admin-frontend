import { useId, useRef } from 'react';
import { Loader2, RefreshCw, Upload, X } from 'lucide-react';
import AdminImage from '@/admin/components/AdminImage';
import { getPreviewUrl } from '@/lib/utils';

interface ImageUploadControlProps {
  label?: string;
  value: string;
  error: string | null;
  isUploading: boolean;
  aspectRatio?: 'square' | 'video' | 'banner' | 'auto';
  className?: string;
  acceptType?: string;
  onSelectFile: (file: File | null) => void;
  onClearImage: () => void;
}

export function ImageUploadControl({
  label,
  value,
  error,
  isUploading,
  aspectRatio = 'auto',
  className = '',
  acceptType = 'image/*',
  onSelectFile,
  onClearImage,
}: ImageUploadControlProps) {
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectRatioClass = {
    square: 'aspect-square max-w-[140px]',
    video: 'aspect-video max-w-[220px]',
    banner: 'aspect-[3/1] max-w-[320px]',
    auto: 'min-h-[80px] h-24 max-w-[160px]',
  }[aspectRatio];

  const previewUrl = getPreviewUrl(value, true);
  const isVideoPreview =
    Boolean(previewUrl?.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) || acceptType.includes('video');

  function openFilePicker() {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  }

  function clearImage() {
    onClearImage();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={fileInputId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        id={fileInputId}
        type="file"
        ref={fileInputRef}
        onChange={(event) => onSelectFile(event.target.files?.[0] ?? null)}
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
          onClick={openFilePicker}
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
        <div
          className={`relative w-full ${aspectRatioClass} bg-gray-100 rounded-xl overflow-hidden border border-gray-200 group`}
        >
          {previewUrl && isVideoPreview ? (
            <video src={previewUrl} className="w-full h-full object-contain bg-black" />
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
                onClick={openFilePicker}
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
    </div>
  );
}
