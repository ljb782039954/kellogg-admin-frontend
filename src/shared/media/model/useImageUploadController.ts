import { useState } from 'react';
import { getImagesList, uploadImage } from '../api/media.api';
import { findDuplicateImages, type DuplicateImageMatch } from '../domain/findDuplicateImages';
import { prepareImageUpload, type PreparedImageUpload } from '../domain/prepareImageUpload';

interface UseImageUploadControllerOptions {
  value: string;
  onChange: (value: string) => void;
  maxWidth?: number;
  duplicateThreshold?: number;
}

export function useImageUploadController({
  onChange,
  maxWidth,
  duplicateThreshold = 0.95,
}: UseImageUploadControllerOptions) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duplicates, setDuplicates] = useState<DuplicateImageMatch[]>([]);
  const [pendingUpload, setPendingUpload] = useState<PreparedImageUpload | null>(null);

  function clear() {
    setDuplicates([]);
    setPendingUpload(null);
    setError(null);
  }

  async function uploadPrepared(prepared: PreparedImageUpload) {
    const result = await uploadImage(prepared.file, prepared.dimensions, prepared.hash);
    onChange(result.url);
  }

  async function selectFile(file: File | null) {
    if (!file) {
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const prepared = await prepareImageUpload(file, { maxWidth });
      const images = prepared.hash ? await getImagesList() : [];
      const matches = findDuplicateImages(prepared.hash, images, duplicateThreshold);

      if (matches.length > 0) {
        setDuplicates(matches);
        setPendingUpload(prepared);
        return;
      }

      await uploadPrepared(prepared);
      clear();
    } catch (err) {
      console.error('Upload failed:', err);
      setError('图片上传失败，请重试');
    } finally {
      setIsUploading(false);
    }
  }

  function reuseImage(url: string) {
    onChange(url);
    clear();
  }

  async function forceUpload() {
    if (!pendingUpload) {
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      await uploadPrepared(pendingUpload);
      clear();
    } catch (err) {
      console.error('Upload failed:', err);
      setError('上传失败');
    } finally {
      setIsUploading(false);
    }
  }

  return {
    isUploading,
    error,
    duplicates,
    hasPendingUpload: pendingUpload !== null,
    selectFile,
    reuseImage,
    forceUpload,
    clear,
  };
}
