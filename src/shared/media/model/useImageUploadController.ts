import { useRef, useState } from 'react';
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
  const selectionIdRef = useRef(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duplicates, setDuplicates] = useState<DuplicateImageMatch[]>([]);
  const [pendingUpload, setPendingUpload] = useState<PreparedImageUpload | null>(null);

  function isCurrentSelection(selectionId: number) {
    return selectionIdRef.current === selectionId;
  }

  function clear() {
    setDuplicates([]);
    setPendingUpload(null);
    setError(null);
  }

  async function uploadPrepared(prepared: PreparedImageUpload, selectionId?: number) {
    const result = await uploadImage(prepared.file, prepared.dimensions, prepared.hash);
    if (selectionId !== undefined && !isCurrentSelection(selectionId)) {
      return false;
    }

    onChange(result.url);
    return true;
  }

  async function selectFile(file: File | null) {
    if (!file) {
      return;
    }

    const selectionId = selectionIdRef.current + 1;
    selectionIdRef.current = selectionId;

    setIsUploading(true);
    setDuplicates([]);
    setPendingUpload(null);
    setError(null);

    try {
      const prepared = await prepareImageUpload(file, { maxWidth });
      if (!isCurrentSelection(selectionId)) {
        return;
      }

      const images = prepared.hash ? await getImagesList() : [];
      if (!isCurrentSelection(selectionId)) {
        return;
      }

      const matches = findDuplicateImages(prepared.hash, images, duplicateThreshold);

      if (matches.length > 0) {
        setDuplicates(matches);
        setPendingUpload(prepared);
        return;
      }

      const uploaded = await uploadPrepared(prepared, selectionId);
      if (uploaded && isCurrentSelection(selectionId)) {
        clear();
      }
    } catch (err) {
      if (!isCurrentSelection(selectionId)) {
        return;
      }

      console.error('Upload failed:', err);
      setError('图片上传失败，请重试');
    } finally {
      if (isCurrentSelection(selectionId)) {
        setIsUploading(false);
      }
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

    const selectionId = selectionIdRef.current;
    setIsUploading(true);
    setError(null);

    try {
      const uploaded = await uploadPrepared(pendingUpload, selectionId);
      if (uploaded && isCurrentSelection(selectionId)) {
        clear();
      }
    } catch (err) {
      if (!isCurrentSelection(selectionId)) {
        return;
      }

      console.error('Upload failed:', err);
      setError('图片上传失败，请重试');
    } finally {
      if (isCurrentSelection(selectionId)) {
        setIsUploading(false);
      }
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
