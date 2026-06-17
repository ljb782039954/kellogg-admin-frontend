import { useImageUploadController } from '@/shared/media/model/useImageUploadController';
import { DuplicateImageDialog } from '@/shared/media/ui/DuplicateImageDialog';
import { ImageUploadControl } from '@/shared/media/ui/ImageUploadControl';

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
  const controller = useImageUploadController({
    value,
    onChange,
    maxWidth,
  });

  function clearImage() {
    onChange('');
    controller.clear();
  }

  return (
    <>
      <ImageUploadControl
        label={label}
        value={value}
        error={controller.error}
        isUploading={controller.isUploading}
        aspectRatio={aspectRatio}
        className={className}
        acceptType={acceptType}
        onSelectFile={controller.selectFile}
        onClearImage={clearImage}
      />
      <DuplicateImageDialog
        duplicates={controller.duplicates}
        isUploading={controller.isUploading}
        onReuse={controller.reuseImage}
        onForceUpload={controller.forceUpload}
        onCancel={controller.clear}
      />
    </>
  );
}
