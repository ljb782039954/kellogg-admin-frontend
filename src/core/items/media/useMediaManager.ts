import { useEffect, useMemo, useState } from 'react';
import { useContent } from '@/core/context/ContentContext';
import { useImageUsage } from '@/core/hooks/useImageUsage';
import type { R2Image } from '@/core/types';
import { findSimilarMediaImages } from './mediaSimilarity';
import { getImageDimensions } from './mediaUpload';

interface MediaManagerNotifier {
  success?: (message: string) => void;
  error?: (message: string) => void;
}

interface MediaManagerMessages {
  loadFailure: string;
  uploadSuccess: string;
  uploadFailure: string;
  deleteConfirm: string;
  deleteInUseConfirm: (count: number) => string;
  deleteSuccess: string;
  deleteFailure: string;
}

export interface UseMediaManagerOptions {
  confirmDelete?: (message: string) => boolean;
  messages?: Partial<MediaManagerMessages>;
  notify?: MediaManagerNotifier;
}

const DEFAULT_MESSAGES: MediaManagerMessages = {
  loadFailure: '无法加载媒体库',
  uploadSuccess: '上传成功',
  uploadFailure: '上传失败',
  deleteConfirm: '确定要永久删除这张图片吗？此操作不可撤销。',
  deleteInUseConfirm: count => `警告：该图片正在被 ${count} 处位置使用。删除将导致这些位置显示异常！\n\n确定要继续删除吗？`,
  deleteSuccess: '图片已删除',
  deleteFailure: '删除失败',
};

export function useMediaManager(options: UseMediaManagerOptions = {}) {
  const {
    confirmDelete,
    messages: customMessages,
    notify,
  } = options;
  const messages = { ...DEFAULT_MESSAGES, ...customMessages };
  const { getImagesList, uploadImage, deleteImage } = useContent();

  const [images, setImages] = useState<R2Image[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const usageMap = useImageUsage(images);

  const loadImages = async () => {
    setIsLoading(true);

    try {
      const data = await getImagesList();
      setImages(data);
    } catch (error) {
      console.error('Failed to load media library:', error);
      notify?.error?.(messages.loadFailure);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredImages = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return images;

    return images.filter(image => image.name.toLowerCase().includes(query));
  }, [images, searchQuery]);

  const selectedImage = useMemo(
    () => images.find(image => image.key === selectedKey),
    [images, selectedKey]
  );

  const currentUsages = useMemo(() => {
    if (!selectedImage) return [];
    return usageMap[selectedImage.key] || [];
  }, [selectedImage, usageMap]);

  const unusedCount = useMemo(
    () => images.filter(image => !usageMap[image.key] || usageMap[image.key].length === 0).length,
    [images, usageMap]
  );

  const similarImages = useMemo(
    () => findSimilarMediaImages(selectedImage, images),
    [images, selectedImage]
  );

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);

    try {
      const dimensions = await getImageDimensions(file);
      await uploadImage(file, dimensions);
      notify?.success?.(messages.uploadSuccess);
      await loadImages();
    } catch (error) {
      console.error('Upload failed:', error);
      notify?.error?.(messages.uploadFailure);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedKey || !selectedImage) return;

    const message = currentUsages.length > 0
      ? messages.deleteInUseConfirm(currentUsages.length)
      : messages.deleteConfirm;

    if (confirmDelete && !confirmDelete(message)) return;

    try {
      await deleteImage(selectedKey);
      notify?.success?.(messages.deleteSuccess);
      setSelectedKey(null);
      await loadImages();
    } catch (error) {
      console.error('Delete failed:', error);
      notify?.error?.(messages.deleteFailure);
    }
  };

  return {
    currentUsages,
    filteredImages,
    images,
    isLoading,
    isUploading,
    searchQuery,
    selectedImage,
    selectedKey,
    similarImages,
    unusedCount,
    usageMap,
    handleDelete,
    handleFileUpload,
    loadImages,
    setSearchQuery,
    setSelectedKey,
  };
}
