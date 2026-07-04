import { type ChangeEvent, useRef, useState } from 'react';
import { useContent } from '@/core-adminApp/context/ContentContext';
import { calculateHashSimilarity, calculateImageHash, resizeImage } from '@/core-adminApp/lib/image';
import type { R2Image } from '@/cms/types';
import { getImageDimensions } from './mediaUpload';

export interface DuplicateImageMatch {
  image: R2Image;
  similarity: number;
}

interface PendingImageUpload {
  file: File;
  dimensions?: { width: number; height: number };
  hash: string;
}

interface UseImageInputUploadOptions {
  maxWidth?: number;
  onChange: (value: string) => void;
}

const DUPLICATE_SIMILARITY_THRESHOLD = 0.95;

export function findDuplicateImageMatches(
  imageHash: string,
  images: R2Image[],
  threshold = DUPLICATE_SIMILARITY_THRESHOLD
): DuplicateImageMatch[] {
  if (!imageHash) return [];

  return images
    .map((image) => ({
      image,
      similarity: image.hash ? calculateHashSimilarity(imageHash, image.hash) : 0,
    }))
    .filter((item) => item.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity);
}

export function useImageInputUpload({
  maxWidth,
  onChange,
}: UseImageInputUploadOptions) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, getImagesList } = useContent();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dupMatches, setDupMatches] = useState<DuplicateImageMatch[]>([]);
  const [pendingUpload, setPendingUpload] = useState<PendingImageUpload | null>(null);

  const resetUploadState = () => {
    setDupMatches([]);
    setPendingUpload(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      let fileToUpload = file;
      const dimensions = await getImageDimensions(file);

      if (maxWidth && file.type.startsWith('image/')) {
        try {
          fileToUpload = await resizeImage(file, maxWidth);
        } catch (resizeError) {
          console.warn('Image resize failed, uploading original:', resizeError);
        }
      }

      const imageHash = await calculateImageHash(fileToUpload);

      if (imageHash) {
        const dbImages = await getImagesList();
        const matches = findDuplicateImageMatches(imageHash, dbImages);

        if (matches.length > 0) {
          setDupMatches(matches);
          setPendingUpload({
            file: fileToUpload,
            dimensions,
            hash: imageHash,
          });
          setIsUploading(false);
          return;
        }
      }

      const result = await uploadImage(fileToUpload, dimensions, imageHash || undefined);
      onChange(result.url);
    } catch (err) {
      console.error('Upload failed:', err);
      setError('图片上传失败，请重试');
    } finally {
      setIsUploading(false);
    }
  };

  const handleReuse = (url: string) => {
    onChange(url);
    resetUploadState();
  };

  const handleForceUpload = async () => {
    if (!pendingUpload) return;

    setIsUploading(true);
    try {
      const result = await uploadImage(
        pendingUpload.file,
        pendingUpload.dimensions,
        pendingUpload.hash
      );
      onChange(result.url);
    } catch (err) {
      console.error('Upload failed:', err);
      setError('上传失败');
    } finally {
      setIsUploading(false);
      resetUploadState();
    }
  };

  const clearImage = () => {
    onChange('');
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return {
    dupMatches,
    error,
    fileInputRef,
    isUploading,
    clearImage,
    handleFileChange,
    handleForceUpload,
    handleReuse,
    resetUploadState,
  };
}
