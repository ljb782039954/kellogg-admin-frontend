import { useCallback, useEffect, useMemo, useState } from 'react';
import { useContent } from '@/core-adminApp/context/ContentContext';
import type { R2Image } from '@/core-adminApp/types';
import {
  filterMediaLibraryImages,
  findMediaLibraryImage,
} from './mediaLibraryDialog';

interface UseMediaLibraryDialogOptions {
  onClose: () => void;
  onSelect: (url: string) => void;
  open: boolean;
}

export function useMediaLibraryDialog({
  onClose,
  onSelect,
  open,
}: UseMediaLibraryDialogOptions) {
  const { getImagesList } = useContent();
  const [images, setImages] = useState<R2Image[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const loadImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getImagesList();
      setImages(data);
    } catch (err) {
      console.error('Failed to load media library:', err);
    } finally {
      setIsLoading(false);
    }
  }, [getImagesList]);

  useEffect(() => {
    if (open) {
      loadImages();
    }
  }, [loadImages, open]);

  const filteredImages = useMemo(
    () => filterMediaLibraryImages(images, searchQuery),
    [images, searchQuery]
  );

  const selectedImage = useMemo(
    () => findMediaLibraryImage(images, selectedKey),
    [images, selectedKey]
  );

  const handleConfirm = () => {
    if (!selectedImage) return;

    onSelect(selectedImage.url);
    onClose();
  };

  return {
    filteredImages,
    images,
    isLoading,
    searchQuery,
    selectedImage,
    selectedKey,
    handleConfirm,
    loadImages,
    setSearchQuery,
    setSelectedKey,
  };
}
